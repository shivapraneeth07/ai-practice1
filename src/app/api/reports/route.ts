import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { reportSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, area: true, city: true } },
      },
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('List reports error:', error)
    return NextResponse.json({ error: 'Failed to load reports.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = reportSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Please provide a valid reason.' }, { status: 400 })
    }

    const property = await prisma.property.findUnique({
      where: { id: parsed.data.propertyId },
    })
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 })
    }

    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        propertyId: parsed.data.propertyId,
        reason: parsed.data.reason,
        description: parsed.data.description,
      },
    })

    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    console.error('Create report error:', error)
    return NextResponse.json({ error: 'Failed to submit report.' }, { status: 500 })
  }
}
