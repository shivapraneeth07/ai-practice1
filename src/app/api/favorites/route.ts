import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          include: {
            images: { orderBy: { order: 'asc' }, take: 1 },
            amenities: true,
          },
        },
      },
    })

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error('List favorites error:', error)
    return NextResponse.json({ error: 'Failed to load favorites.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const propertyId = body.propertyId as string
    if (!propertyId) {
      return NextResponse.json({ error: 'Property is required.' }, { status: 400 })
    }

    const property = await prisma.property.findUnique({ where: { id: propertyId } })
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 })
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId: user.id, propertyId } },
    })

    let favorited: boolean
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } })
      await prisma.property.update({
        where: { id: propertyId },
        data: { favoriteCount: { decrement: 1 } },
      })
      favorited = false
    } else {
      await prisma.favorite.create({ data: { userId: user.id, propertyId } })
      await prisma.property.update({
        where: { id: propertyId },
        data: { favoriteCount: { increment: 1 } },
      })
      favorited = true
    }

    return NextResponse.json({ favorited })
  } catch (error) {
    console.error('Toggle favorite error:', error)
    return NextResponse.json({ error: 'Failed to update favorites.' }, { status: 500 })
  }
}
