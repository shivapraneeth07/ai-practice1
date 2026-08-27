import Link from 'next/link'
import Image from 'next/image'
import { BadgeCheck, BedDouble, Bath, Maximize, MapPin, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/hooks/use-favorites'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import {
  BEDROOM_TYPE_LABELS,
  FURNISHING_SHORT,
  PROPERTY_TYPE_LABELS,
  AMENITY_LABELS,
} from '@/lib/constants'

interface PropertyCardProps {
  property: {
    id: string
    title: string
    type: string
    bedroomType: string
    bedrooms: number
    bathrooms: number
    rent: number
    furnishing: string
    area: string
    locality: string
    city: string
    availableFrom: Date | string
    verified: boolean
    sqft?: number | null
    lat?: number | null
    lng?: number | null
    images: { id: string; url: string }[]
    amenities: { amenity: string }[]
    owner?: { id: string; name: string; emailVerified: boolean; identityVerified: boolean }
  }
  userLat?: number | null
  userLng?: number | null
  className?: string
}

export function PropertyCard({ property, userLat, userLng, className }: PropertyCardProps) {
  const image = property.images[0]?.url
  const ownerVerified = !!property.owner?.identityVerified || !!property.owner?.emailVerified
  const topAmenities = property.amenities.slice(0, 3)

  return (
    <Card className={cn('group overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-glow', className)}>
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              No image available
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge className="bg-background/90 text-foreground backdrop-blur">
              {BEDROOM_TYPE_LABELS[property.bedroomType as keyof typeof BEDROOM_TYPE_LABELS] ?? property.bedroomType}{' '}
              {PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS] ?? property.type}
            </Badge>
            {property.verified && (
              <Badge variant="success" className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
          <div className="absolute right-3 top-3">
            <FavoriteButton propertyId={property.id} />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/properties/${property.id}`}>
          <h3 className="line-clamp-1 font-semibold hover:text-primary">{property.title}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {property.area}, {property.city}
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">{formatCurrency(property.rent)}</span>
          <span className="text-xs text-muted-foreground">/month</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> {property.bathrooms} Baths
          </span>
          {property.sqft && (
            <span className="flex items-center gap-1">
              <Maximize className="h-3.5 w-3.5" /> {property.sqft} sq.ft
            </span>
          )}
          <span>{FURNISHING_SHORT[property.furnishing as keyof typeof FURNISHING_SHORT] ?? property.furnishing}</span>
        </div>

        {topAmenities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {topAmenities.map((a) => (
              <span
                key={a.amenity}
                className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
              >
                ✓ {AMENITY_LABELS[a.amenity as keyof typeof AMENITY_LABELS] ?? a.amenity}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <span className="text-xs text-muted-foreground">
            Available {formatDate(property.availableFrom)}
          </span>
          {ownerVerified && (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified Owner
            </span>
          )}
        </div>

        <Button asChild variant="outline" size="sm" className="mt-3 w-full">
          <Link href={`/properties/${property.id}`}>View Property</Link>
        </Button>
      </div>
    </Card>
  )
}
