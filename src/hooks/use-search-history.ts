'use client'

import { useCallback } from 'react'
import { useSession } from 'next-auth/react'

export function useSearchHistory() {
  const { data: session } = useSession()

  const recordSearch = useCallback(
    async (query: string) => {
      if (!session?.user?.id || !query.trim()) return
      try {
        await fetch('/api/search-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim() }),
        })
      } catch {
        // best-effort, ignore
      }
    },
    [session?.user?.id]
  )

  return { recordSearch }
}
