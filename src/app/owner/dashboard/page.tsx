import Link from 'next/link'
import {
  Building2,
  Eye,
  Inbox,
  CalendarCheck,
  KeyRound,
  Heart,
  PlusCircle,
} from 'lucide-react'
import { requireRole } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/components/owner/stat-card'
import { RecentEnquiries } from '@/components/owner/recent-enquiries'

export default async function OwnerDashboardPage() {
  const user = await requireRole(['OWNER'])

  const [activeListings, totalViews, enquiries, visitRequests, rentedListings, totalFavorites] =
    await Promise.all([
      prisma.property.count({ where: { ownerId: user.id, status: 'AVAILABLE' } }),
      prisma.property.aggregate({ where: { ownerId: user.id }, _sum: { viewCount: true } }),
      prisma.conversation.count({ where: { ownerId: user.id } }),
      prisma.visitRequest.count({ where: { property: { ownerId: user.id }, status: 'PENDING' } }),
      prisma.property.count({ where: { ownerId: user.id, status: 'RENTED' } }),
      prisma.property.aggregate({ where: { ownerId: user.id }, _sum: { favoriteCount: true } }),
    ])

  const recentConversations = await prisma.conversation.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: {
      seeker: { select: { name: true } },
      property: { select: { title: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-sm text-muted-foreground">Manage your properties and enquiries.</p>
        </div>
        <Button asChild>
          <Link href="/owner/properties/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={Building2} label="Active Listings" value={activeListings} href="/owner/properties" />
        <StatCard icon={Eye} label="Total Views" value={totalViews._sum.viewCount ?? 0} />
        <StatCard icon={Inbox} label="Enquiries" value={enquiries} href="/owner/enquiries" />
        <StatCard icon={CalendarCheck} label="Visit Requests" value={visitRequests} href="/owner/visits" />
        <StatCard icon={KeyRound} label="Rented" value={rentedListings} />
        <StatCard icon={Heart} label="Favorites" value={totalFavorites._sum.favoriteCount ?? 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Recent Enquiries</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/owner/enquiries">View all</Link>
              </Button>
            </div>
            <RecentEnquiries conversations={recentConversations} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button asChild variant="outline">
                <Link href="/owner/properties/new">List New Property</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/owner/visits">Manage Visits</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/owner/properties">Edit Listings</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/owner/profile">Update Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
