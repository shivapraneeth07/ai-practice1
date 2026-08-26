import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { visitSchema } from '@/lib/validations'
import { createNotification } from '@/lib/notifications'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const where =
      user.role === 'OWNER'
        ? { property: { ownerId: user.id } }
        : { seekerId: user.id }

    const visits = await prisma.visitRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            rent: true,
            images: { orderBy: { order: 'asc' }, take: 1 },
          },
        },
        seeker: { select: { id: true, name: true, email: true, phone: true } },
      },
    })

    return NextResponse.json({ visits })
  } catch (error) {
    console.error('List visits error:', error)
    return NextResponse.json({ error: 'Failed to load visit requests.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'SEEKER') {
      return NextResponse.json({ error: 'Only seekers can request visits.' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = visitSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 })
    }

    const data = parsed.data

    const property = await prisma.property.findUnique({ where: { id: data.propertyId } })
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 })
    }

    const visit = await prisma.visitRequest.create({
      data: {
        propertyId: data.propertyId,
        seekerId: user.id,
        date: data.date,
        time: data.time,
        message: data.message,
      },
    })

    await createNotification({
      userId: property.ownerId,
      type: 'VISIT',
      title: 'Visit Request',
      message: `${user.name} wants to visit ${property.title} on ${data.date.toLocaleDateString()}`,
      link: `/owner/visits`,
    })

    return NextResponse.json({ visit }, { status: 201 })
  } catch (error) {
    console.error('Create visit request error:', error)
    return NextResponse.json({ error: 'Failed to request visit.' }, { status: 500 })
  }
}
