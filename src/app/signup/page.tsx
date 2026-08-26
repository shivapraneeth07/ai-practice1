import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/layout/navbar'
import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

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
          <SignupForm googleEnabled={googleEnabled} />

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
