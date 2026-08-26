import Link from 'next/link'
import { Search, Heart, CalendarCheck, Bell, Sparkles, Clock } from 'lucide-react'
import { requireRole } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SearchBar } from '@/components/properties/search-bar'
import { PropertyCard } from '@/components/properties/property-card'
import { EmptyState } from '@/components/shared/empty-state'
import { StatCard } from '@/components/owner/stat-card'

export default async function SeekerDashboardPage() {
  const user = await requireRole(['SEEKER'])

  const [favorites, searchHistory, recentViews, recommended, visitCount, notifCount] =
    await Promise.all([
      prisma.favorite.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { property: { include: { images: { take: 1 }, amenities: true } } },
      }),
      prisma.searchHistory.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.propertyView.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 4,
        include: { property: { include: { images: { take: 1 }, amenities: true } } },
      }),
      prisma.property.findMany({
        where: { status: 'AVAILABLE' },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { images: { take: 1 }, amenities: true },
      }),
      prisma.visitRequest.count({ where: { seekerId: user.id } }),
      prisma.notification.count({ where: { userId: user.id } }),
    ])

  const recentlyViewed = recentViews
    .map((v) => v.property)
    .filter((p) => p.status === 'AVAILABLE')

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-800 p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold">Find a place that feels like home.</h1>
        <p className="mt-1 text-primary-foreground/80">
          Search your neighborhood digitally — no more walking every street.
        </p>
        <div className="mt-4 max-w-xl">
          <SearchBar />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Heart} label="Saved Homes" value={favorites.length} href="/seeker/favorites" />
        <StatCard icon={CalendarCheck} label="Visit Requests" value={visitCount} href="/seeker/visits" />
        <StatCard icon={Bell} label="Notifications" value={notifCount} href="/seeker/notifications" />
        <StatCard icon={Clock} label="Recent Searches" value={searchHistory.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recommended */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> Recommended for You
            </h2>
            {recommended.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {recommended.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No recommendations yet"
                description="Save properties and search to get personalized recommendations."
              />
            )}
          </CardContent>
        </Card>

        {/* Recently viewed */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold">Recently Viewed</h2>
            {recentlyViewed.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {recentlyViewed.slice(0, 2).map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nothing viewed yet"
                description="Start browsing properties to see them here."
                action={
                  <Button asChild variant="outline" size="sm">
                    <Link href="/properties">
                      <Search className="mr-2 h-4 w-4" /> Browse Homes
                    </Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search history */}
      {searchHistory.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((s) => (
                <Link
                  key={s.id}
                  href={`/properties?q=${encodeURIComponent(s.query)}`}
                  className="rounded-full border bg-background px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {s.query}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
