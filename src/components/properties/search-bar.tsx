'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AREA_NAMES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useSearchHistory } from '@/hooks/use-search-history'

export function SearchBar({
  defaultValue,
  large,
  compact,
  className,
}: {
  defaultValue?: string
  large?: boolean
  compact?: boolean
  className?: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue ?? '')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const { recordSearch } = useSearchHistory()

  const filtered = (term: string) => {
    const t = term.toLowerCase()
    return AREA_NAMES.filter((a) => a.toLowerCase().includes(t))
  }

  useEffect(() => {
    if (query.length > 0) {
      setSuggestions(filtered(query))
      setOpen(true)
    } else {
      setSuggestions([])
      setOpen(false)
    }
  }, [query])

  const submit = (q?: string) => {
    const term = (q ?? query).trim()
    if (!term) return
    recordSearch(term)
    setOpen(false)
    router.push(`/properties?q=${encodeURIComponent(term)}`)
  }

  return (
    <div className={cn('relative w-full', className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className={cn('flex w-full items-center gap-0 overflow-hidden rounded-full border bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring', large && 'shadow-lg')}
      >
        <Search className={cn('ml-4 h-5 w-5 shrink-0 text-muted-foreground', large && 'h-6 w-6')} />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Search by area, city or locality…"
          className={cn('border-0 bg-transparent shadow-none focus-visible:ring-0', large ? 'h-14 text-lg' : 'h-11')}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setSuggestions([])
            }}
            className="mr-1 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button type="submit" size={large ? 'lg' : 'default'} className="mr-1.5 rounded-full">
          Search
        </Button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full z-20 mt-2 w-full overflow-hidden rounded-lg border bg-background shadow-lg">
          {suggestions.slice(0, 8).map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => submit(area)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              {area}
            </button>
          ))}
        </div>
      )}

      {open && suggestions.length === 0 && query && (
        <div className="absolute top-full z-20 mt-2 w-full rounded-lg border bg-background p-4 text-sm text-muted-foreground shadow-lg">
          Press search to find homes matching &quot;{query}&quot; anywhere.
        </div>
      )}
    </div>
  )
}
