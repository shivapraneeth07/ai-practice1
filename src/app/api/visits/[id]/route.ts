import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Only owners can respond to visits.' }, { status: 403 })
    }

    const visit = await prisma.visitRequest.findUnique({
      where: { id: params.id },
      include: { property: true },
    })

    if (!visit) {
      return NextResponse.json({ error: 'Visit request not found.' }, { status: 404 })
    }
    if (visit.property.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
    }

    const body = await req.json()
    const { status, ownerResponse, alternateDate, alternateTime } = body

    const validStatuses = ['ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    }

    const updated = await prisma.visitRequest.update({
      where: { id: params.id },
      data: {
        status: status ?? visit.status,
        ownerResponse: ownerResponse ?? visit.ownerResponse,
        alternateDate: alternateDate ? new Date(alternateDate) : visit.alternateDate,
        alternateTime: alternateTime ?? visit.alternateTime,
      },
    })

    await createNotification({
      userId: visit.seekerId,
      type: 'VISIT',
      title: `Visit ${status === 'ACCEPTED' ? 'Accepted' : status === 'REJECTED' ? 'Rejected' : 'Updated'}`,
      message: `Your visit request for ${visit.property.title} has been ${status === 'ACCEPTED' ? 'approved' : status === 'REJECTED' ? 'declined' : 'updated'}.`,
      link: `/seeker/visits`,
    })

    return NextResponse.json({ visit: updated })
  } catch (error) {
    console.error('Update visit request error:', error)
    return NextResponse.json({ error: 'Failed to update visit request.' }, { status: 500 })
  }
}
