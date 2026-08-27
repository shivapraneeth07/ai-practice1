import {
  LayoutDashboard,
  Search,
  Heart,
  MessagesSquare,
  CalendarCheck,
  Bell,
  UserCircle,
} from 'lucide-react'
import { requireRole } from '@/lib/auth-utils'
import { DashboardShell } from '@/components/layout/dashboard-shell'

const navItems = [
  { href: '/seeker/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/properties', label: 'Search Homes', icon: 'Search' },
  { href: '/seeker/favorites', label: 'Saved Homes', icon: 'Heart' },
  { href: '/seeker/messages', label: 'Messages', icon: 'MessagesSquare' },
  { href: '/seeker/visits', label: 'My Visits', icon: 'CalendarCheck' },
  { href: '/seeker/notifications', label: 'Notifications', icon: 'Bell' },
  { href: '/seeker/profile', label: 'Profile', icon: 'UserCircle' },
] as const

export default async function SeekerLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['SEEKER'])
  return <DashboardShell navItems={navItems} roleLabel="My Account">{children}</DashboardShell>
}
