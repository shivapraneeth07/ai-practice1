import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

function dashboardFor(role: string | undefined): string {
  switch (role) {
    case 'OWNER':
      return '/owner/dashboard'
    case 'ADMIN':
      return '/admin/dashboard'
    default:
      return '/seeker/dashboard'
  }
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl
  const isLoggedIn = !!token
  const role = token?.role as string | undefined

  const isPublicAuthPage =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/reset-password')

  if (isLoggedIn && isPublicAuthPage) {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url))
  }

  if (pathname.startsWith('/seeker')) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', request.url))
    if (role !== 'SEEKER') return NextResponse.redirect(new URL(dashboardFor(role), request.url))
  }

  if (pathname.startsWith('/owner')) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', request.url))
    if (role !== 'OWNER') return NextResponse.redirect(new URL(dashboardFor(role), request.url))
  }

  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', request.url))
    if (role !== 'ADMIN') return NextResponse.redirect(new URL(dashboardFor(role), request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/seeker/:path*',
    '/owner/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password/:path*',
  ],
}
