'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Flag, Loader2 } from 'lucide-react'
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
import { REPORT_REASON_OPTIONS, REPORT_REASON_LABELS } from '@/lib/constants'

export function ReportListing({ propertyId }: { propertyId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({ title: 'Please log in', description: 'Log in to report a listing.', variant: 'destructive' })
      router.push('/login')
      return
    }
    if (!reason) {
      toast({ title: 'Select a reason', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, reason, description }),
      })
      const data = await res.json()
      if (res.ok) {
        toast({
          title: 'Report submitted',
          description: 'Thanks for helping keep RentEase safe. Our team will review it.',
          variant: 'success',
        })
        setOpen(false)
        setReason('')
        setDescription('')
      } else {
        throw new Error(data.error || 'Failed to submit report')
      }
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to submit', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Flag className="mr-1 h-4 w-4" /> Report Listing
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this listing</DialogTitle>
          <DialogDescription>
            Tell us what&apos;s wrong. Your report is confidential.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Select a reason…</option>
            {REPORT_REASON_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {REPORT_REASON_LABELS[r]}
              </option>
            ))}
          </select>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any additional details (optional)"
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Flag className="mr-2 h-4 w-4" />}
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
