import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon
  label: string
  value: number | string
  href?: string
}) {
  const inner = (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <span className="mt-3 text-2xl font-bold">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{inner}</Link>
  }
  return inner
}
