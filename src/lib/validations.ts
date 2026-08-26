import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(10, 'Enter a valid phone number').max(15),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['SEEKER', 'OWNER']),
})

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  type: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'PG', 'SINGLE_ROOM', 'SHARED_ROOM', 'STUDIO']),
  bedroomType: z.enum(['SINGLE', 'ONE_BHK', 'TWO_BHK', 'THREE_BHK', 'FOUR_PLUS']),
  bedrooms: z.coerce.number().int().min(1).max(20),
  bathrooms: z.coerce.number().int().min(1).max(20),
  rent: z.coerce.number().int().min(500, 'Rent must be at least ₹500'),
  deposit: z.coerce.number().int().min(0, 'Deposit cannot be negative'),
  maintenance: z.coerce.number().int().min(0).default(0),
  availableFrom: z.coerce.date(),
  furnishing: z.enum(['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED']),
  city: z.string().min(2, 'City is required'),
  area: z.string().min(2, 'Area is required'),
  locality: z.string().min(2, 'Locality is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  pincode: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  sqft: z.coerce.number().int().positive().optional(),
  floor: z.coerce.number().int().min(0).optional(),
  totalFloors: z.coerce.number().int().min(0).optional(),
  facing: z.string().optional(),
  age: z.coerce.number().int().min(0).optional(),
  description: z.string().min(20, 'Describe your property in at least 20 characters').max(3000),
  amenities: z.array(z.string()).default([]),
  rules: z.array(z.string()).default([]),
  images: z.array(z.string().url('Invalid image url')).min(1, 'Add at least one image'),
})

export const visitSchema = z.object({
  propertyId: z.string().min(1),
  date: z.coerce.date({ required_error: 'Select a date' }),
  time: z.string().min(1, 'Select a time'),
  message: z.string().max(500).optional(),
})

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(2000),
})

export const reportSchema = z.object({
  propertyId: z.string().min(1),
  reason: z.enum([
    'FAKE_LISTING',
    'WRONG_INFO',
    'SUSPICIOUS_OWNER',
    'ALREADY_RENTED',
    'SCAM',
    'WRONG_PRICE',
    'INAPPROPRIATE',
  ]),
  description: z.string().max(1000).optional(),
})

export const profileSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(10).max(15),
  bio: z.string().max(300).optional(),
  preferredAreas: z.string().max(200).optional(),
  preferredBudgetMin: z.coerce.number().int().min(0).optional(),
  preferredBudgetMax: z.coerce.number().int().min(0).optional(),
  preferredBedrooms: z.string().optional(),
})

export const savedSearchSchema = z.object({
  name: z.string().min(2).max(80),
  query: z.string(),
  filters: z.string().default('{}'),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PropertyInput = z.infer<typeof propertySchema>
