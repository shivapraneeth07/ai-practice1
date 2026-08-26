import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admins only.' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      where: { role: 'OWNER' },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        phoneVerified: true,
        identityVerified: true,
        profile: { select: { memberSince: true } },
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Admin verifications error:', error)
    return NextResponse.json({ error: 'Failed to load verifications.' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admins only.' }, { status: 403 })
    }

    const body = await req.json()
    const { userId, field, value } = body

    if (!userId || !field || typeof value !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const allowed = ['emailVerified', 'phoneVerified', 'identityVerified']
    if (!allowed.includes(field)) {
      return NextResponse.json({ error: 'Invalid verification field.' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { [field]: value },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin verify user error:', error)
    return NextResponse.json({ error: 'Failed to update verification.' }, { status: 500 })
  }
}
