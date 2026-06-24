import { useEffect, useState } from 'react'
import { getCachedSectionData } from '../data/contentSync'
import { isSupabaseConfigured } from '../lib/supabase'

export function useDashboardSection(getDefaults, loadRemote, sectionKey = null) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false

    const applyContent = (data) => {
      if (!cancelled) {
        setContent(data)
        setLoading(false)
        setLoadError('')
      }
    }

    if (!isSupabaseConfigured) {
      setContent(getDefaults())
      setLoading(false)
      setLoadError('')
      return () => {
        cancelled = true
      }
    }

    const cached = sectionKey ? getCachedSectionData(sectionKey) : null
    if (cached) {
      applyContent(cached)
      return () => {
        cancelled = true
      }
    }

    setLoading(true)
    setLoadError('')

    loadRemote()
      .then(applyContent)
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error?.message || 'Could not load content from Supabase.')
          setContent(null)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [getDefaults, loadRemote, sectionKey])

  return { content, setContent, loading, loadError }
}
