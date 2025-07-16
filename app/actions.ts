"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { z } from "zod"
import { headers } from "next/headers"
import { checkRateLimit, getClientIP } from "@/lib/rate-limit"

// Define the form schema for validation
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().min(1, { message: "Company name is required" }),
  phone: z.string().min(5, { message: "Please enter a valid phone number" }),
  message: z.string().optional(),
})

// Create SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

// Send email using AWS SES
export async function sendContactEmail(prevState: any, formData: FormData) {
  try {
    // Get client IP for rate limiting
    const headersList = headers()
    const request = new Request("http://localhost", {
      headers: headersList,
    })
    const clientIP = getClientIP(request)
    console.log("Client IP:", clientIP)
    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIP)

    if (!rateLimitResult.allowed) {
      return {
        success: false,
        message: rateLimitResult.message,
        rateLimited: true,
        waitTime: rateLimitResult.waitTime,
      }
    }

    // Extract and validate form data
    const name = formData.get("name")
    const email = formData.get("email")
    const company = formData.get("company")
    const phone = formData.get("phone")
    const message = formData.get("message")

    // Validate form data
    const result = contactFormSchema.safeParse({
      name,
      email,
      company,
      phone,
      message,
    })

    if (!result.success) {
      const errorMessage = result.error.errors.map((err) => `${err.path}: ${err.message}`).join(", ")
      return {
        success: false,
        message: `Validation error: ${errorMessage}`,
        rateLimited: false,
        waitTime: 0,
      }
    }

    // Prepare email content
    const emailParams = {
      Source: process.env.SES_FROM_EMAIL || "noreply@mawaad.co",
      Destination: {
        ToAddresses: [process.env.SES_TO_EMAIL || "contact@mawaad.co"],
      },
      Message: {
        Subject: {
          Data: `New Contact Form Submission from ${name}`,
        },
        Body: {
          Text: {
            Data: `
Name: ${name}
Email: ${email}
Company: ${company}
Phone: ${phone}
Message: ${message || "No message provided"}

Submitted from IP: ${clientIP}
Timestamp: ${new Date().toISOString()}
            `,
          },
          Html: {
            Data: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Company:</strong> ${company}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Message:</strong> ${message || "No message provided"}</p>
<hr>
<p><small>Submitted from IP: ${clientIP}</small></p>
<p><small>Timestamp: ${new Date().toISOString()}</small></p>
            `,
          },
        },
      },
    }

    // Send email
    const command = new SendEmailCommand(emailParams)
    await sesClient.send(command)

    return {
      success: true,
      message: "Your message has been sent successfully!",
      rateLimited: false,
      waitTime: 0,
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Failed to send your message. Please try again later.",
      rateLimited: false,
      waitTime: 0,
    }
  }
}
