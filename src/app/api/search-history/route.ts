import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const query = (body.query ?? '').trim()
    if (!query) return NextResponse.json({ error: 'Query is required.' }, { status: 400 })

    await prisma.searchHistory.create({
      data: {
        userId: user.id,
        query,
        filters: body.filters ?? '{}',
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Save search history error:', error)
    return NextResponse.json({ error: 'Failed to save search.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const history = await prisma.searchHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({ history })
  } catch (error) {
    console.error('List search history error:', error)
    return NextResponse.json({ error: 'Failed to load search history.' }, { status: 500 })
  }
}
