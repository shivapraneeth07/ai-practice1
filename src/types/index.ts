export type Role = 'SEEKER' | 'OWNER' | 'ADMIN'

export type PropertyType =
  | 'APARTMENT'
  | 'HOUSE'
  | 'VILLA'
  | 'PG'
  | 'SINGLE_ROOM'
  | 'SHARED_ROOM'
  | 'STUDIO'

export type BedroomType = 'SINGLE' | 'ONE_BHK' | 'TWO_BHK' | 'THREE_BHK' | 'FOUR_PLUS'

export type Furnishing = 'FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED'

export type PropertyStatus = 'AVAILABLE' | 'PENDING' | 'RENTED' | 'UNAVAILABLE'

export type VisitStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'

export type ReportReason =
  | 'FAKE_LISTING'
  | 'WRONG_INFO'
  | 'SUSPICIOUS_OWNER'
  | 'ALREADY_RENTED'
  | 'SCAM'
  | 'WRONG_PRICE'
  | 'INAPPROPRIATE'

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'DISMISSED'

export type NotificationType =
  | 'MESSAGE'
  | 'VISIT'
  | 'ENQUIRY'
  | 'FAVORITE'
  | 'PROPERTY'
  | 'SAVED_SEARCH'
  | 'SYSTEM'

export type Amenity =
  | 'PARKING'
  | 'WIFI'
  | 'WATER'
  | 'POWER_BACKUP'
  | 'BALCONY'
  | 'LIFT'
  | 'SECURITY'
  | 'AC'
  | 'WASHING_MACHINE'
  | 'REFRIGERATOR'
  | 'KITCHEN'
  | 'ATTACHED_BATHROOM'
  | 'PET_FRIENDLY'
  | 'GYM'
  | 'HOUSEKEEPING'
  | 'CCTV'
  | 'GAS_PIPELINE'
  | 'STUDY_TABLE'

export type PropertyRule =
  | 'NO_SMOKING'
  | 'NO_PETS'
  | 'FAMILY_ONLY'
  | 'STUDENTS_ALLOWED'
  | 'WORKING_PROFESSIONALS_ONLY'
  | 'BACHELORS_ALLOWED'
  | 'MALE_ONLY'
  | 'FEMALE_ONLY'

export interface PropertyWithDetails {
  id: string
  title: string
  type: PropertyType
  bedroomType: BedroomType
  bedrooms: number
  bathrooms: number
  rent: number
  deposit: number
  maintenance: number
  availableFrom: Date
  furnishing: Furnishing
  city: string
  area: string
  locality: string
  address: string
  pincode?: string | null
  lat?: number | null
  lng?: number | null
  sqft?: number | null
  floor?: number | null
  totalFloors?: number | null
  facing?: string | null
  age?: number | null
  description?: string | null
  status: PropertyStatus
  verified: boolean
  viewCount: number
  favoriteCount: number
  images: { id: string; url: string; order: number }[]
  amenities: { amenity: string }[]
  rules: { rule: string }[]
  owner: {
    id: string
    name: string
    email: string
    phone?: string | null
    emailVerified: boolean
    phoneVerified: boolean
    identityVerified: boolean
    profile?: { avatarUrl?: string | null; responseRate: number; memberSince: Date } | null
  }
  createdAt: Date
  updatedAt: Date
}
