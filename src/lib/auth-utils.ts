import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import type { Role } from '@/types'

export async function getSession() {
  return getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.user?.email) return null

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  })

  return user
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.suspended) redirect('/login?error=suspended')
  return user
}

export async function requireRole(roles: Role[]) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.suspended) redirect('/login?error=suspended')
  if (!roles.includes(user.role as Role)) {
    redirect(user.role === 'OWNER' ? '/owner/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/seeker/dashboard')
  }
  return user
}

export function isRole(sessionRole: string | undefined, roles: Role[]): boolean {
  if (!sessionRole) return false
  return roles.includes(sessionRole as Role)
}
