import { createPortal } from 'react-dom'

export default function DashboardSaveNotice({ message, error, saving = false }) {
  if (!message && !error && !saving) return null

  const text = saving ? 'Saving…' : error || message

  return createPortal(
    <div
      role={error ? 'alert' : 'status'}
      aria-live="polite"
      className={`fixed right-6 bottom-6 z-[100] max-w-sm rounded-xl border px-4 py-3 shadow-lg ${
        saving
          ? 'border-slate-200 bg-white text-ink-muted shadow-slate-200/20'
          : error
            ? 'border-accent/20 bg-white text-accent-hover shadow-accent/10'
            : 'border-brand/20 bg-white text-brand shadow-brand/10'
      }`}
    >
      <p className="text-sm font-semibold">{text}</p>
    </div>,
    document.body,
  )
}
