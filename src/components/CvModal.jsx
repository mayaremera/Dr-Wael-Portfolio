import { useCallback, useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export default function CvModal({ open, onClose }) {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if ((event.ctrlKey || event.metaKey) && ['s', 'p', 'c', 'a'].includes(event.key.toLowerCase())) {
        event.preventDefault()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    let cancelled = false

    async function loadPdf() {
      setLoading(true)
      setError('')
      setPages([])

      try {
        const pdf = await pdfjsLib.getDocument('/cv.pdf').promise
        const images = []

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber)
          const viewport = page.getViewport({ scale: 1.65 })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')

          canvas.width = viewport.width
          canvas.height = viewport.height

          await page.render({ canvasContext: context, viewport, canvas }).promise
          images.push(canvas.toDataURL('image/jpeg', 0.92))
        }

        if (!cancelled) setPages(images)
      } catch {
        if (!cancelled) setError('Unable to load CV. Please try again later.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPdf()

    return () => {
      cancelled = true
    }
  }, [open])

  const blockInteraction = useCallback((event) => {
    event.preventDefault()
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Curriculum Vitae preview"
    >
      <button
        type="button"
        aria-label="Close CV preview"
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <p className="font-serif text-xl text-brand sm:text-2xl">Curriculum Vitae</p>
            <p className="mt-0.5 text-xs tracking-wide text-ink-muted uppercase">
              Preview only
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-alt hover:text-brand"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div
          className="select-none overflow-y-auto bg-surface-alt px-4 py-6 sm:px-8"
          onContextMenu={blockInteraction}
          onCopy={blockInteraction}
          onCut={blockInteraction}
          onDragStart={blockInteraction}
        >
          {loading && (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-ink-muted">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
              <p className="text-sm">Loading CV…</p>
            </div>
          )}

          {error && (
            <div className="flex min-h-64 items-center justify-center px-6 text-center text-sm text-ink-muted">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="mx-auto flex max-w-2xl flex-col gap-5">
              {pages.map((src, index) => (
                <div
                  key={src}
                  className="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black/5"
                >
                  <img
                    src={src}
                    alt={`CV page ${index + 1}`}
                    draggable={false}
                    className="pointer-events-none block w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 bg-white px-5 py-3 text-center sm:px-6">
          <p className="text-xs text-ink-muted">
            This document is for viewing only. Downloading and copying are disabled.
          </p>
        </div>
      </div>
    </div>
  )
}
