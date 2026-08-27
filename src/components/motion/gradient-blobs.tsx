import { cn } from '@/lib/utils'

export function GradientBlobs({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl animate-blob-slow" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl animate-blob" />
    </div>
  )
}