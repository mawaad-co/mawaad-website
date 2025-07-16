interface RateLimitEntry {
  count: number
  firstAttempt: number
  lastAttempt: number
}

// In-memory store for rate limiting (in production, use Redis or database)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // Base limits
  maxAttempts: 3, // Maximum attempts before rate limiting kicks in
  baseWindowMs: 5 * 60 * 1000, // 5 minutes base window

  // Incremental backoff multipliers
  backoffMultipliers: [1, 2, 4, 8, 16], // 5min, 10min, 20min, 40min, 80min

  // Maximum backoff time (24 hours)
  maxBackoffMs: 24 * 60 * 60 * 1000,
}

export function checkRateLimit(identifier: string): {
  allowed: boolean
  waitTime: number
  message: string
} {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // If no previous attempts, allow
  if (!entry) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    })
    return { allowed: true, waitTime: 0, message: "" }
  }

  // Calculate current backoff level based on attempt count
  const backoffLevel = Math.min(
    entry.count - RATE_LIMIT_CONFIG.maxAttempts,
    RATE_LIMIT_CONFIG.backoffMultipliers.length - 1,
  )

  // If still within allowed attempts, allow
  if (entry.count < RATE_LIMIT_CONFIG.maxAttempts) {
    entry.count++
    entry.lastAttempt = now
    rateLimitStore.set(identifier, entry)
    return { allowed: true, waitTime: 0, message: "" }
  }

  // Calculate wait time based on backoff level
  const multiplier = RATE_LIMIT_CONFIG.backoffMultipliers[Math.max(0, backoffLevel)]
  const waitTime = Math.min(RATE_LIMIT_CONFIG.baseWindowMs * multiplier, RATE_LIMIT_CONFIG.maxBackoffMs)

  // Check if enough time has passed since last attempt
  const timeSinceLastAttempt = now - entry.lastAttempt

  if (timeSinceLastAttempt >= waitTime) {
    // Reset the counter but keep incremental backoff
    entry.count = 1
    entry.lastAttempt = now
    rateLimitStore.set(identifier, entry)
    return { allowed: true, waitTime: 0, message: "" }
  }

  // Still in cooldown period
  const remainingWaitTime = waitTime - timeSinceLastAttempt
  const attemptNumber = entry.count - RATE_LIMIT_CONFIG.maxAttempts + 1

  // Update attempt count for incremental backoff
  entry.count++
  entry.lastAttempt = now
  rateLimitStore.set(identifier, entry)

  return {
    allowed: false,
    waitTime: remainingWaitTime,
    message: `Too many attempts. This is attempt #${attemptNumber} beyond the limit. Please wait before trying again.`,
  }
}

// Clean up old entries (call this periodically)
export function cleanupRateLimit() {
  const now = Date.now()
  const maxAge = RATE_LIMIT_CONFIG.maxBackoffMs * 2 // Keep entries for twice the max backoff time

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.lastAttempt > maxAge) {
      rateLimitStore.delete(key)
    }
  }
}

// Get client IP address from request headers
export function getClientIP(request: Request): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Fallback to a default identifier
  return "unknown"
}
