'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, Home, LogOut, Bell, User, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { getInitials, cn } from '@/lib/utils'
import { useUnreadCount } from '@/hooks/use-notifications'

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-500 text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
        <Home className="h-5 w-5" />
      </span>
      <span className="text-xl font-bold tracking-tight">
        Rent<span className="text-primary">Ease</span>
      </span>
    </Link>
  )
}

function roleHref(role?: string) {
  if (role === 'OWNER') return '/owner/dashboard'
  if (role === 'ADMIN') return '/admin/dashboard'
  return '/seeker/dashboard'
}

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const role = session?.user?.role
  const { unread } = useUnreadCount()

  const dashboardHref = roleHref(role)

  const navLinks =
    role === 'OWNER'
      ? [
          { href: '/properties', label: 'Browse Properties' },
          { href: '/owner/properties/new', label: 'List a Property' },
        ]
      : role === 'ADMIN'
        ? [{ href: '/admin/dashboard', label: 'Admin Panel' }]
        : [{ href: '/properties', label: 'Find a Home' }]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className={cn(
                'relative text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100',
                isActive(pathname, link.href)
                  ? 'text-foreground after:scale-x-100'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {status === 'loading' ? null : session?.user ? (
            <>
              {role === 'OWNER' && (
                <Button asChild size="sm" variant="default">
                  <Link href="/owner/properties/new">
                    <PlusCircle className="mr-1 h-4 w-4" /> List Property
                  </Link>
                </Button>
              )}
              <Button asChild size="icon" variant="ghost" aria-label="Notifications">
                <Link href={`${dashboardHref === '/owner/dashboard' ? '/owner/messages' : '/seeker/notifications'}`}>
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="h-9 w-9 transition-transform duration-200 hover:scale-105">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback>{getInitials(session.user.name || 'U')}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{session.user.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {role === 'OWNER' ? 'House Owner' : role === 'ADMIN' ? 'Admin' : 'House Seeker'}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardHref}>
                      <User className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="rounded-md p-2 transition-colors hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-in-up border-t bg-background p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isActive(pathname, link.href) ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            {session?.user ? (
              <>
                <Link href={dashboardHref} onClick={() => setOpen(false)} className="text-sm font-medium">
                  Dashboard
                </Link>
                <Link href={role === 'OWNER' ? '/owner/messages' : '/seeker/notifications'} onClick={() => setOpen(false)} className="text-sm font-medium">
                  Notifications
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}