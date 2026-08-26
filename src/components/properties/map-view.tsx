'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const LeafletMap = dynamic(() => import('@/components/properties/leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  ),
})

export function MapView({
  properties,
  centerLat,
  centerLng,
}: {
  properties: any[]
  centerLat?: number
  centerLng?: number
}) {
  return (
    <div className="h-full w-full">
      <LeafletMap properties={properties} centerLat={centerLat} centerLng={centerLng} />
    </div>
  )
}
