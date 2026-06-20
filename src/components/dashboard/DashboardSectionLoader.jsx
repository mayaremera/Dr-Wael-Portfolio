import { Spinner } from '../PageLoader'

export default function DashboardSectionLoader({ loading, loadError }) {
  if (!loading && !loadError) return null

  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm">
      {loading ? (
        <>
          <Spinner className="h-5 w-5 shrink-0" />
          <p className="text-ink-muted">Loading content from Supabase…</p>
        </>
      ) : null}
      {loadError ? <p className="text-accent-hover">{loadError}</p> : null}
    </div>
  )
}
