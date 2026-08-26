import { CalendarCheck } from 'lucide-react'
import { requireRole } from '@/lib/auth-utils'
import { VisitsList } from '@/components/visits/visits-list'

export default async function SeekerVisitsPage() {
  await requireRole(['SEEKER'])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <CalendarCheck className="h-6 w-6 text-primary" /> My Visit Requests
        </h1>
        <p className="text-sm text-muted-foreground">
          Track the status of your property visit requests.
        </p>
      </div>
      <VisitsList mode="seeker" />
    </div>
  )
}
