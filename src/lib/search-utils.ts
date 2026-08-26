import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export interface SearchFilters {
  query?: string
  city?: string
  area?: string
  locality?: string
  minRent?: number
  maxRent?: number
  bedroomType?: string
  bedrooms?: number
  propertyType?: string
  furnishing?: string
  amenities?: string[]
  status?: string
  sort?: string
  page?: number
  pageSize?: number
  verified?: boolean
}

export function buildPropertyWhereClause(filters: SearchFilters): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {
    status: filters.status ?? 'AVAILABLE',
  }

  if (filters.query) {
    const q = filters.query.toLowerCase()
    where.OR = [
      { locality: { contains: q } },
      { area: { contains: q } },
      { city: { contains: q } },
      { title: { contains: q } },
      { address: { contains: q } },
    ]
  }

  if (filters.city) {
    where.city = { contains: filters.city }
  }

  if (filters.area) {
    where.area = { contains: filters.area }
  }

  if (filters.locality) {
    where.locality = { contains: filters.locality }
  }

  if (filters.minRent !== undefined) {
    where.rent = { ...where.rent as object || {}, gte: filters.minRent }
  }

  if (filters.maxRent !== undefined) {
    where.rent = { ...where.rent as object || {}, lte: filters.maxRent }
  }

  if (filters.bedroomType) {
    where.bedroomType = filters.bedroomType
  }

  if (filters.bedrooms) {
    where.bedrooms = { gte: filters.bedrooms }
  }

  if (filters.propertyType) {
    where.type = filters.propertyType
  }

  if (filters.furnishing) {
    where.furnishing = filters.furnishing
  }

  if (filters.amenities && filters.amenities.length > 0) {
    where.amenities = {
      some: {
        amenity: { in: filters.amenities },
      },
    }
  }

  if (filters.verified) {
    where.verified = true
  }

  return where
}

export function buildPropertyOrderBy(sort?: string): Prisma.PropertyOrderByWithRelationInput[] {
  switch (sort) {
    case 'rent_asc':
      return [{ rent: 'asc' }]
    case 'rent_desc':
      return [{ rent: 'desc' }]
    case 'newest':
      return [{ createdAt: 'desc' }]
    case 'oldest':
      return [{ createdAt: 'asc' }]
    case 'popular':
      return [{ viewCount: 'desc' }]
    default:
      return [{ createdAt: 'desc' }]
  }
}

export async function searchProperties(filters: SearchFilters) {
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 12
  const skip = (page - 1) * pageSize

  const where = buildPropertyWhereClause(filters)
  const orderBy = buildPropertyOrderBy(filters.sort)

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        images: { orderBy: { order: 'asc' }, take: 1 },
        amenities: true,
        owner: {
          select: { id: true, name: true, emailVerified: true, identityVerified: true },
        },
      },
    }),
    prisma.property.count({ where }),
  ])

  return {
    properties,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}