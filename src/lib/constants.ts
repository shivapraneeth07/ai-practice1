import type {
  Amenity,
  BedroomType,
  Furnishing,
  PropertyRule,
  PropertyStatus,
  PropertyType,
  ReportReason,
  Role,
  VisitStatus,
} from '@/types'

export const ROLE_LABELS: Record<Role, string> = {
  SEEKER: 'House Seeker',
  OWNER: 'House Owner',
  ADMIN: 'Admin',
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'Independent House',
  VILLA: 'Villa',
  PG: 'PG / Room',
  SINGLE_ROOM: 'Single Room',
  SHARED_ROOM: 'Shared Room',
  STUDIO: 'Studio',
}

export const BEDROOM_TYPE_LABELS: Record<BedroomType, string> = {
  SINGLE: 'Single',
  ONE_BHK: '1 BHK',
  TWO_BHK: '2 BHK',
  THREE_BHK: '3 BHK',
  FOUR_PLUS: '4+ BHK',
}

export const BEDROOM_OPTIONS: BedroomType[] = ['SINGLE', 'ONE_BHK', 'TWO_BHK', 'THREE_BHK', 'FOUR_PLUS']

export const PROPERTY_TYPE_OPTIONS: PropertyType[] = [
  'APARTMENT',
  'HOUSE',
  'VILLA',
  'PG',
  'SINGLE_ROOM',
  'SHARED_ROOM',
  'STUDIO',
]

export const FURNISHING_LABELS: Record<Furnishing, string> = {
  FURNISHED: 'Fully Furnished',
  SEMI_FURNISHED: 'Semi-Furnished',
  UNFURNISHED: 'Unfurnished',
}

export const FURNISHING_SHORT: Record<Furnishing, string> = {
  FURNISHED: 'Furnished',
  SEMI_FURNISHED: 'Semi-Furnished',
  UNFURNISHED: 'Unfurnished',
}

export const FURNISHING_OPTIONS: Furnishing[] = ['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED']

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  AVAILABLE: 'Available',
  PENDING: 'Pending',
  RENTED: 'Rented',
  UNAVAILABLE: 'Temporarily Unavailable',
}

export const PROPERTY_STATUS_SHORT: Record<PropertyStatus, string> = {
  AVAILABLE: 'Available',
  PENDING: 'Pending Review',
  RENTED: 'Rented',
  UNAVAILABLE: 'Unavailable',
}

export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export const AMENITY_LABELS: Record<Amenity, string> = {
  PARKING: 'Parking',
  WIFI: 'Wi-Fi',
  WATER: 'Water Availability',
  POWER_BACKUP: 'Power Backup',
  BALCONY: 'Balcony',
  LIFT: 'Lift',
  SECURITY: 'Security',
  AC: 'AC',
  WASHING_MACHINE: 'Washing Machine',
  REFRIGERATOR: 'Refrigerator',
  KITCHEN: 'Kitchen',
  ATTACHED_BATHROOM: 'Attached Bathroom',
  PET_FRIENDLY: 'Pet Friendly',
  GYM: 'Gym',
  HOUSEKEEPING: 'Housekeeping',
  CCTV: 'CCTV',
  GAS_PIPELINE: 'Gas Pipeline',
  STUDY_TABLE: 'Study Table',
}

export const AMENITY_OPTIONS: Amenity[] = [
  'PARKING',
  'WIFI',
  'WATER',
  'POWER_BACKUP',
  'BALCONY',
  'LIFT',
  'SECURITY',
  'AC',
  'WASHING_MACHINE',
  'REFRIGERATOR',
  'KITCHEN',
  'ATTACHED_BATHROOM',
  'PET_FRIENDLY',
  'GYM',
  'HOUSEKEEPING',
  'CCTV',
  'GAS_PIPELINE',
  'STUDY_TABLE',
]

export const RULE_LABELS: Record<PropertyRule, string> = {
  NO_SMOKING: 'No Smoking',
  NO_PETS: 'No Pets',
  FAMILY_ONLY: 'Family Only',
  STUDENTS_ALLOWED: 'Students Allowed',
  WORKING_PROFESSIONALS_ONLY: 'Working Professionals Allowed',
  BACHELORS_ALLOWED: 'Bachelors Allowed',
  MALE_ONLY: 'Male Only',
  FEMALE_ONLY: 'Female Only',
}

export const RULE_OPTIONS: PropertyRule[] = [
  'NO_SMOKING',
  'NO_PETS',
  'FAMILY_ONLY',
  'STUDENTS_ALLOWED',
  'WORKING_PROFESSIONALS_ONLY',
  'BACHELORS_ALLOWED',
  'MALE_ONLY',
  'FEMALE_ONLY',
]

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  FAKE_LISTING: 'Fake Listing',
  WRONG_INFO: 'Wrong Information',
  SUSPICIOUS_OWNER: 'Suspicious Owner',
  ALREADY_RENTED: 'Already Rented',
  SCAM: 'Scam',
  WRONG_PRICE: 'Incorrect Price',
  INAPPROPRIATE: 'Inappropriate Content',
}

export const REPORT_REASON_OPTIONS: ReportReason[] = [
  'FAKE_LISTING',
  'WRONG_INFO',
  'SUSPICIOUS_OWNER',
  'ALREADY_RENTED',
  'SCAM',
  'WRONG_PRICE',
  'INAPPROPRIATE',
]

export const CITIES = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Chennai', 'Pune']

export const HYDERABAD_AREAS: { area: string; locality: string; lat: number; lng: number }[] = [
  { area: 'Gachibowli', locality: 'Gachibowli', lat: 17.4401, lng: 78.3429 },
  { area: 'Kondapur', locality: 'Kondapur', lat: 17.4571, lng: 78.3645 },
  { area: 'Madhapur', locality: 'Madhapur', lat: 17.4483, lng: 78.3915 },
  { area: 'Kukatpally', locality: 'Kukatpally', lat: 17.4948, lng: 78.3998 },
  { area: 'Hitech City', locality: 'Hitech City', lat: 17.4437, lng: 78.3661 },
  { area: 'Miyapur', locality: 'Miyapur', lat: 17.4968, lng: 78.3461 },
  { area: 'Secunderabad', locality: 'Secunderabad', lat: 17.4399, lng: 78.4983 },
  { area: 'Begumpet', locality: 'Begumpet', lat: 17.4451, lng: 78.4744 },
  { area: 'Ameerpet', locality: 'Ameerpet', lat: 17.4375, lng: 78.4483 },
  { area: 'Manikonda', locality: 'Manikonda', lat: 17.3931, lng: 78.3676 },
  { area: 'Jubilee Hills', locality: 'Jubilee Hills', lat: 17.4319, lng: 78.4102 },
  { area: 'Banjara Hills', locality: 'Banjara Hills', lat: 17.4239, lng: 78.4375 },
  { area: 'Nallagandla', locality: 'Nallagandla', lat: 17.4587, lng: 78.3142 },
  { area: 'Serilingampally', locality: 'Serilingampally', lat: 17.4721, lng: 78.3157 },
]

export const ALL_AREAS: { area: string; locality: string; lat: number; lng: number }[] =
  HYDERABAD_AREAS

export const AREA_NAMES = HYDERABAD_AREAS.map((a) => a.area)

export const PAGE_SIZE = 12

export const SAFETY_WARNING =
  'Never transfer money before verifying the property and owner in person. RentEase never asks for advance payment through the platform.'
