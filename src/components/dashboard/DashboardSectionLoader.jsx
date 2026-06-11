export default function DashboardSectionLoader({ loading, loadError }) {
  if (!loading && !loadError) return null

  return (
    <div className="mb-6 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm">
      {loading ? <p className="text-ink-muted">Loading content from Supabase…</p> : null}
      {loadError ? <p className="text-accent-hover">{loadError}</p> : null}
    </div>
  )
}
