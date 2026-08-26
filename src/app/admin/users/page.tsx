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
import { ROLE_LABELS } from '@/lib/constants'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (res.ok) setUsers(data.users ?? [])
    } catch {
      toast({ title: 'Error', description: 'Failed to load users.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggleSuspend = async (user: any) => {
    setBusyId(user.id)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, suspended: !user.suspended }),
      })
      if (res.ok) {
        toast({ title: user.suspended ? 'User restored' : 'User suspended', variant: 'success' })
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, suspended: !user.suspended } : u)))
      } else {
        throw new Error('Failed')
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update user.', variant: 'destructive' })
    } finally {
      setBusyId(null)
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

  if (users.length === 0) {
    return <EmptyState title="No users yet" description="Users who sign up will appear here." />
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">{users.length} total users</p>
      </div>

      <div className="grid gap-3">
        {users.map((u) => (
          <Card key={u.id} className="flex items-center justify-between p-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-medium">
                {u.name}
                {u.suspended && <Badge variant="destructive">Suspended</Badge>}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {u.email} · {u.phone ?? 'no phone'}
              </p>
              <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">{ROLE_LABELS[u.role as keyof typeof ROLE_LABELS] ?? u.role}</Badge>
                <span>Joined {formatDate(u.createdAt)}</span>
                <span>{u._count?.properties ?? 0} listings</span>
              </div>
            </div>
            {u.role !== 'ADMIN' && (
              <Button
                variant={u.suspended ? 'outline' : 'destructive'}
                size="sm"
                disabled={busyId === u.id}
                onClick={() => toggleSuspend(u)}
              >
                {busyId === u.id && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
                {u.suspended ? 'Restore' : 'Suspend'}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
