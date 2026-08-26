import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admins only.' }, { status: 403 })
    }

    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { order: 'asc' }, take: 1 },
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { reports: true } },
      },
    })

    return NextResponse.json({ properties })
  } catch (error) {
    console.error('Admin properties error:', error)
    return NextResponse.json({ error: 'Failed to load properties.' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admins only.' }, { status: 403 })
    }

    const body = await req.json()
    const { propertyId, verified, status } = body
    if (!propertyId) return NextResponse.json({ error: 'Property is required.' }, { status: 400 })

    const data: Record<string, unknown> = {}
    if (typeof verified === 'boolean') data.verified = verified
    if (status) data.status = status

    await prisma.property.update({ where: { id: propertyId }, data })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin update property error:', error)
    return NextResponse.json({ error: 'Failed to update property.' }, { status: 500 })
  }
}
