import {
  Car,
  Wifi,
  Droplets,
  Zap,
  Wind,
  ArrowUpDown,
  Shield,
  Snowflake,
  WashingMachine,
  Refrigerator,
  ChefHat,
  DoorOpen,
  PawPrint,
  Dumbbell,
  Sparkles,
  Camera,
  Flame,
  NotebookPen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PARKING: Car,
  WIFI: Wifi,
  WATER: Droplets,
  POWER_BACKUP: Zap,
  BALCONY: Wind,
  LIFT: ArrowUpDown,
  SECURITY: Shield,
  AC: Snowflake,
  WASHING_MACHINE: WashingMachine,
  REFRIGERATOR: Refrigerator,
  KITCHEN: ChefHat,
  ATTACHED_BATHROOM: DoorOpen,
  PET_FRIENDLY: PawPrint,
  GYM: Dumbbell,
  HOUSEKEEPING: Sparkles,
  CCTV: Camera,
  GAS_PIPELINE: Flame,
  STUDY_TABLE: NotebookPen,
}

export function AmenityIcon({ amenity, className }: { amenity: string; className?: string }) {
  const Icon = ICONS[amenity] ?? Sparkles
  return <Icon className={cn('h-5 w-5 text-primary', className)} />
}
