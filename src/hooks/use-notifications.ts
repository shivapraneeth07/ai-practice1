'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export function useUnreadCount() {
  const { data: session } = useSession()
  const [unread, setUnread] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!session?.user?.id) {
      setUnread(0)
      return
    }
    let active = true
    fetch('/api/notifications/count')
      .then((res) => (res.ok ? res.json() : { count: 0 }))
      .then((data) => {
        if (active) setUnread(data.count ?? 0)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [session?.user?.id, refreshKey])

  return { unread, refresh: () => setRefreshKey((k) => k + 1) }
}
