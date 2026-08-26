import Link from 'next/link'
import { Heart } from 'lucide-react'
import { requireRole } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/properties/property-card'
import { EmptyState } from '@/components/shared/empty-state'

export default async function SeekerFavoritesPage() {
  const user = await requireRole(['SEEKER'])

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      property: {
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          amenities: true,
        },
      },
    },
  })

  const available = favorites.filter((f) => f.property.status === 'AVAILABLE')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Heart className="h-6 w-6 text-red-500" /> My Saved Properties
        </h1>
        <p className="text-sm text-muted-foreground">
          {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="You haven't saved any properties yet"
          description="Tap the heart icon on any property to save it here for later."
          icon={<Heart className="h-8 w-8" />}
          action={
            <Button asChild>
              <Link href="/properties">Browse Homes</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((f) => (
            <PropertyCard key={f.property.id} property={f.property} />
          ))}
        </div>
      )}

      {favorites.length > available.length && (
        <p className="text-sm text-muted-foreground">
          {favorites.length - available.length} saved {favorites.length - available.length === 1 ? 'property is' : 'properties are'} no longer available.
        </p>
      )}
    </div>
  )
}
