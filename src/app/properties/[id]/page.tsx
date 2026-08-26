import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  CalendarDays,
  Layers,
  Building,
  ShieldCheck,
  BadgeCheck,
  Phone,
  Mail,
  Clock,
  Heart,
  IndianRupee,
  Home,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { PropertyGallery } from '@/components/properties/property-gallery'
import { ContactOwner } from '@/components/properties/contact-owner'
import { RequestVisit } from '@/components/properties/request-visit'
import { ReportListing } from '@/components/properties/report-listing'
import { FavoriteButton } from '@/hooks/use-favorites'
import { ListingSafetyWarning } from '@/components/shared/listing-safety-warning'
import { MapView } from '@/components/properties/map-view'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import {
  AMENITY_LABELS,
  BEDROOM_TYPE_LABELS,
  FURNISHING_LABELS,
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  RULE_LABELS,
  HYDERABAD_AREAS,
} from '@/lib/constants'
import { AmenityIcon } from '@/components/properties/amenity-icons'

async function getProperty(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      amenities: true,
      rules: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          emailVerified: true,
          phoneVerified: true,
          identityVerified: true,
          profile: { select: { avatarUrl: true, responseRate: true, memberSince: true } },
        },
      },
    },
  })
  return property
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id)
  if (!property) notFound()

  const owner = property.owner
  const isVerifiedOwner =
    owner.identityVerified || (owner.emailVerified && owner.phoneVerified)
  const areaCoords = HYDERABAD_AREAS.find(
    (a) => a.area.toLowerCase() === property.area.toLowerCase()
  )
  const mapLat = property.lat ?? areaCoords?.lat
  const mapLng = property.lng ?? areaCoords?.lng

  return (
    <div className="container py-8">
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/properties" className="hover:text-foreground">Properties</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{property.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} title={property.title} />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {property.title}
                </h1>
                {property.verified && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </Badge>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {property.address}, {property.locality}, {property.area}, {property.city} - {property.pincode}
              </p>
            </div>
            <FavoriteButton propertyId={property.id} className="h-11 w-11" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border bg-muted/30 p-4 sm:grid-cols-4">
            <div className="text-center">
              <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <BedDouble className="h-4 w-4" /> Bedrooms
              </p>
              <p className="mt-1 text-xl font-bold">{property.bedrooms}</p>
            </div>
            <div className="text-center">
              <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Bath className="h-4 w-4" /> Bathrooms
              </p>
              <p className="mt-1 text-xl font-bold">{property.bathrooms}</p>
            </div>
            <div className="text-center">
              <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Maximize className="h-4 w-4" /> Area
              </p>
              <p className="mt-1 text-xl font-bold">{property.sqft ?? '—'} sq.ft</p>
            </div>
            <div className="text-center">
              <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" /> Floor
              </p>
              <p className="mt-1 text-xl font-bold">
                {property.floor !== null ? `${property.floor}/${property.totalFloors ?? '—'}` : '—'}
              </p>
            </div>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Amenities</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <AmenityIcon amenity={a.amenity} />
                    <span className="text-sm font-medium">
                      {AMENITY_LABELS[a.amenity as keyof typeof AMENITY_LABELS] ?? a.amenity}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Description */}
          {property.description && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">
                {property.description}
              </p>
            </section>
          )}

          {/* Rules */}
          {property.rules.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">House Rules</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.rules.map((r) => (
                  <Badge key={r.id} variant="secondary">
                    {RULE_LABELS[r.rule as keyof typeof RULE_LABELS] ?? r.rule}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Map */}
          {mapLat && mapLng && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Location</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Approximate location shown for privacy. The exact address is shared after the owner
                agrees.
              </p>
              <div className="mt-4 h-80 w-full overflow-hidden rounded-xl border">
                <MapView
                  properties={[{ ...property, lat: mapLat, lng: mapLng }]}
                  centerLat={mapLat}
                  centerLng={mapLng}
                />
              </div>
            </section>
          )}

          <div className="mt-8">
            <ListingSafetyWarning />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Pricing card */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-baseline gap-2">
              <span className="flex items-center text-3xl font-extrabold text-primary">
                <IndianRupee className="h-6 w-6" />
                {formatCurrency(property.rent)}
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Security Deposit</dt>
                <dd className="font-medium">{formatCurrency(property.deposit)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Maintenance</dt>
                <dd className="font-medium">
                  {property.maintenance > 0 ? formatCurrency(property.maintenance) : 'Included'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Property Type</dt>
                <dd className="font-medium">
                  {PROPERTY_TYPE_LABELS[property.type as keyof typeof PROPERTY_TYPE_LABELS]}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Bedroom Type</dt>
                <dd className="font-medium">
                  {BEDROOM_TYPE_LABELS[property.bedroomType as keyof typeof BEDROOM_TYPE_LABELS]}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Furnishing</dt>
                <dd className="font-medium">
                  {FURNISHING_LABELS[property.furnishing as keyof typeof FURNISHING_LABELS]}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Available From</dt>
                <dd className="font-medium">{formatDate(property.availableFrom)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium">
                  {PROPERTY_STATUS_LABELS[property.status as keyof typeof PROPERTY_STATUS_LABELS]}
                </dd>
              </div>
              {property.facing && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Facing</dt>
                  <dd className="font-medium">{property.facing}</dd>
                </div>
              )}
            </dl>

            <Separator className="my-4" />
            <div className="space-y-2">
              <ContactOwner
                propertyId={property.id}
                ownerName={owner.name}
                propertyTitle={property.title}
                bedroomType={
                  BEDROOM_TYPE_LABELS[property.bedroomType as keyof typeof BEDROOM_TYPE_LABELS]
                }
              />
              <RequestVisit propertyId={property.id} propertyTitle={property.title} />
            </div>
          </div>

          {/* Owner card */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={owner.profile?.avatarUrl ?? undefined} />
                <AvatarFallback className="bg-primary-50 text-primary">
                  {getInitials(owner.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="flex items-center gap-1.5 font-semibold">
                  {owner.name}
                  {isVerifiedOwner && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <BadgeCheck className="h-4 w-4" /> Verified Owner
                    </span>
                  )}
                </p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Member since {formatDate(owner.profile?.memberSince ?? new Date())}
                </p>
                {owner.profile && owner.profile.responseRate > 0 && (
                  <p className="text-sm text-muted-foreground">
                    ~{owner.profile.responseRate}% response rate
                  </p>
                )}
              </div>
            </div>

            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              {owner.phoneVerified && owner.phone ? (
                <a href={`tel:${owner.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Phone className="h-4 w-4" /> {owner.phone}
                </a>
              ) : (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" /> Phone hidden for privacy
                </p>
              )}
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> {owner.email}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {owner.emailVerified && (
                <Badge variant="success" className="text-[10px]">Email Verified</Badge>
              )}
              {owner.phoneVerified && (
                <Badge variant="success" className="text-[10px]">Phone Verified</Badge>
              )}
              {owner.identityVerified && (
                <Badge variant="success" className="text-[10px]">Identity Verified</Badge>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <ReportListing propertyId={property.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
