'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  Bell,
  CalendarCheck,
  Flag,
  Heart,
  Inbox,
  LayoutDashboard,
  MessagesSquare,
  Search,
  ShieldCheck,
  UserCircle,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navIcons = {
  Bell,
  Building2,
  CalendarCheck,
  Flag,
  Heart,
  Inbox,
  LayoutDashboard,
  MessagesSquare,
  Search,
  ShieldCheck,
  UserCircle,
  Users,
}

export interface NavItem {
  href: string
  label: string
  icon: keyof typeof navIcons
}

export function DashboardShell({
  navItems,
  children,
  roleLabel,
}: {
  navItems: readonly NavItem[]
  children: React.ReactNode
  roleLabel: string
}) {
  const pathname = usePathname()

  return (
    <div className="container flex flex-col gap-6 py-6 md:flex-row md:py-8">
      <aside className="shrink-0 md:w-60">
        <div className="flex items-center gap-2 px-2 pb-4 text-sm font-semibold text-muted-foreground">
          {roleLabel}
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-2 md:flex-col md:pb-0">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = navIcons[item.icon]
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
