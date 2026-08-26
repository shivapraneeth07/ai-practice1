import { CalendarCheck } from 'lucide-react'
import { requireRole } from '@/lib/auth-utils'
import { VisitsList } from '@/components/visits/visits-list'

export default async function OwnerVisitsPage() {
  await requireRole(['OWNER'])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <CalendarCheck className="h-6 w-6 text-primary" /> Visit Requests
        </h1>
        <p className="text-sm text-muted-foreground">
          Accept, reject, or reschedule visits from interested seekers.
        </p>
      </div>
      <VisitsList mode="owner" />
    </div>
  )
}
