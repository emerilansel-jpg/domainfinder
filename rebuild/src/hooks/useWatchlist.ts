import { useState, useCallback, useEffect } from 'react'
import type { Domain } from '@/types/domain'

const WATCHLIST_KEY = 'domfindr_watchlist'

export function useWatchlist() {
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY)
      if (raw) return new Set(JSON.parse(raw))
    } catch {}
    return new Set<string>()
  })

  const [watchlist, setWatchlist] = useState<Domain[]>([])

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify([...savedIds]))
  }, [savedIds])

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds])

  const toggleSave = useCallback((domain: Domain) => {
    setSavedIds(prev => {
      const next = new Set(prev)
      if (next.has(domain.id)) {
        next.delete(domain.id)
      } else {
        next.add(domain.id)
      }
      return next
    })
  }, [])

  const updateWatchlist = useCallback((domains: Domain[]) => {
    setWatchlist(domains.filter(d => savedIds.has(d.id)))
  }, [savedIds])

  return { savedIds, watchlist, isSaved, toggleSave, updateWatchlist }
}
