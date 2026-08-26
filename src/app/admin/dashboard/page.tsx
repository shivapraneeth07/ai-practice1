import { Users, UserCheck, Home, Building2, KeyRound, Flag, ShieldCheck, Inbox } from 'lucide-react'
import { requireRole } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/components/owner/stat-card'

export default async function AdminDashboardPage() {
  const admin = await requireRole(['ADMIN'])

  const [
    totalUsers,
    totalOwners,
    totalSeekers,
    activeListings,
    rentedListings,
    reportedListings,
    pendingVerification,
    totalEnquiries,
    totalReports,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'OWNER' } }),
    prisma.user.count({ where: { role: 'SEEKER' } }),
    prisma.property.count({ where: { status: 'AVAILABLE' } }),
    prisma.property.count({ where: { status: 'RENTED' } }),
    prisma.property.count({ where: { reports: { some: {} } } }),
    prisma.user.count({
      where: { role: 'OWNER', OR: [{ emailVerified: false }, { identityVerified: false }] },
    }),
    prisma.conversation.count(),
    prisma.report.count({ where: { status: 'PENDING' } }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {admin.name}. Here is the platform overview.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Users} label="Total Users" value={totalUsers} href="/admin/users" />
        <StatCard icon={UserCheck} label="Owners" value={totalOwners} />
        <StatCard icon={Home} label="Seekers" value={totalSeekers} />
        <StatCard icon={Building2} label="Active Listings" value={activeListings} href="/admin/properties" />
        <StatCard icon={KeyRound} label="Rented" value={rentedListings} />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Flag} label="Reported Listings" value={reportedListings} href="/admin/reports" />
        <StatCard icon={ShieldCheck} label="Pending Verification" value={pendingVerification} href="/admin/verifications" />
        <StatCard icon={Inbox} label="Total Enquiries" value={totalEnquiries} />
        <StatCard icon={Flag} label="Open Reports" value={totalReports} href="/admin/reports" />
        <StatCard icon={Users} label="Owners + Seekers" value={totalOwners + totalSeekers} />
      </div>
    </div>
  )
}
