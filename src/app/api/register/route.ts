import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signupSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check your details and try again.', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, phone, password, role } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Try logging in instead.' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone,
        passwordHash,
        role,
        profile: { create: {} },
      },
    })

    return NextResponse.json(
      {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong while creating your account. Please try again.' },
      { status: 500 }
    )
  }
}
