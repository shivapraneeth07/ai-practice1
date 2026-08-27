import {
  LayoutDashboard,
  Building2,
  MessagesSquare,
  CalendarCheck,
  UserCircle,
  Inbox,
} from 'lucide-react'
import { requireRole } from '@/lib/auth-utils'
import { DashboardShell } from '@/components/layout/dashboard-shell'

const navItems = [
  { href: '/owner/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/owner/properties', label: 'My Properties', icon: 'Building2' },
  { href: '/owner/properties/new', label: 'Add Property', icon: 'Building2' },
  { href: '/owner/enquiries', label: 'Enquiries', icon: 'Inbox' },
  { href: '/owner/messages', label: 'Messages', icon: 'MessagesSquare' },
  { href: '/owner/visits', label: 'Visits', icon: 'CalendarCheck' },
  { href: '/owner/profile', label: 'Profile', icon: 'UserCircle' },
] as const

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['OWNER'])
  return <DashboardShell navItems={navItems} roleLabel="Owner Panel">{children}</DashboardShell>
}
