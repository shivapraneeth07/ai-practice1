import Link from 'next/link'
import { requireRole } from '@/lib/auth-utils'
import { ChatView } from '@/components/messages/chat-view'
import { Button } from '@/components/ui/button'

export default async function OwnerConversationPage({ params }: { params: { id: string } }) {
  await requireRole(['OWNER'])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Conversation</h1>
        <Button asChild variant="ghost" size="sm">
          <Link href="/owner/messages">Back to messages</Link>
        </Button>
      </div>
      <div className="rounded-xl border bg-card">
        <ChatView conversationId={params.id} />
      </div>
    </div>
  )
}
