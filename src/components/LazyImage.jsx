import { useMemo, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useIsNarrowViewport } from '../hooks/useIsNarrowViewport'
import { optimizeMediaUrlForMobile } from '../lib/mediaUrl'

/**
 * Defers <img> until near the viewport. On mobile, also requests a smaller
 * Supabase-rendered URL and uses low fetch priority for card grids/carousels.
 */
export default function LazyImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  rootMargin,
  mobileWidth = 640,
  mobileQuality = 68,
  optimizeForMobile = true,
  ...props
}) {
  const isMobile = useIsNarrowViewport()
  const [loaded, setLoaded] = useState(false)
  const [failedOptimized, setFailedOptimized] = useState(false)

  const effectiveMargin =
    rootMargin ?? (isMobile ? '80px 160px' : '160px 0px')

  const [ref, inView] = useInView({ rootMargin: effectiveMargin })

  const displaySrc = useMemo(() => {
    if (!src) return ''
    if (!optimizeForMobile || !isMobile || failedOptimized) return src
    return optimizeMediaUrlForMobile(src, {
      width: mobileWidth,
      quality: mobileQuality,
    })
  }, [src, isMobile, failedOptimized, optimizeForMobile, mobileWidth, mobileQuality])

  if (!src) return null

  const {
    fetchPriority: fetchPriorityProp,
    onError: onErrorProp,
    onLoad: onLoadProp,
    ...imgProps
  } = props

  const fetchPriority =
    fetchPriorityProp ?? (isMobile && optimizeForMobile ? 'low' : undefined)

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`.trim()}>
      {!loaded && inView ? <div className="absolute inset-0 bg-slate-100/40" aria-hidden="true" /> : null}
      {inView ? (
        <img
          key={displaySrc}
          src={displaySrc}
          alt={alt}
          className={`${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${imgClassName || ''}`.trim()}
          loading="lazy"
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={(event) => {
            setLoaded(true)
            onLoadProp?.(event)
          }}
          onError={(event) => {
            if (!failedOptimized && displaySrc !== src) {
              setFailedOptimized(true)
              setLoaded(false)
              return
            }
            onErrorProp?.(event)
          }}
          {...imgProps}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-100/40" aria-hidden="true" />
      )}
    </div>
  )
}
