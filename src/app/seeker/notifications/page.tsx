'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { cn, timeAgo } from '@/lib/utils'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      if (res.ok) setNotifications(data.notifications ?? [])
    } catch {
      toast({ title: 'Error', description: 'Failed to load notifications.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PUT' })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast({ title: 'All notifications marked as read', variant: 'success' })
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Bell className="h-6 w-6 text-primary" /> Notifications
        </h1>
        {notifications.some((n) => !n.read) && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="When owners respond to you or your visit requests are updated, you'll see it here."
          icon={<Bell className="h-8 w-8" />}
        />
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={cn(
                'rounded-xl border p-4 transition-colors',
                n.read ? 'bg-card' : 'bg-primary-50 border-primary/20'
              )}
            >
              {n.link ? (
                <Link href={n.link} className="block">
                  <p className="font-medium">{n.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{timeAgo(n.createdAt)}</p>
                </Link>
              ) : (
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{timeAgo(n.createdAt)}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
