'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/layout/navbar'
import { signupSchema } from '@/lib/validations'
import type { z } from 'zod'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
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

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Join RentEase and start your journey</CardDescription>
        </CardHeader>
        <CardContent>
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

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}