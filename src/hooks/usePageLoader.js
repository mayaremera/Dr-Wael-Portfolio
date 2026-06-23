import { useEffect, useState } from 'react'

const MIN_DISPLAY_MS = 500
const FADE_MS = 350

export function usePageLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const startedAt = Date.now()

    const finish = () => {
      const remaining = Math.max(0, MIN_DISPLAY_MS - (Date.now() - startedAt))

      window.setTimeout(() => {
        if (cancelled) return
        setIsFading(true)
        window.setTimeout(() => {
          if (!cancelled) setIsLoading(false)
        }, FADE_MS)
      }, remaining)
    }

    if (document.readyState === 'complete') {
      finish()
    } else {
      window.addEventListener('load', finish, { once: true })
    }

    return () => {
      cancelled = true
    }
  }, [])

  return { isLoading, isFading }
}
