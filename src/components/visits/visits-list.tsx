'use client'

import { useEffect, useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { VisitRequestCard } from '@/components/visits/visit-request-card'
import { PropertyGridSkeleton } from '@/components/shared/loading-skeleton'
import { toast } from '@/components/ui/use-toast'

export function VisitsList({ mode }: { mode: 'owner' | 'seeker' }) {
  const [visits, setVisits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/visits')
      const data = await res.json()
      if (res.ok) setVisits(data.visits ?? [])
      else throw new Error(data.error)
    } catch {
      toast({ title: 'Error', description: 'Failed to load visits.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <PropertyGridSkeleton count={3} />

  if (visits.length === 0) {
    return (
      <EmptyState
        title={mode === 'owner' ? 'No visit requests yet' : 'You have no visit requests'}
        description={
          mode === 'owner'
            ? 'When house seekers request to visit your properties, they will appear here.'
            : 'Request a visit on any property page and track its status here.'
        }
        icon={<CalendarCheck className="h-8 w-8" />}
      />
    )
  }

  return (
    <div className="space-y-3">
      {visits.map((visit) => (
        <VisitRequestCard key={visit.id} visit={visit} mode={mode} onUpdated={load} />
      ))}
    </div>
  )
}
