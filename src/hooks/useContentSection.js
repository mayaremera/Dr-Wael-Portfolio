import { useEffect, useState } from 'react'
import { CONTENT_UPDATED_EVENT, subscribeToRemoteContent } from '../data/contentSync'
import { isSupabaseConfigured } from '../lib/supabase'

export function useContentSection(loadLocal, loadRemote) {
  const [content, setContent] = useState(loadLocal)
  const [isRemoteLoaded, setIsRemoteLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    const refreshRemote = async () => {
      try {
        const remoteContent = await loadRemote()
        if (!cancelled) {
          setContent(remoteContent)
          setIsRemoteLoaded(true)
        }
      } catch (error) {
        console.warn('[content] Remote refresh failed.', error?.message)
        if (!cancelled) {
          setContent(loadLocal())
          setIsRemoteLoaded(true)
        }
      }
    }

    refreshRemote()

    const refreshAfterSave = () => {
      if (isSupabaseConfigured) {
        refreshRemote()
        return
      }

      setContent(loadLocal())
    }

    window.addEventListener(CONTENT_UPDATED_EVENT, refreshAfterSave)
    window.addEventListener('storage', refreshAfterSave)

    const unsubscribeRealtime = subscribeToRemoteContent(() => {
      refreshRemote()
    })

    return () => {
      cancelled = true
      window.removeEventListener(CONTENT_UPDATED_EVENT, refreshAfterSave)
      window.removeEventListener('storage', refreshAfterSave)
      unsubscribeRealtime()
    }
  }, [loadLocal, loadRemote])

  return { content, isRemoteLoaded }
}
