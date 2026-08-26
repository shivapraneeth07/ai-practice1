import { prisma } from '@/lib/prisma'

interface CreateNotificationParams {
  userId: string
  type: string
  title: string
  message: string
  link?: string
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    return await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
      },
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  try {
    return await prisma.notification.count({
      where: { userId, read: false },
    })
  } catch {
    return 0
  }
}

export async function markNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  })
}