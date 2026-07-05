import { useInView } from '../hooks/useInView'

export default function LazySection({
  children,
  minHeight = '16rem',
  rootMargin = '280px 0px',
  className = '',
}) {
  const [ref, inView] = useInView({ rootMargin, once: true })

  return (
    <div ref={ref} className={className} style={!inView ? { minHeight } : undefined}>
      {inView ? (
        children
      ) : (
        <div className="flex items-center justify-center py-12" aria-hidden="true">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
        </div>
      )}
    </div>
  )
}
