import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ seekerId: user.id }, { ownerId: user.id }],
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        property: { select: { id: true, title: true, images: { orderBy: { order: 'asc' }, take: 1 } } },
        seeker: { select: { id: true, name: true, email: true } },
        owner: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('List conversations error:', error)
    return NextResponse.json({ error: 'Failed to load conversations.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { propertyId, content } = body

    if (!propertyId || !content?.trim()) {
      return NextResponse.json({ error: 'Property ID and message are required.' }, { status: 400 })
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: true },
    })
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 })
    }

    if (user.role !== 'SEEKER') {
      return NextResponse.json({ error: 'Only house seekers can send enquiries.' }, { status: 403 })
    }

    let conversation = await prisma.conversation.findUnique({
      where: {
        seekerId_ownerId_propertyId: {
          seekerId: user.id,
          ownerId: property.ownerId,
          propertyId: property.id,
        },
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { seekerId: user.id, ownerId: property.ownerId, propertyId: property.id },
      })
    }

    await prisma.message.create({
      data: { conversationId: conversation.id, senderId: user.id, content: content.trim() },
    })

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    })

    await createNotification({
      userId: property.ownerId,
      type: 'ENQUIRY',
      title: 'New Enquiry',
      message: `${user.name} sent you a message about ${property.title}`,
      link: `/owner/messages/${conversation.id}`,
    })

    return NextResponse.json({ conversation }, { status: 201 })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
