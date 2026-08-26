'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'

export default function SeekerProfilePage() {
  const { data: session } = useSession()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session?.user?.image ?? undefined} />
              <AvatarFallback className="text-lg">
                {getInitials(session?.user?.name ?? 'S')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <dt className="text-muted-foreground">Role</dt>
              <dd>
                <Badge variant="secondary">House Seeker</Badge>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{session?.user?.email}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
