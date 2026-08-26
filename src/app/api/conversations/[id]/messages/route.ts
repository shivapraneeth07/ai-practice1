import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { messageSchema } from '@/lib/validations'
import { createNotification } from '@/lib/notifications'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: {
        property: { select: { id: true, title: true } },
        seeker: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 })
    }

    if (conversation.seekerId !== user.id && conversation.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
    }

    await prisma.message.updateMany({
      where: { conversationId: conversation.id, senderId: { not: user.id }, read: false },
      data: { read: true },
    })

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Get conversation error:', error)
    return NextResponse.json({ error: 'Failed to load conversation.' }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const conversation = await prisma.conversation.findUnique({ where: { id: params.id } })
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 })
    }

    if (conversation.seekerId !== user.id && conversation.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = messageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        content: parsed.data.content,
      },
    })

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    })

    const otherUserId =
      conversation.seekerId === user.id ? conversation.ownerId : conversation.seekerId
    const recipientRole = conversation.seekerId === user.id ? 'OWNER' : 'SEEKER'
    const messagesBase = recipientRole === 'OWNER' ? '/owner' : '/seeker'
    await createNotification({
      userId: otherUserId,
      type: 'MESSAGE',
      title: 'New Message',
      message: `${user.name} sent you a message`,
      link: `${messagesBase}/messages/${conversation.id}`,
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}