'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { toast } from '@/components/ui/use-toast'
import { formatDate } from '@/lib/utils'
import { REPORT_REASON_LABELS } from '@/lib/constants'

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reports')
      const data = await res.json()
      if (res.ok) setReports(data.reports ?? [])
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast({ title: `Report ${status === 'DISMISSED' ? 'dismissed' : 'reviewed'}`, variant: 'success' })
        setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
      } else throw new Error('Failed')
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (reports.length === 0) {
    return <EmptyState title="No reports" description="No one has reported any listings yet." />
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">{reports.filter((r) => r.status === 'PENDING').length} pending</p>
      </div>

      <div className="grid gap-3">
        {reports.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">
                  {REPORT_REASON_LABELS[r.reason as keyof typeof REPORT_REASON_LABELS] ?? r.reason}
                </p>
                <p className="text-sm text-muted-foreground">
                  On: {r.property.title} ({r.property.area}, {r.property.city})
                </p>
                <p className="text-sm text-muted-foreground">
                  By: {r.reporter.name} ({r.reporter.email})
                </p>
                {r.description && <p className="mt-1 text-sm">&ldquo;{r.description}&rdquo;</p>}
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
              </div>
              <Badge variant={r.status === 'PENDING' ? 'warning' : r.status === 'DISMISSED' ? 'secondary' : 'success'}>
                {r.status}
              </Badge>
            </div>
            {r.status === 'PENDING' && (
              <div className="mt-3 flex gap-2">
                <Button size="sm" disabled={busyId === r.id} onClick={() => updateStatus(r.id, 'REVIEWED')}>
                  {busyId === r.id && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
                  Mark Reviewed
                </Button>
                <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => updateStatus(r.id, 'DISMISSED')}>
                  Dismiss
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}