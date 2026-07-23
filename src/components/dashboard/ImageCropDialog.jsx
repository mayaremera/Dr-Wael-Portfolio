import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { getCroppedImageFileFromElement } from '../../lib/cropImage'
import { normalizeCertificateImageCrop } from '../../data/aboutContentStore'

const DEFAULT_ASPECT = 3 / 4
const MIN_ZOOM = 0.35
const MAX_ZOOM = 3
const DEFAULT_ZOOM = 1

function createCenteredAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

function isUsablePercentCrop(crop) {
  const normalized = normalizeCertificateImageCrop(crop)
  return Boolean(normalized && normalized.width > 0 && normalized.height > 0)
}

function syncCropFromPercent(percentCrop, image) {
  if (!image?.width || !image?.height || !isUsablePercentCrop(percentCrop)) return null

  const nextPercent = { ...normalizeCertificateImageCrop(percentCrop), unit: '%' }
  return {
    percent: nextPercent,
    pixels: convertToPixelCrop(nextPercent, image.width, image.height),
  }
}

export default function ImageCropDialog({
  open,
  imageSrc,
  aspect = DEFAULT_ASPECT,
  initialCrop = null,
  title = 'Crop image to card',
  hint = 'Zoom out to see more · drag any side or corner to resize · drag inside to move.',
  confirmLabel = 'Apply crop',
  onCancel,
  onConfirm,
}) {
  const titleId = useId()
  const zoomId = useId()
  const imgRef = useRef(null)
  const percentCropRef = useRef(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    setCrop(undefined)
    setCompletedCrop(undefined)
    setZoom(DEFAULT_ZOOM)
    percentCropRef.current = isUsablePercentCrop(initialCrop) ? normalizeCertificateImageCrop(initialCrop) : null
    setApplying(false)
    setError('')
  }, [open, imageSrc, initialCrop])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        if (!applying) onCancel()
      }
    }

    window.addEventListener('keydown', onKeyDown, true)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown, true)
    }
  }, [open, onCancel, applying])

  const applyPercentCrop = useCallback((percentCrop, image = imgRef.current) => {
    const synced = syncCropFromPercent(percentCrop, image)
    if (!synced) return

    percentCropRef.current = synced.percent
    setCrop(synced.percent)
    setCompletedCrop(synced.pixels)
  }, [])

  const onImageLoad = useCallback(
    (event) => {
      const image = event.currentTarget
      const savedCrop = normalizeCertificateImageCrop(initialCrop)
      const nextCrop = savedCrop
        ? { ...savedCrop, unit: '%' }
        : createCenteredAspectCrop(image.width, image.height, aspect)

      applyPercentCrop(nextCrop, image)
    },
    [aspect, initialCrop, applyPercentCrop],
  )

  useEffect(() => {
    if (!open) return

    const frame = window.requestAnimationFrame(() => {
      applyPercentCrop(percentCropRef.current, imgRef.current)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [zoom, open, applyPercentCrop])

  const handleApply = async () => {
    const image = imgRef.current
    if (!image || !completedCrop?.width || !completedCrop?.height || applying) return

    setApplying(true)
    setError('')

    try {
      const file = await getCroppedImageFileFromElement(image, completedCrop, { aspect })
      const savedPercent =
        normalizeCertificateImageCrop(percentCropRef.current) ||
        normalizeCertificateImageCrop({
          unit: '%',
          x: (completedCrop.x / image.width) * 100,
          y: (completedCrop.y / image.height) * 100,
          width: (completedCrop.width / image.width) * 100,
          height: (completedCrop.height / image.height) * 100,
        })

      await onConfirm(file, savedPercent)
    } catch (cropError) {
      setError(cropError?.message || 'Could not crop this image. Try another one.')
      setApplying(false)
    }
  }

  if (!open || !imageSrc || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Cancel crop"
        className="absolute inset-0 bg-ink/55"
        onClick={() => {
          if (!applying) onCancel()
        }}
      />

      <div
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_48px_-12px_rgba(28,40,51,0.28)]"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="h-0.5 shrink-0 bg-brand" aria-hidden="true" />

        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
          <div className="min-w-0">
            <h2 id={titleId} className="font-serif text-2xl leading-tight text-ink">
              {title}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">{hint}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!applying) onCancel()
            }}
            aria-label="Close"
            disabled={applying}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-muted/70 transition-colors hover:bg-surface-alt hover:text-brand disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="image-crop-stage mx-5 max-h-[min(55vh,26rem)] overflow-auto rounded-xl bg-slate-950">
          <div className="flex min-h-[12rem] w-full items-start justify-center p-3">
            <div className="w-full min-w-0" style={{ width: `${Math.round(zoom * 100)}%` }}>
              <ReactCrop
                crop={crop}
                keepSelection
                ruleOfThirds
                minWidth={24}
                minHeight={24}
                onChange={(_nextCrop, percentCrop) => {
                  const normalized = normalizeCertificateImageCrop(percentCrop)
                  percentCropRef.current = normalized
                  setCrop(normalized ? { ...normalized, unit: '%' } : percentCrop)
                }}
                onComplete={(nextCrop, percentCrop) => {
                  setCompletedCrop(nextCrop)
                  percentCropRef.current = normalizeCertificateImageCrop(percentCrop)
                }}
                className="max-w-none"
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt=""
                  onLoad={onImageLoad}
                  className="block h-auto w-full max-w-none"
                  crossOrigin={imageSrc.startsWith('blob:') || imageSrc.startsWith('data:') ? undefined : 'anonymous'}
                />
              </ReactCrop>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 pt-4 pb-5">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor={zoomId} className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
                Zoom
              </label>
              <span className="text-xs tabular-nums text-ink-muted">{zoom.toFixed(2)}×</span>
            </div>
            <input
              id={zoomId}
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              disabled={applying}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand disabled:cursor-not-allowed disabled:opacity-60"
            />
            <div className="mt-1.5 flex justify-between text-[0.65rem] tracking-wide text-ink-muted/80 uppercase">
              <span>Zoom out</span>
              <span>Zoom in</span>
            </div>
          </div>

          {error ? <p className="text-xs text-accent-hover">{error}</p> : null}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={applying}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/20 hover:bg-surface-alt hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={applying || !completedCrop?.width}
              className="rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {applying ? 'Applying…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
