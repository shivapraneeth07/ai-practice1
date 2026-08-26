'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MessagesSquare } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, getInitials, timeAgo } from '@/lib/utils'

export function ConversationList({
  basePath,
  currentId,
  otherName,
}: {
  basePath: string
  currentId?: string
  otherName: (c: any) => string
}) {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => {
        if (data.conversations) setConversations(data.conversations)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="No conversations yet"
          description="When you contact an owner (or a seeker contacts you), your conversations will appear here."
          icon={<MessagesSquare className="h-8 w-8" />}
        />
      </div>
    )
  }

  return (
    <ul className="divide-y">
      {conversations.map((c) => (
        <li key={c.id}>
          <Link
            href={`${basePath}/${c.id}`}
            className={cn(
              'flex items-center gap-3 p-3 transition-colors hover:bg-muted',
              c.id === currentId && 'bg-muted'
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getInitials(otherName(c))}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium">{otherName(c)}</p>
                {c.messages?.[0] && (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {timeAgo(c.updatedAt)}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {c.property.title}
              </p>
              {c.messages?.[0] && (
                <p className="truncate text-xs text-muted-foreground">{c.messages[0].content}</p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
