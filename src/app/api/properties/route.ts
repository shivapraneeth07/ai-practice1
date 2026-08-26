import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { propertySchema } from '@/lib/validations'
import { searchProperties, type SearchFilters } from '@/lib/search-utils'

function parseSearchParams(searchParams: URLSearchParams): SearchFilters {
  const num = (v: string | null): number | undefined =>
    v === null || v === '' || Number.isNaN(Number(v)) ? undefined : Number(v)

  return {
    query: searchParams.get('q') ?? undefined,
    city: searchParams.get('city') ?? undefined,
    area: searchParams.get('area') ?? undefined,
    locality: searchParams.get('locality') ?? undefined,
    minRent: num(searchParams.get('minRent')),
    maxRent: num(searchParams.get('maxRent')),
    bedroomType: searchParams.get('bedroomType') ?? undefined,
    bedrooms: num(searchParams.get('bedrooms')),
    propertyType: searchParams.get('type') ?? undefined,
    furnishing: searchParams.get('furnishing') ?? undefined,
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean),
    status: searchParams.get('status') ?? 'AVAILABLE',
    sort: searchParams.get('sort') ?? undefined,
    page: num(searchParams.get('page')) ?? 1,
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const filters = parseSearchParams(searchParams)
    const result = await searchProperties(filters)
    return NextResponse.json(result)
  } catch (error) {
    console.error('List properties error:', error)
    return NextResponse.json({ error: 'Failed to load properties.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Only owners can list properties.' }, { status: 403 })
    }
    if (user.suspended) {
      return NextResponse.json({ error: 'Your account is suspended.' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = propertySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check the property details.', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const property = await prisma.property.create({
      data: {
        ownerId: user.id,
        title: data.title,
        type: data.type,
        bedroomType: data.bedroomType,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        rent: data.rent,
        deposit: data.deposit,
        maintenance: data.maintenance ?? 0,
        availableFrom: data.availableFrom,
        furnishing: data.furnishing,
        city: data.city,
        area: data.area,
        locality: data.locality,
        address: data.address,
        pincode: data.pincode,
        lat: data.lat,
        lng: data.lng,
        sqft: data.sqft,
        floor: data.floor,
        totalFloors: data.totalFloors,
        facing: data.facing,
        age: data.age,
        description: data.description,
        status: 'AVAILABLE',
        images: {
          create: data.images.map((url, i) => ({ url, order: i })),
        },
        amenities: {
          create: data.amenities.map((amenity) => ({ amenity })),
        },
        rules: {
          create: data.rules.map((rule) => ({ rule })),
        },
      },
      include: {
        images: true,
        amenities: true,
        rules: true,
      },
    })

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    console.error('Create property error:', error)
    return NextResponse.json(
      { error: 'Failed to create the property. Please try again.' },
      { status: 500 }
    )
  }
}
