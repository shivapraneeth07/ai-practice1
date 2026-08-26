'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from '@/components/ui/use-toast'
import { cn, getInitials, formatDateTime } from '@/lib/utils'

export function ChatView({ conversationId }: { conversationId: string }) {
  const { data: session } = useSession()
  const [conversation, setConversation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`)
      const data = await res.json()
      if (res.ok) setConversation(data.conversation)
    } catch {
      toast({ title: 'Error', description: 'Failed to load conversation.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [conversationId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages?.length])

  const send = async () => {
    if (!content.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setContent('')
        await load()
      } else {
        throw new Error(data.error || 'Failed to send')
      }
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col p-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="mt-4 flex-1 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={cn('h-12 w-2/3', i % 2 === 0 ? 'ml-auto' : '')} />
          ))}
        </div>
      </div>
    )
  }

  if (!conversation) {
    return <p className="p-8 text-center text-muted-foreground">Conversation not found.</p>
  }

  const isSeeker = session?.user?.id === conversation.seekerId
  const otherPerson = isSeeker ? conversation.owner : conversation.seeker

  return (
    <div className="flex h-[70vh] flex-col">
      <div className="flex items-center gap-3 border-b p-4">
        <Avatar className="h-9 w-9">
          <AvatarFallback>{getInitials(otherPerson.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold">{otherPerson.name}</p>
          <p className="text-xs text-muted-foreground">
            Re: {conversation.property.title}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {conversation.messages.map((m: any) => {
          const mine = m.senderId === session?.user?.id
          return (
            <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-2 text-sm',
                  mine ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                <p>{m.content}</p>
                <p className={cn('mt-1 text-[10px]', mine ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                  {formatDateTime(m.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t p-4">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message…"
        />
        <Button onClick={send} disabled={sending || !content.trim()} size="icon">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
