import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { savedSearchSchema } from '@/lib/validations'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const searches = await prisma.savedSearch.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ searches })
  } catch (error) {
    console.error('List saved searches error:', error)
    return NextResponse.json({ error: 'Failed to load saved searches.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = savedSearchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please provide a valid saved search.' }, { status: 400 })
    }

    const search = await prisma.savedSearch.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        query: parsed.data.query,
        filters: parsed.data.filters,
      },
    })

    return NextResponse.json({ search }, { status: 201 })
  } catch (error) {
    console.error('Create saved search error:', error)
    return NextResponse.json({ error: 'Failed to save search.' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { id } = body
    if (!id) return NextResponse.json({ error: 'Search is required.' }, { status: 400 })

    await prisma.savedSearch.deleteMany({
      where: { id, userId: user.id },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete saved search error:', error)
    return NextResponse.json({ error: 'Failed to delete saved search.' }, { status: 500 })
  }
}
