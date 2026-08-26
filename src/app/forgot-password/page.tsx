'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/layout/navbar'
import { forgotPasswordSchema } from '@/lib/validations'

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null)
  const [devUrl, setDevUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(data: { email: string }) {
    setLoading(true)
    setError(null)
    setMessage(null)
    setDevUrl(null)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await res.json()
      if (!res.ok) {
        setError(body.error || 'Something went wrong.')
      } else {
        setMessage(body.message)
        setDevUrl(body.devResetUrl ?? null)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            )}
            {message && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">{message}</div>
            )}
            {devUrl && (
              <div className="rounded-md bg-muted p-3 text-xs">
                <p className="font-semibold">Dev mode — demo reset link:</p>
                <a href={devUrl} className="mt-1 block break-all text-primary hover:underline">
                  {devUrl}
                </a>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message as string}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
              Send Reset Link
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Remembered it?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
