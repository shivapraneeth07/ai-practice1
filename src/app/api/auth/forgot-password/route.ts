import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { forgotPasswordSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase().trim()
    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success to avoid leaking which emails exist
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with that email, a reset link has been sent.' },
        { status: 200 }
      )
    }

    const token = crypto.randomBytes(32).toString('hex')
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/reset-password?token=${token}`

    // No email provider in this build — return the reset link so the flow is demoable.
    // Swap this block for a real email call later (e.g. Resend, Nodemailer).
    return NextResponse.json({
      message: 'If an account exists with that email, a reset link has been sent.',
      devResetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
