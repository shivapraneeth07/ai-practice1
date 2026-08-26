import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admins only.' }, { status: 403 })
    }

    const body = await req.json()
    const { status } = body

    if (!status || !['REVIEWED', 'DISMISSED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    }

    await prisma.report.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin update report error:', error)
    return NextResponse.json({ error: 'Failed to update report.' }, { status: 500 })
  }
}