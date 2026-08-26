'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

export function useFavorites(initialFavorited = false) {
  const { data: session } = useSession()
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  const toggle = useCallback(
    async (propertyId: string) => {
      if (!session?.user?.id) {
        toast({
          title: 'Please log in',
          description: 'Log in to save properties to your favorites.',
          variant: 'destructive',
        })
        return
      }
      setLoading(true)
      try {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId }),
        })
        const data = await res.json()
        if (res.ok) {
          setFavorited(data.favorited)
          toast({
            title: data.favorited ? 'Saved to favorites' : 'Removed from favorites',
            variant: 'success',
          })
        } else {
          throw new Error(data.error || 'Something went wrong')
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Something went wrong',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [session?.user?.id]
  )

  return { favorited, setFavorited, toggle, loading }
}

export function FavoriteButton({
  propertyId,
  initiallyFavorited = false,
  className,
}: {
  propertyId: string
  initiallyFavorited?: boolean
  className?: string
}) {
  const { data: session } = useSession()
  const { favorited, toggle, loading } = useFavorites(initiallyFavorited)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(propertyId)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow backdrop-blur transition-transform hover:scale-110',
        favorited ? 'text-red-500' : 'text-muted-foreground',
        className
      )}
      disabled={loading}
    >
      <Heart className={cn('h-5 w-5', favorited && 'fill-current')} />
    </button>
  )
}
