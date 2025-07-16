import { cleanupRateLimit } from "@/lib/rate-limit"

// Clean up old rate limit entries
console.log("Starting rate limit cleanup...")
cleanupRateLimit()
console.log("Rate limit cleanup completed!")
