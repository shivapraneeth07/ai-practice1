import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const AREAS: { area: string; locality: string; lat: number; lng: number }[] = [
  { area: 'Gachibowli', locality: 'Gachibowli', lat: 17.4401, lng: 78.3429 },
  { area: 'Kondapur', locality: 'Kondapur', lat: 17.4571, lng: 78.3645 },
  { area: 'Madhapur', locality: 'Madhapur', lat: 17.4483, lng: 78.3915 },
  { area: 'Kukatpally', locality: 'Kukatpally', lat: 17.4948, lng: 78.3998 },
  { area: 'Hitech City', locality: 'Hitech City', lat: 17.4437, lng: 78.3661 },
  { area: 'Miyapur', locality: 'Miyapur', lat: 17.4968, lng: 78.3461 },
  { area: 'Secunderabad', locality: 'Secunderabad', lat: 17.4399, lng: 78.4983 },
  { area: 'Begumpet', locality: 'Begumpet', lat: 17.4451, lng: 78.4744 },
  { area: 'Manikonda', locality: 'Manikonda', lat: 17.3931, lng: 78.3676 },
  { area: 'Jubilee Hills', locality: 'Jubilee Hills', lat: 17.4319, lng: 78.4102 },
  { area: 'Nallagandla', locality: 'Nallagandla', lat: 17.4587, lng: 78.3142 },
  { area: 'Serilingampally', locality: 'Serilingampally', lat: 17.4721, lng: 78.3157 },
]

