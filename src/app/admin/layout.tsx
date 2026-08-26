import { LayoutDashboard, Users, Building2, Flag, ShieldCheck } from 'lucide-react'
import { requireRole } from '@/lib/auth-utils'
import { DashboardShell } from '@/components/layout/dashboard-shell'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/reports', label: 'Reports', icon: Flag },
  { href: '/admin/verifications', label: 'Verifications', icon: ShieldCheck },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['ADMIN'])
  return <DashboardShell navItems={navItems} roleLabel="Admin Panel">{children}</DashboardShell>
}
