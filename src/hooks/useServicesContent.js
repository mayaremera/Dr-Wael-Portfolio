import { useEffect, useState } from 'react'
import { CONTENT_UPDATED_EVENT } from '../data/contentStore'
import { loadServicesContent } from '../data/servicesContentStore'

export function useServicesContent() {
  const [content, setContent] = useState(loadServicesContent)

  useEffect(() => {
    const refresh = () => setContent(loadServicesContent())

    window.addEventListener(CONTENT_UPDATED_EVENT, refresh)
    window.addEventListener('storage', refresh)

    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return content
}
