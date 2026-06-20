import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const DeleteConfirmContext = createContext(null)

const DEFAULT_TITLE = 'Delete this item?'
const DEFAULT_MESSAGE = 'This action cannot be undone. Are you sure you want to delete it?'

function DeleteConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      aria-describedby="delete-confirm-message"
    >
      <button
        type="button"
        aria-label="Cancel deletion"
        className="absolute inset-0 bg-ink/45 transition-opacity"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-[22rem] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_48px_-12px_rgba(28,40,51,0.18)] sm:max-w-sm">
        <div className="h-0.5 bg-brand" aria-hidden="true" />

        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted/70 transition-colors hover:bg-surface-alt hover:text-brand"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="px-6 pt-8 pb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-muted ring-1 ring-brand/10">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <h2 id="delete-confirm-title" className="mt-5 font-serif text-2xl leading-tight text-ink">
            {title}
          </h2>
          <p id="delete-confirm-message" className="mt-2.5 text-sm leading-relaxed text-ink-muted">
            {message}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/20 hover:bg-surface-alt hover:text-brand"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl border border-accent/20 bg-accent px-4 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:border-accent hover:bg-accent-hover"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DeleteConfirmProvider({ children }) {
  const [pending, setPending] = useState(null)

  const confirmDelete = useCallback((options) => {
    const { onConfirm, title = DEFAULT_TITLE, message = DEFAULT_MESSAGE, confirmLabel = 'Delete' } = options

    setPending({ onConfirm, title, message, confirmLabel })
  }, [])

  const handleCancel = useCallback(() => {
    setPending(null)
  }, [])

  const handleConfirm = useCallback(() => {
    pending?.onConfirm()
    setPending(null)
  }, [pending])

  return (
    <DeleteConfirmContext.Provider value={confirmDelete}>
      {children}
      <DeleteConfirmDialog
        open={Boolean(pending)}
        title={pending?.title ?? DEFAULT_TITLE}
        message={pending?.message ?? DEFAULT_MESSAGE}
        confirmLabel={pending?.confirmLabel ?? 'Delete'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DeleteConfirmContext.Provider>
  )
}

export function useConfirmDelete() {
  const confirmDelete = useContext(DeleteConfirmContext)

  if (!confirmDelete) {
    throw new Error('useConfirmDelete must be used within a DeleteConfirmProvider')
  }

  return confirmDelete
}
