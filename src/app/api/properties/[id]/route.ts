import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { order: 'asc' } },
        amenities: true,
        rules: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            emailVerified: true,
            phoneVerified: true,
            identityVerified: true,
            profile: { select: { avatarUrl: true, responseRate: true, memberSince: true } },
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 })
    }

    // Record view (async, fire-and-forget)
    const user = await getCurrentUser().catch(() => null)
    prisma.propertyView
      .create({
        data: {
          propertyId: property.id,
          userId: user?.id,
        },
      })
      .catch(() => {})

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Get property error:', error)
    return NextResponse.json({ error: 'Failed to load property.' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const property = await prisma.property.findUnique({ where: { id: params.id } })
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 })
    }
    if (property.ownerId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'You can only edit your own properties.' }, { status: 403 })
    }

    const body = await req.json()

    // Only allow specific fields to be updated
    const allowedFields = [
      'title', 'type', 'bedroomType', 'bedrooms', 'bathrooms', 'rent', 'deposit',
      'maintenance', 'availableFrom', 'furnishing', 'city', 'area', 'locality',
      'address', 'pincode', 'lat', 'lng', 'sqft', 'floor', 'totalFloors',
      'facing', 'age', 'description', 'status',
    ]

    const data: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        data[field] = body[field]
      }
    }

    const updated = await prisma.property.update({
      where: { id: params.id },
      data,
      include: { images: true, amenities: true, rules: true },
    })

    return NextResponse.json({ property: updated })
  } catch (error) {
    console.error('Update property error:', error)
    return NextResponse.json({ error: 'Failed to update property.' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const property = await prisma.property.findUnique({ where: { id: params.id } })
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 })
    }
    if (property.ownerId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'You can only delete your own properties.' }, { status: 403 })
    }

    await prisma.property.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Property deleted successfully.' })
  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json({ error: 'Failed to delete property.' }, { status: 500 })
  }
}