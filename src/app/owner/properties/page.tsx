'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  PlusCircle,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  Loader2,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { EmptyState } from '@/components/shared/empty-state'
import { PropertyGridSkeleton } from '@/components/shared/loading-skeleton'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  BEDROOM_TYPE_LABELS,
  FURNISHING_SHORT,
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_SHORT,
} from '@/lib/constants'

type StatusKey = 'AVAILABLE' | 'PENDING' | 'RENTED' | 'UNAVAILABLE'

export default function OwnerPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/owner/properties')
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

  const changeStatus = async (id: string, status: StatusKey) => {
    setBusyId(id)
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: 'Status updated', variant: 'success' })
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        )
      } else {
        throw new Error(data.error || 'Failed')
      }
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', variant: 'destructive' })
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setBusyId(deleteId)
    try {
      const res = await fetch(`/api/properties/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Property deleted', variant: 'success' })
        setProperties((prev) => prev.filter((p) => p.id !== deleteId))
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' })
    } finally {
      setBusyId(null)
      setDeleteId(null)
    }
  }

  if (loading) return <PropertyGridSkeleton count={4} />

  if (properties.length === 0) {
    return (
      <EmptyState
        title="You don't have any properties listed yet"
        description="List your first property and start receiving enquiries from interested seekers."
        icon={<Building2 className="h-8 w-8" />}
        action={
          <Button asChild>
            <Link href="/owner/properties/new">
              <PlusCircle className="mr-2 h-4 w-4" /> List Your First Property
            </Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Properties</h1>
        <Button asChild>
          <Link href="/owner/properties/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {properties.map((p) => (
          <Card key={p.id} className="flex flex-col gap-4 p-4 sm:flex-row">
            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-56">
              {p.images?.[0]?.url ? (
                <Image
                  src={p.images[0].url}
                  alt={p.title}
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link href={`/properties/${p.id}`} className="font-semibold hover:text-primary">
                    {p.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {p.area}, {p.city}
                  </p>
                </div>
                <Badge variant={p.status === 'AVAILABLE' ? 'success' : p.status === 'RENTED' ? 'default' : 'secondary'}>
                  {PROPERTY_STATUS_SHORT[p.status as StatusKey] ?? p.status}
                </Badge>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="font-bold text-primary">{formatCurrency(p.rent)}/mo</span>
                <span>{BEDROOM_TYPE_LABELS[p.bedroomType as keyof typeof BEDROOM_TYPE_LABELS]}</span>
                <span>{PROPERTY_TYPE_LABELS[p.type as keyof typeof PROPERTY_TYPE_LABELS]}</span>
                <span>{FURNISHING_SHORT[p.furnishing as keyof typeof FURNISHING_SHORT]}</span>
                <span>Listed {formatDate(p.createdAt)}</span>
                <span>{p.viewCount} views</span>
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/owner/properties/${p.id}/edit`}>
                    <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                  </Link>
                </Button>

                {p.status === 'AVAILABLE' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busyId === p.id}
                    onClick={() => changeStatus(p.id, 'UNAVAILABLE')}
                  >
                    <EyeOff className="mr-1 h-3.5 w-3.5" /> Pause Listing
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busyId === p.id}
                    onClick={() => changeStatus(p.id, 'AVAILABLE')}
                  >
                    <Eye className="mr-1 h-3.5 w-3.5" /> Mark Available
                  </Button>
                )}

                {p.status !== 'RENTED' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busyId === p.id}
                    onClick={() => changeStatus(p.id, 'RENTED')}
                  >
                    <KeyRound className="mr-1 h-3.5 w-3.5" /> Mark Rented
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busyId === p.id}
                    onClick={() => changeStatus(p.id, 'AVAILABLE')}
                  >
                    <RefreshCw className="mr-1 h-3.5 w-3.5" /> Mark Available
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  disabled={busyId === p.id}
                  onClick={() => setDeleteId(p.id)}
                >
                  {busyId === p.id ? (
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete property?</DialogTitle>
            <DialogDescription>
              This will permanently remove this listing and all its data. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={busyId === deleteId}>
              {busyId === deleteId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Property
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
