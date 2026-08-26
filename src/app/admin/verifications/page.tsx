'use client'

import { useEffect, useState } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { toast } from '@/components/ui/use-toast'
import { formatDate } from '@/lib/utils'

export default function AdminVerificationsPage() {
  const [owners, setOwners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/verifications')
      const data = await res.json()
      if (res.ok) setOwners(data.users ?? [])
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggle = async (owner: any, field: string) => {
    setBusyId(owner.id + field)
    try {
      const res = await fetch('/api/admin/verifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: owner.id, field, value: !owner[field] }),
      })
      if (res.ok) {
        toast({ title: 'Verification updated', variant: 'success' })
        setOwners((prev) =>
          prev.map((o) => (o.id === owner.id ? { ...o, [field]: !o[field] } : o))
        )
      } else throw new Error('Failed')
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setBusyId(null)
    }
  }

  const isFullyVerified = (o: any) => o.emailVerified && o.phoneVerified && o.identityVerified

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (owners.length === 0) {
    return <EmptyState title="No owners" description="Owners will appear here for verification." />
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Owner Verifications</h1>
        <p className="text-sm text-muted-foreground">
          Verify owner identity so they can display the &quot;Verified Owner&quot; badge.
        </p>
      </div>

      <div className="grid gap-3">
        {owners.map((o) => (
          <Card key={o.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="flex items-center gap-2 font-medium">
                  {o.name}
                  {isFullyVerified(o) && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Fully Verified
                    </Badge>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{o.email}</p>
                <p className="text-xs text-muted-foreground">Member since {formatDate(o.profile?.memberSince ?? o.createdAt)}</p>
              </div>
              <div className="flex flex-col items-end gap-1 text-xs">
                <Badge variant={o.emailVerified ? 'success' : 'secondary'}>Email {o.emailVerified ? '✓' : '—'}</Badge>
                <Badge variant={o.phoneVerified ? 'success' : 'secondary'}>Phone {o.phoneVerified ? '✓' : '—'}</Badge>
                <Badge variant={o.identityVerified ? 'success' : 'secondary'}>Identity {o.identityVerified ? '✓' : '—'}</Badge>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['emailVerified', 'phoneVerified', 'identityVerified'] as const).map((field) => (
                <Button
                  key={field}
                  size="sm"
                  variant={o[field] ? 'outline' : 'default'}
                  disabled={busyId === o.id + field}
                  onClick={() => toggle(o, field)}
                >
                  {busyId === o.id + field && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
                  {o[field] ? `Unverify ${field.replace('Verified', '')}` : `Verify ${field.replace('Verified', '')}`}
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
