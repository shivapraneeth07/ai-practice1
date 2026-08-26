import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/layout/navbar'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Log in to continue your house hunt</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm googleEnabled={googleEnabled} />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>

          <div className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Demo accounts</p>
            <p className="mt-1">Seeker: seeker@demo.com / password123</p>
            <p>Owner: owner@demo.com / password123</p>
            <p>Admin: admin@demo.com / password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
