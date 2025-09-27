import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations/contact'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

// Using Node.js runtime for better compatibility and static generation
// export const runtime = 'edge'; // Removed to allow static generation

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request)
    
    // Apply rate limiting (5 requests per 15 minutes per IP)
    const rateLimitResult = rateLimit(clientIP, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          resetTime: rateLimitResult.resetTime,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          }
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    
    // Server-side validation with Zod
    const validatedData = contactFormSchema.parse(body)

    // Check honeypot field
    if (validatedData.website && validatedData.website.length > 0) {
      console.log('Honeypot triggered:', { ip: clientIP, website: validatedData.website })
      return NextResponse.json(
        { error: 'Invalid submission detected.' },
        { status: 400 }
      )
    }

    // Additional server-side validation
    if (!validatedData.name.trim() || !validatedData.email.trim() || !validatedData.message.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    // Log the contact form submission (in production, you'd save to database or send email)
    console.log('Contact form submission:', {
      timestamp: new Date().toISOString(),
      ip: clientIP,
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject || 'No subject',
      message: validatedData.message.substring(0, 100) + '...', // Log first 100 chars
    })

    // TODO: In production, implement email sending here
    // Example with Resend, SendGrid, or similar service:
    /*
    await sendEmail({
      to: 'your-email@example.com',
      from: 'noreply@yourdomain.com',
      replyTo: validatedData.email,
      subject: `Contact Form: ${validatedData.subject || 'New Message'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Subject:</strong> ${validatedData.subject || 'No subject'}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
      `,
    })
    */

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully!' 
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        }
      }
    )

  } catch (error: unknown) {
    console.error('Contact form error:', error)

    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'errors' in error) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: (error as { errors: Array<{ path?: string[]; message: string }> }).errors.map((err) => ({
            field: err.path?.[0],
            message: err.message,
          }))
        },
        { status: 400 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}