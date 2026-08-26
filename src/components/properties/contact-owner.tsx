'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MessagesSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'

export function ContactOwner({
  propertyId,
  ownerName,
  propertyTitle,
  bedroomType,
}: {
  propertyId: string
  ownerName: string
  propertyTitle: string
  bedroomType: string
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleContact = async () => {
    if (!session?.user?.id) {
      toast({ title: 'Please log in', description: 'Log in to contact the owner.', variant: 'destructive' })
      router.push('/login')
      return
    }
    if (!message.trim()) {
      toast({ title: 'Add a message', description: 'Tell the owner why you are interested.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, content: message }),
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: 'Message sent', description: 'Your enquiry has been sent to the owner.', variant: 'success' })
        setOpen(false)
        setMessage('')
      } else {
        throw new Error(data.error || 'Failed to send')
      }
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to send', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <MessagesSquare className="mr-2 h-4 w-4" /> Contact Owner
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact {ownerName}</DialogTitle>
          <DialogDescription>
            Ask about {propertyTitle}. The owner will reply in your messages.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hi, I'm interested in this ${bedroomType}. Is it still available?`}
          rows={4}
        />
        <DialogFooter>
          <Button onClick={handleContact} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessagesSquare className="mr-2 h-4 w-4" />}
            Send Enquiry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
