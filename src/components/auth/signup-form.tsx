'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signupSchema } from '@/lib/validations'
import type { z } from 'zod'

export function SignupForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [role, setRole] = useState<'SEEKER' | 'OWNER'>('SEEKER')

  type SignupForm = z.infer<typeof signupSchema>
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'SEEKER' },
  })

  async function onSubmit(data: SignupForm) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role }),
      })
      const body = await res.json()
      if (!res.ok) {
        setError(body.error || 'Something went wrong.')
        setLoading(false)
        return
      }
      router.push('/login')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function onGoogleSignup() {
    setGoogleLoading(true)
    setError(null)
    await signIn('google', { callbackUrl: '/seeker/dashboard' })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label>I am a...</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('SEEKER')}
              className={`rounded-lg border-2 p-3 text-center text-sm font-medium transition-colors ${
                role === 'SEEKER'
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-input hover:border-muted-foreground'
              }`}
            >
              House Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole('OWNER')}
              className={`rounded-lg border-2 p-3 text-center text-sm font-medium transition-colors ${
                role === 'OWNER'
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-input hover:border-muted-foreground'
              }`}
            >
              House Owner
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Your name" autoComplete="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="9876543210"
            autoComplete="tel"
            {...register('phone')}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message as string}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          Sign Up
        </Button>
      </form>

      {googleEnabled && (
        <>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={googleLoading}
            onClick={onGoogleSignup}
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Sign up with Google
          </Button>
        </>
      )}
    </div>
  )
}
