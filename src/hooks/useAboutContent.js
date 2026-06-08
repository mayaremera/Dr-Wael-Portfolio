import { useEffect, useState } from 'react'
import { CONTENT_UPDATED_EVENT } from '../data/contentStore'
import { loadAboutContent } from '../data/aboutContentStore'

export function useAboutContent() {
  const [content, setContent] = useState(loadAboutContent)

  useEffect(() => {
    const refresh = () => setContent(loadAboutContent())

    window.addEventListener(CONTENT_UPDATED_EVENT, refresh)
    window.addEventListener('storage', refresh)

    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return content
}
