'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CalendarCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

export function RequestVisit({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleRequest = async () => {
    if (!session?.user?.id) {
      toast({ title: 'Please log in', description: 'Log in to request a property visit.', variant: 'destructive' })
      router.push('/login')
      return
    }
    if (!date || !time) {
      toast({ title: 'Select a date and time', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, date, time, message }),
      })
      const data = await res.json()
      if (res.ok) {
        toast({
          title: 'Visit requested',
          description: 'The owner will respond to your visit request.',
          variant: 'success',
        })
        setOpen(false)
        setDate('')
        setTime('')
        setMessage('')
      } else {
        throw new Error(data.error || 'Failed to request visit')
      }
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to request visit', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <CalendarCheck className="mr-2 h-4 w-4" /> Request Visit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a visit</DialogTitle>
          <DialogDescription>
            Choose a preferred date and time to visit {propertyTitle}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="visit-date">Date</Label>
            <Input
              id="visit-date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visit-time">Preferred Time</Label>
            <Input
              id="visit-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="visit-message">Message (optional)</Label>
          <Textarea
            id="visit-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add any details for the owner, e.g. I will be coming after work."
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleRequest} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarCheck className="mr-2 h-4 w-4" />}
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
