import { useEffect, useState } from 'react'
import { CONTENT_UPDATED_EVENT } from '../data/contentStore'
import { loadContactContent } from '../data/contactContentStore'

export function useContactContent() {
  const [content, setContent] = useState(loadContactContent)

  useEffect(() => {
    const refresh = () => setContent(loadContactContent())

    window.addEventListener(CONTENT_UPDATED_EVENT, refresh)
    window.addEventListener('storage', refresh)

    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return content
}