const PROPERTY_TEMPLATES = [
  {
    title: 'Sunlit 2 BHK Apartment in Kondapur',
    type: 'APARTMENT',
    bedroomType: 'TWO_BHK',
    bedrooms: 2,
    bathrooms: 2,
    rent: 18000,
    deposit: 36000,
    maintenance: 2000,
    furnishing: 'SEMI_FURNISHED',
    sqft: 1100,
    floor: 4,
    totalFloors: 7,
    facing: 'East',
    age: 4,
    amenities: ['PARKING', 'WIFI', 'WATER', 'POWER_BACKUP', 'LIFT', 'SECURITY', 'BALCONY'],
    rules: ['NO_SMOKING', 'FAMILY_ONLY'],
  },
  {
    title: 'Cozy 1 BHK near Hitech City',
    type: 'APARTMENT',
    bedroomType: 'ONE_BHK',
    bedrooms: 1,
    bathrooms: 1,
    rent: 12000,
    deposit: 24000,
    maintenance: 1000,
    furnishing: 'FURNISHED',
    sqft: 550,
    floor: 2,
    totalFloors: 5,
    facing: 'North',
    age: 2,
    amenities: ['WIFI', 'WATER', 'POWER_BACKUP', 'KITCHEN', 'ATTACHED_BATHROOM'],
    rules: ['NO_PETS', 'WORKING_PROFESSIONALS_ONLY'],
  },
  {
    title: 'Spacious 3 BHK Independent House in Gachibowli',
    type: 'HOUSE',
    bedroomType: 'THREE_BHK',
    bedrooms: 3,
    bathrooms: 3,
    rent: 32000,
    deposit: 64000,
    maintenance: 0,
    furnishing: 'UNFURNISHED',
    sqft: 1800,
    floor: 0,
    totalFloors: 2,
    facing: 'West',
    age: 6,
    amenities: ['PARKING', 'WATER', 'BALCONY', 'SECURITY', 'ATTACHED_BATHROOM'],
    rules: ['FAMILY_ONLY'],
  },
  {
    title: 'Modern 2 BHK with Balcony in Madhapur',
    type: 'APARTMENT',
    bedroomType: 'TWO_BHK',
    bedrooms: 2,
    bathrooms: 2,
    rent: 22000,
    deposit: 44000,
    maintenance: 2500,
    furnishing: 'FURNISHED',
    sqft: 1200,
    floor: 8,
    totalFloors: 12,
    facing: 'North East',
    age: 3,
    amenities: ['PARKING', 'WIFI', 'WATER', 'POWER_BACKUP', 'BALCONY', 'LIFT', 'SECURITY', 'AC', 'GAS_PIPELINE'],
    rules: ['NO_SMOKING', 'WORKING_PROFESSIONALS_ONLY'],
  },
  {
    title: 'Affordable PG Room in Kukatpally',
    type: 'PG',
    bedroomType: 'SINGLE',
    bedrooms: 1,
    bathrooms: 1,
    rent: 7000,
    deposit: 7000,
    maintenance: 0,
    furnishing: 'FURNISHED',
    sqft: 150,
    floor: 1,
    totalFloors: 3,
    facing: 'South',
    age: 2,
    amenities: ['WIFI', 'WATER', 'KITCHEN', 'WASHING_MACHINE', 'HOUSEKEEPING'],
    rules: ['STUDENTS_ALLOWED', 'BACHELORS_ALLOWED'],
  },
  {
    title: 'Luxury 4+ BHK Villa in Jubilee Hills',
    type: 'VILLA',
    bedroomType: 'FOUR_PLUS',
    bedrooms: 4,
    bathrooms: 5,
    rent: 85000,
    deposit: 170000,
    maintenance: 5000,
    furnishing: 'FURNISHED',
    sqft: 3200,
    floor: 0,
    totalFloors: 3,
    facing: 'East',
    age: 1,
    amenities: ['PARKING', 'WIFI', 'WATER', 'POWER_BACKUP', 'BALCONY', 'LIFT', 'SECURITY', 'AC', 'KITCHEN', 'GYM', 'CCTV'],
    rules: ['FAMILY_ONLY'],
  },
  {
    title: 'Budget Studio Room in Miyapur',
    type: 'STUDIO',
    bedroomType: 'SINGLE',
    bedrooms: 1,
    bathrooms: 1,
    rent: 9500,
    deposit: 19000,
    maintenance: 500,
    furnishing: 'SEMI_FURNISHED',
    sqft: 350,
    floor: 3,
    totalFloors: 6,
    facing: 'West',
    age: 3,
    amenities: ['WATER', 'WIFI', 'KITCHEN', 'ATTACHED_BATHROOM'],
    rules: ['STUDENTS_ALLOWED', 'BACHELORS_ALLOWED'],
  },
  {
    title: 'Family 2 BHK in Manikonda with Parking',
    type: 'APARTMENT',
    bedroomType: 'TWO_BHK',
    bedrooms: 2,
    bathrooms: 2,
    rent: 16000,
    deposit: 32000,
    maintenance: 1500,
    furnishing: 'UNFURNISHED',
    sqft: 1000,
    floor: 1,
    totalFloors: 4,
    facing: 'North',
    age: 5,
    amenities: ['PARKING', 'WATER', 'POWER_BACKUP', 'SECURITY', 'BALCONY'],
    rules: ['FAMILY_ONLY'],
  },
  {
    title: 'Premium 1 BHK near Nallagandla',
    type: 'APARTMENT',
    bedroomType: 'ONE_BHK',
    bedrooms: 1,
    bathrooms: 1,
    rent: 14000,
    deposit: 28000,
    maintenance: 1000,
    furnishing: 'FURNISHED',
    sqft: 600,
    floor: 6,
    totalFloors: 9,
    facing: 'South East',
    age: 2,
    amenities: ['PARKING', 'WIFI', 'WATER', 'POWER_BACKUP', 'LIFT', 'SECURITY', 'AC', 'WASHING_MACHINE'],
    rules: ['WORKING_PROFESSIONALS_ONLY'],
  },
  {
    title: 'Large 3 BHK in Secunderabad',
    type: 'APARTMENT',
    bedroomType: 'THREE_BHK',
    bedrooms: 3,
    bathrooms: 2,
    rent: 26000,
    deposit: 52000,
    maintenance: 2000,
    furnishing: 'SEMI_FURNISHED',
    sqft: 1500,
    floor: 5,
    totalFloors: 8,
    facing: 'West',
    age: 7,
    amenities: ['PARKING', 'WATER', 'BALCONY', 'LIFT', 'SECURITY', 'GAS_PIPELINE'],
    rules: ['FAMILY_ONLY', 'NO_PETS'],
  },
  {
    title: 'Shared Room for Students in Gachibowli',
    type: 'SHARED_ROOM',
    bedroomType: 'SINGLE',
    bedrooms: 2,
    bathrooms: 1,
    rent: 6000,
    deposit: 6000,
    maintenance: 0,
    furnishing: 'FURNISHED',
    sqft: 220,
    floor: 2,
    totalFloors: 4,
    facing: 'East',
    age: 1,
    amenities: ['WIFI', 'WATER', 'KITCHEN', 'STUDY_TABLE'],
    rules: ['STUDENTS_ALLOWED', 'BACHELORS_ALLOWED'],
  },
  {
    title: 'Stylish 2 BHK in Begumpet',
    type: 'APARTMENT',
    bedroomType: 'TWO_BHK',
    bedrooms: 2,
    bathrooms: 2,
    rent: 21000,
    deposit: 42000,
    maintenance: 1800,
    furnishing: 'FURNISHED',
    sqft: 1150,
    floor: 3,
    totalFloors: 6,
    facing: 'North',
    age: 4,
    amenities: ['PARKING', 'WIFI', 'WATER', 'POWER_BACKUP', 'LIFT', 'SECURITY', 'BALCONY', 'REFRIGERATOR'],
    rules: ['WORKING_PROFESSIONALS_ONLY'],
  },
  {
    title: 'Budget 1 BHK Single Room in Kukatpally',
    type: 'SINGLE_ROOM',
    bedroomType: 'SINGLE',
    bedrooms: 1,
    bathrooms: 1,
    rent: 5500,
    deposit: 11000,
    maintenance: 300,
    furnishing: 'SEMI_FURNISHED',
    sqft: 180,
    floor: 0,
    totalFloors: 2,
    facing: 'South',
    age: 8,
    amenities: ['WATER', 'WIFI'],
    rules: ['STUDENTS_ALLOWED', 'BACHELORS_ALLOWED'],
  },
  {
    title: 'Premium 3 BHK in Serilingampally',
    type: 'APARTMENT',
    bedroomType: 'THREE_BHK',
    bedrooms: 3,
    bathrooms: 3,
    rent: 30000,
    deposit: 60000,
    maintenance: 3000,
    furnishing: 'FURNISHED',
    sqft: 1600,
    floor: 10,
    totalFloors: 15,
    facing: 'North East',
    age: 2,
    amenities: ['PARKING', 'WIFI', 'WATER', 'POWER_BACKUP', 'BALCONY', 'LIFT', 'SECURITY', 'AC', 'GYM', 'CCTV', 'GAS_PIPELINE'],
    rules: ['FAMILY_ONLY', 'NO_SMOKING'],
  },
  {
    title: 'Comfortable 2 BHK in Kukatpally',
    type: 'APARTMENT',
    bedroomType: 'TWO_BHK',
    bedrooms: 2,
    bathrooms: 2,
    rent: 17000,
    deposit: 34000,
    maintenance: 1500,
    furnishing: 'UNFURNISHED',
    sqft: 1050,
    floor: 2,
    totalFloors: 5,
    facing: 'West',
    age: 5,
    amenities: ['PARKING', 'WATER', 'POWER_BACKUP', 'BALCONY', 'SECURITY'],
    rules: ['FAMILY_ONLY'],
  },
  {
    title: 'Compact 1 BHK near Kondapur Metro',
    type: 'APARTMENT',
    bedroomType: 'ONE_BHK',
    bedrooms: 1,
    bathrooms: 1,
    rent: 13000,
    deposit: 26000,
    maintenance: 800,
    furnishing: 'FURNISHED',
    sqft: 500,
    floor: 4,
    totalFloors: 7,
    facing: 'East',
    age: 3,
    amenities: ['WIFI', 'WATER', 'POWER_BACKUP', 'LIFT', 'KITCHEN', 'ATTACHED_BATHROOM'],
    rules: ['NO_PETS', 'WORKING_PROFESSIONALS_ONLY'],
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  const passwordHash = await bcrypt.hash('password123', 10)

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@demo.com',
      phone: '9000000001',
      passwordHash,
      role: 'ADMIN',
      emailVerified: true,
      profile: { create: {} },
    },
  })

  const owner = await prisma.user.upsert({
    where: { email: 'owner@demo.com' },
    update: {},
    create: {
      name: 'Ravi Kumar',
      email: 'owner@demo.com',
      phone: '9000000002',
      passwordHash,
      role: 'OWNER',
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
      profile: {
        create: {
          bio: 'Property owner in Hyderabad managing family homes.',
          responseRate: 92,
          memberSince: new Date('2023-06-01'),
        },
      },
    },
  })

  const seeker = await prisma.user.upsert({
    where: { email: 'seeker@demo.com' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'seeker@demo.com',
      phone: '9000000003',
      passwordHash,
      role: 'SEEKER',
      emailVerified: true,
      profile: { create: {} },
    },
  })

  // Second owner for variety
  const owner2 = await prisma.user.upsert({
    where: { email: 'sneha@demo.com' },
    update: {},
    create: {
      name: 'Sneha Reddy',
      email: 'sneha@demo.com',
      phone: '9000000004',
      passwordHash,
      role: 'OWNER',
      emailVerified: true,
      phoneVerified: true,
      identityVerified: false,
      profile: {
        create: {
          bio: 'Home owner renting out my apartments.',
          responseRate: 78,
          memberSince: new Date('2024-01-15'),
        },
      },
    },
  })

  // Properties
  let createdCount = 0
  for (let i = 0; i < PROPERTY_TEMPLATES.length; i++) {
    const t = PROPERTY_TEMPLATES[i]
    const areaInfo = AREAS[i % AREAS.length]
    const activeOwner = i % 3 === 0 ? owner2 : owner
    const jitter = (Math.random() - 0.5) * 0.01

    const existing = await prisma.property.findFirst({ where: { title: t.title } })
    if (existing) continue

    const images = Array.from({ length: 3 }, (_, imgIdx) => ({
      url: `https://picsum.photos/seed/rentease-${i}-${imgIdx}/800/600`,
      order: imgIdx,
    }))

    const property = await prisma.property.create({
      data: {
        ownerId: activeOwner.id,
        title: t.title,
        type: t.type,
        bedroomType: t.bedroomType,
        bedrooms: t.bedrooms,
        bathrooms: t.bathrooms,
        rent: t.rent,
        deposit: t.deposit,
        maintenance: t.maintenance,
        availableFrom: new Date(Date.now() + i * 86400000),
        furnishing: t.furnishing,
        city: 'Hyderabad',
        area: areaInfo.area,
        locality: areaInfo.locality,
        address: `${i + 1}-${100 + i}, ${areaInfo.area} Main Road, Hyderabad`,
        pincode: '5000' + (50 + i),
        lat: areaInfo.lat + jitter,
        lng: areaInfo.lng + jitter,
        sqft: t.sqft,
        floor: t.floor,
        totalFloors: t.totalFloors,
        facing: t.facing,
        age: t.age,
        description: `${t.title} in ${areaInfo.area}, Hyderabad. This is a ${t.bedroomType.replace('_', ' ')} property with ${t.bedrooms} bedroom(s) and ${t.bathrooms} bathroom(s). ${t.furnishing === 'FURNISHED' ? 'Fully furnished and ready to move in.' : t.furnishing === 'SEMI_FURNISHED' ? 'Semi-furnished with essential fittings.' : 'Unfurnished — you can design it your way.'} Well connected to major IT hubs and public transport. Ideal for ${t.rules.includes('FAMILY_ONLY') ? 'families' : 'professionals and students'}.`,
        status: 'AVAILABLE',
        verified: i % 2 === 0,
        viewCount: 50 + i * 37,
        favoriteCount: 3 + (i % 9),
        images: { create: images },
        amenities: { create: t.amenities.map((amenity) => ({ amenity })) },
        rules: { create: t.rules.map((rule) => ({ rule })) },
      },
    })
    createdCount++

    // Seed views
    await prisma.propertyView.createMany({
      data: Array.from({ length: property.viewCount % 30 }, (_, vi) => ({
        propertyId: property.id,
        userId: seeker.id,
        createdAt: new Date(Date.now() - vi * 3600000),
      })),
    })
  }

  // Conversations
  const firstProperty = await prisma.property.findFirst({
    where: { ownerId: owner.id },
    orderBy: { createdAt: 'asc' },
  })

  if (firstProperty) {
    const existingConv = await prisma.conversation.findFirst({
      where: { seekerId: seeker.id, ownerId: owner.id, propertyId: firstProperty.id },
    })
    if (!existingConv) {
      const conv = await prisma.conversation.create({
        data: {
          seekerId: seeker.id,
          ownerId: owner.id,
          propertyId: firstProperty.id,
          messages: {
            create: [
              {
                senderId: seeker.id,
                content: `Hi, I'm interested in ${firstProperty.title}. Is it still available?`,
                createdAt: new Date(Date.now() - 2 * 86400000),
              },
              {
                senderId: owner.id,
                content: 'Yes, it is available! When would you like to visit?',
                createdAt: new Date(Date.now() - 1 * 86400000),
              },
            ],
          },
        },
      })
      await prisma.notification.create({
        data: {
          userId: seeker.id,
          type: 'MESSAGE',
          title: 'New Message',
          message: 'Ravi Kumar replied to your enquiry.',
          link: `/seeker/messages/${conv.id}`,
        },
      })
    }
  }

  // Visit requests
  const visitTarget = await prisma.property.findFirst({
    where: { ownerId: owner.id, status: 'AVAILABLE' },
  })
  if (visitTarget) {
    const existingVisit = await prisma.visitRequest.findFirst({
      where: { seekerId: seeker.id, propertyId: visitTarget.id },
    })
    if (!existingVisit) {
      const visit = await prisma.visitRequest.create({
        data: {
          propertyId: visitTarget.id,
          seekerId: seeker.id,
          date: new Date(Date.now() + 3 * 86400000),
          time: '17:00',
          message: 'I will be coming after work.',
          status: 'PENDING',
        },
      })
      await prisma.notification.create({
        data: {
          userId: owner.id,
          type: 'VISIT',
          title: 'Visit Request',
          message: `${seeker.name} wants to visit ${visitTarget.title}.`,
          link: '/owner/visits',
        },
      })
    }
  }

  // Notifications for seeker
  const existingPropertyNotif = await prisma.notification.findFirst({
    where: { userId: seeker.id, type: 'PROPERTY' },
  })
  if (!existingPropertyNotif) {
    await prisma.notification.create({
      data: {
        userId: seeker.id,
        type: 'PROPERTY',
        title: 'New homes in your area',
        message: 'New properties are available in Kondapur and Gachibowli.',
        link: '/properties?q=Kondapur',
      },
    })
  }

  console.log(`✅ Seeded ${createdCount} properties, 4 users, demo conversations & visits.`)
  console.log('Demo logins: seeker@demo.com / owner@demo.com / admin@demo.com (password123)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
