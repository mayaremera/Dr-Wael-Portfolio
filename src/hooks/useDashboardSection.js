import { useEffect, useState } from 'react'
export function useDashboardSection(getDefaults, loadRemote) {
  const [content, setContent] = useState(getDefaults)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setLoadError('')

    loadRemote()
      .then((data) => {
        if (!cancelled) {
          setContent(data)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error?.message || 'Could not load content from Supabase.')
          setContent(getDefaults())
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [getDefaults, loadRemote])

  return { content, setContent, loading, loadError }
}
