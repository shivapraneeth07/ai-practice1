'use client'

import { useEffect, useState } from 'react'
import { Loader2, BadgeCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PROPERTY_STATUS_SHORT } from '@/lib/constants'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/properties')
      const data = await res.json()
      if (res.ok) setProperties(data.properties ?? [])
    } catch {
      toast({ title: 'Error', description: 'Failed to load properties.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggleVerify = async (p: any) => {
    setBusyId(p.id)
    try {
      const res = await fetch('/api/admin/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: p.id, verified: !p.verified }),
      })
      if (res.ok) {
        toast({ title: p.verified ? 'Verification removed' : 'Property verified', variant: 'success' })
        setProperties((prev) => prev.map((x) => (x.id === p.id ? { ...x, verified: !p.verified } : x)))
      } else throw new Error('Failed')
    } catch {
      toast({ title: 'Error', description: 'Failed to update property.', variant: 'destructive' })
    } finally {
      setBusyId(null)
    }
  }

  const removeListing = async () => {
    if (!deleteId) return
    setBusyId(deleteId)
    try {
      const res = await fetch(`/api/properties/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Listing removed', variant: 'success' })
        setProperties((prev) => prev.filter((p) => p.id !== deleteId))
      } else {
        toast({ title: 'Error', description: 'Failed to remove listing.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setBusyId(null)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return <EmptyState title="No listings yet" description="Properties listed by owners will appear here." />
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
        <p className="text-sm text-muted-foreground">{properties.length} total listings</p>
      </div>

      <div className="grid gap-3">
        {properties.map((p) => (
          <Card key={p.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 font-medium">
                {p.title}
                {p.verified && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </Badge>
                )}
                <Badge variant="secondary">{PROPERTY_STATUS_SHORT[p.status as keyof typeof PROPERTY_STATUS_SHORT] ?? p.status}</Badge>
              </p>
              <p className="text-sm text-muted-foreground">
                {p.area}, {p.city} · {formatCurrency(p.rent)}/mo · by {p.owner.name}
              </p>
              <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                <span>Listed {formatDate(p.createdAt)}</span>
                <span>{p.viewCount} views</span>
                <span>{p._count?.reports ?? 0} reports</span>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant={p.verified ? 'outline' : 'default'}
                size="sm"
                disabled={busyId === p.id}
                onClick={() => toggleVerify(p)}
              >
                {busyId === p.id && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
                {p.verified ? 'Unverify' : 'Verify'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={busyId === p.id}
                onClick={() => setDeleteId(p.id)}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove listing?</DialogTitle>
            <DialogDescription>
              This permanently removes the listing and all related data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={removeListing}>Remove Listing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
