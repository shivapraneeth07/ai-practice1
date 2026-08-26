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

    const [activeListings, totalViews, enquiries, visitRequests, rentedListings, totalFavorites] =
      await Promise.all([
        prisma.property.count({ where: { ownerId: user.id, status: 'AVAILABLE' } }),
        prisma.property.aggregate({ where: { ownerId: user.id }, _sum: { viewCount: true } }),
        prisma.conversation.count({ where: { ownerId: user.id } }),
        prisma.visitRequest.count({
          where: { property: { ownerId: user.id }, status: 'PENDING' },
        }),
        prisma.property.count({ where: { ownerId: user.id, status: 'RENTED' } }),
        prisma.property.aggregate({ where: { ownerId: user.id }, _sum: { favoriteCount: true } }),
      ])

    const recentViews = await prisma.propertyView.findMany({
      where: { property: { ownerId: user.id } },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { createdAt: true },
    })

    return NextResponse.json({
      stats: {
        activeListings,
        totalViews: totalViews._sum.viewCount ?? 0,
        enquiries,
        visitRequests,
        rentedListings,
        totalFavorites: totalFavorites._sum.favoriteCount ?? 0,
        totalListings: activeListings + rentedListings,
        recentViews,
      },
    })
  } catch (error) {
    console.error('Owner stats error:', error)
    return NextResponse.json({ error: 'Failed to load dashboard stats.' }, { status: 500 })
  }
}
