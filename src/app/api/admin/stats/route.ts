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

    const [
      totalUsers,
      totalOwners,
      totalSeekers,
      activeListings,
      rentedListings,
      reportedListings,
      pendingVerification,
      totalEnquiries,
      totalProperties,
      totalReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'OWNER' } }),
      prisma.user.count({ where: { role: 'SEEKER' } }),
      prisma.property.count({ where: { status: 'AVAILABLE' } }),
      prisma.property.count({ where: { status: 'RENTED' } }),
      prisma.property.count({ where: { reports: { some: {} } } }),
      prisma.user.count({
        where: { role: 'OWNER', OR: [{ emailVerified: false }, { identityVerified: false }] },
      }),
      prisma.conversation.count(),
      prisma.property.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
    ])

    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 7,
      select: { createdAt: true },
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        totalOwners,
        totalSeekers,
        activeListings,
        rentedListings,
        reportedListings,
        pendingVerification,
        totalEnquiries,
        totalProperties,
        totalReports,
      },
      recentUsers,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to load dashboard stats.' }, { status: 500 })
  }
}
