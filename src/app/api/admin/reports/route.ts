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

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        property: {
          select: { id: true, title: true, area: true, city: true, owner: { select: { name: true, email: true } } },
        },
      },
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Admin reports error:', error)
    return NextResponse.json({ error: 'Failed to load reports.' }, { status: 500 })
  }
}
