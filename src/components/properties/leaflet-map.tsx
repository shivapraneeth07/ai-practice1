'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { formatCurrency } from '@/lib/utils'
import { HYDERABAD_AREAS } from '@/lib/constants'

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const propertyIcon = L.divIcon({
  className: 'property-marker',
  html: '<div class="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg border-2 border-white">₹</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

export default function LeafletMap({
  properties,
  centerLat,
  centerLng,
}: {
  properties: any[]
  centerLat?: number
  centerLng?: number
}) {
  const withCoords = properties.filter((p) => p.lat && p.lng)

  const center: [number, number] = centerLat && centerLng
    ? [centerLat, centerLng]
    : withCoords.length > 0
      ? [withCoords[0].lat, withCoords[0].lng]
      : [17.4483, 78.3915] // Madhapur default

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {withCoords.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={propertyIcon}>
          <Popup>
            <div className="w-56">
              {p.images?.[0]?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.images[0].url}
                  alt={p.title}
                  className="mb-2 h-32 w-full rounded-md object-cover"
                />
              )}
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-muted-foreground">
                {p.area}, {p.city}
              </p>
              <p className="mt-1 font-bold text-primary">{formatCurrency(p.rent)}/month</p>
              <Link
                href={`/properties/${p.id}`}
                className="mt-2 inline-block w-full rounded-md bg-primary py-1.5 text-center text-sm font-medium text-primary-foreground"
              >
                View Details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
