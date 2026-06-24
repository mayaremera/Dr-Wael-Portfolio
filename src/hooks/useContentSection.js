import { useEffect, useState } from 'react'
import {
  CONTENT_UPDATED_EVENT,
  getCachedSectionData,
  subscribeToRemoteContent,
  subscribeToSectionContent,
} from '../data/contentSync'
import { isSupabaseConfigured } from '../lib/supabase'

export function useContentSection(loadLocal, loadRemote, sectionKey = null) {
  const [content, setContent] = useState(() => {
    if (isSupabaseConfigured && sectionKey) {
      return getCachedSectionData(sectionKey)
    }
    return loadLocal()
  })
  const [isRemoteLoaded, setIsRemoteLoaded] = useState(() => {
    if (!isSupabaseConfigured) return true
    if (!sectionKey) return false
    return getCachedSectionData(sectionKey) != null
  })

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setContent(loadLocal())
      setIsRemoteLoaded(true)
      return
    }

    let cancelled = false

    const applyContent = (nextContent) => {
      if (!cancelled) {
        setContent(nextContent)
        setIsRemoteLoaded(true)
      }
    }

    const unsubscribeSection = sectionKey
      ? subscribeToSectionContent(sectionKey, applyContent)
      : () => {}

    if (!sectionKey || !getCachedSectionData(sectionKey)) {
      loadRemote()
        .then(applyContent)
        .catch((error) => {
          console.warn('[content] Remote load failed.', error?.message)
          if (!cancelled) {
            setIsRemoteLoaded(true)
          }
        })
    }

    const refreshRemote = (changedSection) => {
      if (sectionKey && changedSection && changedSection !== sectionKey) return

      loadRemote()
        .then(applyContent)
        .catch((error) => {
          console.warn('[content] Remote refresh failed.', error?.message)
        })
    }

    const unsubscribeRealtime = subscribeToRemoteContent(refreshRemote)

    const onContentUpdated = (event) => {
      const changedSection = event.detail?.section
      if (sectionKey && changedSection && changedSection !== sectionKey) return
      if (sectionKey && getCachedSectionData(sectionKey)) return
      refreshRemote(changedSection)
    }

    window.addEventListener(CONTENT_UPDATED_EVENT, onContentUpdated)

    return () => {
      cancelled = true
      unsubscribeSection()
      unsubscribeRealtime()
      window.removeEventListener(CONTENT_UPDATED_EVENT, onContentUpdated)
    }
  }, [loadLocal, loadRemote, sectionKey])

  return { content, isRemoteLoaded }
}
