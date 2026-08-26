import { Inbox } from 'lucide-react'
import { requireRole } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { ConversationList } from '@/components/messages/conversation-list'

export default async function OwnerEnquiriesPage() {
  const user = await requireRole(['OWNER'])

  const total = await prisma.conversation.count({ where: { ownerId: user.id } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enquiries</h1>
        <p className="text-sm text-muted-foreground">
          Messages from interested house seekers. {total} total.
        </p>
      </div>
      <div className="rounded-xl border bg-card">
        <ConversationList basePath="/owner/messages" otherName={(c) => c.seeker.name} />
      </div>
    </div>
  )
}
