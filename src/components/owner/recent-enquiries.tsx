import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function RecentEnquiries({
  conversations,
}: {
  conversations: any[]
}) {
  if (conversations.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        <MessageSquare className="mx-auto mb-2 h-6 w-6" />
        No enquiries yet. Once seekers message you, they&apos;ll appear here.
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {conversations.map((c) => (
        <li key={c.id}>
          <Link
            href={`/owner/messages/${c.id}`}
            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{c.seeker.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                Re: {c.property.title}
              </p>
            </div>
            <div className="ml-3 shrink-0 text-right">
              {c.messages[0] && (
                <p className="max-w-[12rem] truncate text-xs text-muted-foreground">
                  {c.messages[0].content}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{formatDate(c.updatedAt)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
