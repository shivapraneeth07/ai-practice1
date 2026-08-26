'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { formatDate, formatCurrency } from '@/lib/utils'
import { VISIT_STATUS_LABELS } from '@/lib/constants'

export type VisitStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'

function statusVariant(status: VisitStatus) {
  switch (status) {
    case 'ACCEPTED':
      return 'success' as const
    case 'REJECTED':
    case 'CANCELLED':
      return 'destructive' as const
    case 'COMPLETED':
      return 'default' as const
    default:
      return 'warning' as const
  }
}

export function VisitRequestCard({
  visit,
  mode,
  onUpdated,
}: {
  visit: any
  mode: 'owner' | 'seeker'
  onUpdated?: () => void
}) {
  const [busy, setBusy] = useState<string | null>(null)

  const update = async (status: string, extra: Record<string, unknown> = {}) => {
    setBusy(status)
    try {
      const res = await fetch(`/api/visits/${visit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extra }),
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: 'Visit updated', variant: 'success' })
        onUpdated?.()
      } else {
        throw new Error(data.error || 'Failed')
      }
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', variant: 'destructive' })
    } finally {
      setBusy(null)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {mode === 'owner' && (
            <>
              <p className="font-medium">{visit.seeker.name}</p>
              <p className="text-xs text-muted-foreground">{visit.seeker.email}</p>
              {visit.seeker.phone && (
                <p className="text-xs text-muted-foreground">{visit.seeker.phone}</p>
              )}
            </>
          )}
          <p className={mode === 'owner' ? 'mt-2 text-sm' : 'mt-1 text-sm'}>
            <span className="font-medium">{visit.property.title}</span> · {formatCurrency(visit.property.rent)}/mo
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(visit.date)} at {visit.time}
          </p>
          {visit.message && <p className="mt-1 text-xs text-muted-foreground">"{visit.message}"</p>}
          {visit.ownerResponse && (
            <p className="mt-1 rounded-md bg-muted p-2 text-xs">
              Owner response: {visit.ownerResponse}
            </p>
          )}
          {visit.alternateDate && (
            <p className="mt-1 text-xs font-medium">
              Suggested: {formatDate(visit.alternateDate)} at {visit.alternateTime}
            </p>
          )}
        </div>
        <Badge variant={statusVariant(visit.status)}>
          {VISIT_STATUS_LABELS[visit.status as VisitStatus] ?? visit.status}
        </Badge>
      </div>

      {mode === 'owner' && visit.status === 'PENDING' && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" disabled={!!busy} onClick={() => update('ACCEPTED')}>
            {busy === 'ACCEPTED' && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
            Accept
          </Button>
          <Button size="sm" variant="destructive" disabled={!!busy} onClick={() => update('REJECTED')}>
            {busy === 'REJECTED' && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
            Reject
          </Button>
        </div>
      )}

      {mode === 'seeker' && visit.status === 'PENDING' && (
        <div className="mt-3">
          <Button size="sm" variant="outline" disabled={!!busy} onClick={() => update('CANCELLED')}>
            Cancel Request
          </Button>
        </div>
      )}

      {mode === 'owner' && (visit.status === 'ACCEPTED' || visit.status === 'COMPLETED') && (
        <div className="mt-3">
          <Button
            size="sm"
            variant="outline"
            disabled={!!busy || visit.status === 'COMPLETED'}
            onClick={() => update('COMPLETED')}
          >
            Mark as Completed
          </Button>
        </div>
      )}
    </Card>
  )
}
