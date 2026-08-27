import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ status: 'error', database: 'not_configured' }, { status: 503 })
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok', database: 'ok' })
  } catch (error) {
    console.error('Health check database error:', error)
    return NextResponse.json({ status: 'error', database: 'unavailable' }, { status: 503 })
  }
}
