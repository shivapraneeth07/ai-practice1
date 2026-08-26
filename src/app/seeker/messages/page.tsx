import { MessagesSquare } from 'lucide-react'
import { requireRole } from '@/lib/auth-utils'
import { ConversationList } from '@/components/messages/conversation-list'

export default async function SeekerMessagesPage() {
  await requireRole(['SEEKER'])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <MessagesSquare className="h-6 w-6 text-primary" /> Messages
        </h1>
        <p className="text-sm text-muted-foreground">Your conversations with property owners.</p>
      </div>
      <div className="rounded-xl border bg-card">
        <ConversationList basePath="/seeker/messages" otherName={(c) => c.owner.name} />
      </div>
    </div>
  )
}
