'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, Suspense } from 'react'
import {
  SlidersHorizontal,
  Map as MapIcon,
  List,
  ChevronDown,
  Loader2,
  SearchX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SearchBar } from '@/components/properties/search-bar'
import { PropertyCard } from '@/components/properties/property-card'
import { PropertyGridSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { MapView } from '@/components/properties/map-view'
import {
  BEDROOM_TYPE_LABELS,
  FURNISHING_LABELS,
  PROPERTY_TYPE_LABELS,
  AMENITY_LABELS,
  AMENITY_OPTIONS,
  BEDROOM_OPTIONS,
  FURNISHING_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  PAGE_SIZE,
} from '@/lib/constants'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [properties, setProperties] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [showFilters, setShowFilters] = useState(false)

  const q = searchParams.get('q') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const sort = searchParams.get('sort') ?? 'newest'
  const minRent = searchParams.get('minRent') ?? ''
  const maxRent = searchParams.get('maxRent') ?? ''
  const bedroomType = searchParams.get('bedroomType') ?? ''
  const propertyType = searchParams.get('type') ?? ''
  const furnishing = searchParams.get('furnishing') ?? ''
  const amenities = searchParams.get('amenities') ?? ''

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (page) params.set('page', String(page))
      if (sort) params.set('sort', sort)
      if (minRent) params.set('minRent', minRent)
      if (maxRent) params.set('maxRent', maxRent)
      if (bedroomType) params.set('bedroomType', bedroomType)
      if (propertyType) params.set('type', propertyType)
      if (furnishing) params.set('furnishing', furnishing)
      if (amenities) params.set('amenities', amenities)
      params.set('pageSize', String(PAGE_SIZE))

      const res = await fetch(`/api/properties?${params.toString()}`)
      const data = await res.json()
      if (res.ok) {
        setProperties(data.properties ?? [])
        setTotal(data.total ?? 0)
      } else {
        setProperties([])
        setTotal(0)
      }
    } catch {
      setProperties([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [q, page, sort, minRent, maxRent, bedroomType, propertyType, furnishing, amenities])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const updateQuery = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    if (updates.page === undefined && !updates.page) params.set('page', '1')
    router.push(`/properties?${params.toString()}`)
  }

  const clearFilters = () => router.push('/properties')

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const hasActiveFilters = !!(
    minRent || maxRent || bedroomType || propertyType || furnishing || amenities
  )

  const selectedAmenities = amenities ? amenities.split(',') : []

  const toggleAmenity = (a: string) => {
    const current = selectedAmenities.includes(a)
      ? selectedAmenities.filter((x) => x !== a)
      : [...selectedAmenities, a]
    updateQuery({ amenities: current.length > 0 ? current.join(',') : undefined })
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar defaultValue={q} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'border-primary' : ''}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && <Badge className="ml-2 h-5 w-5 rounded-full p-0">!</Badge>}
          </Button>
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="h-4 w-4" />
            </Button>
          </div>
          <select
            value={sort}
            onChange={(e) => updateQuery({ sort: e.target.value })}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="newest">Recently Added</option>
            <option value="rent_asc">Lowest Rent</option>
            <option value="rent_desc">Highest Rent</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-6">
        {/* Filters sidebar */}
        {showFilters && (
          <div className="w-64 shrink-0 space-y-5">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Budget</h4>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minRent}
                  onChange={(e) => updateQuery({ minRent: e.target.value || undefined })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxRent}
                  onChange={(e) => updateQuery({ maxRent: e.target.value || undefined })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">BHK</h4>
              <div className="flex flex-wrap gap-1.5">
                {BEDROOM_OPTIONS.map((b) => (
                  <Badge
                    key={b}
                    variant={bedroomType === b ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => updateQuery({ bedroomType: bedroomType === b ? undefined : b })}
                  >
                    {BEDROOM_TYPE_LABELS[b]}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Property Type</h4>
              <div className="flex flex-wrap gap-1.5">
                {PROPERTY_TYPE_OPTIONS.map((t) => (
                  <Badge
                    key={t}
                    variant={propertyType === t ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => updateQuery({ type: propertyType === t ? undefined : t })}
                  >
                    {PROPERTY_TYPE_LABELS[t]}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Furnishing</h4>
              <div className="space-y-1">
                {FURNISHING_OPTIONS.map((f) => (
                  <Badge
                    key={f}
                    variant={furnishing === f ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => updateQuery({ furnishing: furnishing === f ? undefined : f })}
                  >
                    {FURNISHING_LABELS[f]}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Amenities</h4>
              <div className="grid grid-cols-2 gap-1">
                {AMENITY_OPTIONS.slice(0, 12).map((a) => (
                  <label
                    key={a}
                    className="flex cursor-pointer items-center gap-1.5 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                      className="h-3.5 w-3.5"
                    />
                    {AMENITY_LABELS[a]}
                  </label>
                ))}
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Results area */}
        <div className="min-w-0 flex-1">
          {loading ? (
            <PropertyGridSkeleton count={6} />
          ) : viewMode === 'map' ? (
            <div className="h-[600px] w-full overflow-hidden rounded-lg border">
              <MapView properties={properties} />
            </div>
          ) : properties.length === 0 ? (
            <EmptyState
              title="No properties found"
              description={
                q
                  ? `No available homes in "${q}". Try a different area or adjust your filters.`
                  : 'No properties match your filters. Try adjusting your search criteria.'
              }
              icon={<SearchX className="h-8 w-8" />}
              action={
                (hasActiveFilters || q) && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                )
              }
            />
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {total} {total === 1 ? 'home' : 'homes'} found
                {q ? ` in "${q}"` : ''}
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((property: any) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => updateQuery({ page: String(page - 1) })}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
                    )
                    .map((p, i, arr) => (
                      <span key={p} className="flex items-center gap-1">
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="px-1 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={p === page ? 'default' : 'outline'}
                          size="sm"
                          className="min-w-[2.5rem]"
                          onClick={() => updateQuery({ page: String(p) })}
                        >
                          {p}
                        </Button>
                      </span>
                    ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => updateQuery({ page: String(page + 1) })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="container py-6"><PropertyGridSkeleton count={6} /></div>}>
      <SearchContent />
    </Suspense>
  )
}