import { useEffect, useState } from 'react'
import { CONTENT_UPDATED_EVENT } from '../data/contentStore'
import { loadGalleryContent } from '../data/galleryContentStore'

export function useGalleryContent() {
  const [content, setContent] = useState(loadGalleryContent)

  useEffect(() => {
    const refresh = () => setContent(loadGalleryContent())

    window.addEventListener(CONTENT_UPDATED_EVENT, refresh)
    window.addEventListener('storage', refresh)

    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return content
}
