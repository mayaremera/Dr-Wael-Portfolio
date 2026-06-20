export function Spinner({ className = 'h-8 w-8' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-brand/20 border-t-brand ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export default function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-surface/90 backdrop-blur-sm">
      <Spinner />
      {label ? <p className="text-sm text-ink-muted">{label}</p> : null}
    </div>
  )
}
