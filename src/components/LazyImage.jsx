import { useState } from 'react'
import { useInView } from '../hooks/useInView'

export default function LazyImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  rootMargin,
  ...props
}) {
  const [ref, inView] = useInView({ rootMargin })
  const [loaded, setLoaded] = useState(false)

  if (!src) return null

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`.trim()}>
      {!loaded && inView ? <div className="absolute inset-0 bg-slate-100/40" aria-hidden="true" /> : null}
      {inView ? (
        <img
          src={src}
          alt={alt}
          className={`${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${imgClassName || ''}`.trim()}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          {...props}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-100/40" aria-hidden="true" />
      )}
    </div>
  )
}
