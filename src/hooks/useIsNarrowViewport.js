import { useEffect, useState } from 'react'

const NARROW_QUERY = '(max-width: 1023px)'

/**
 * True on phone/tablet widths used by the site’s mobile card layouts.
 * Starts false (desktop-first) then updates after mount — same pattern as gallery/certs.
 */
export function useIsNarrowViewport() {
  const [isNarrow, setIsNarrow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined

    const media = window.matchMedia(NARROW_QUERY)
    const sync = () => setIsNarrow(media.matches)
    sync()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', sync)
      return () => media.removeEventListener('change', sync)
    }

    media.addListener(sync)
    return () => media.removeListener(sync)
  }, [])

  return isNarrow
}
