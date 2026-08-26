import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Owners only.' }, { status: 403 })
    }

    const properties = await prisma.property.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { order: 'asc' }, take: 1 },
        amenities: true,
      },
    })

    return NextResponse.json({ properties })
  } catch (error) {
    console.error('Owner properties error:', error)
    return NextResponse.json({ error: 'Failed to load your properties.' }, { status: 500 })
  }
}
