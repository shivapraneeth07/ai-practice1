import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admins only.' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true,
        _count: { select: { properties: true, favorites: true } },
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Failed to load users.' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admins only.' }, { status: 403 })
    }

    const body = await req.json()
    const { userId, suspended } = body
    if (!userId) return NextResponse.json({ error: 'User is required.' }, { status: 400 })

    await prisma.user.update({
      where: { id: userId },
      data: { suspended: !!suspended },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin update user error:', error)
    return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 })
  }
}
