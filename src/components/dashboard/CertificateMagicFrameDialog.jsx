import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import {
  DEFAULT_FRAME_SETTINGS,
  FRAME_ASPECT,
  IMPROVE_PRESETS,
  IMPROVE_STRENGTHS,
  STUDIO_BACKGROUNDS,
  clearMagicFrameCutoutCache,
  cropToCertificateFrame,
  improveCertificatePhoto,
  normalizeCertificateImageFrame,
} from '../../lib/certificateMagicFrame'

const DEFAULT_CROP = { x: 0, y: 0 }
const DEFAULT_ZOOM = 1
const MIN_ZOOM = 0.6
const MAX_ZOOM = 3
const FULL_FRAME_CROP = { x: 0, y: 0, width: 100, height: 100 }

const IMPROVE_PRESET_LIST = [
  IMPROVE_PRESETS.center,
  IMPROVE_PRESETS.light,
  IMPROVE_PRESETS.clarity,
  IMPROVE_PRESETS.balanced,
  IMPROVE_PRESETS.vivid,
]

const IMPROVE_STRENGTH_LIST = [
  IMPROVE_STRENGTHS.subtle,
  IMPROVE_STRENGTHS.normal,
  IMPROVE_STRENGTHS.strong,
]

export default function CertificateMagicFrameDialog({
  open,
  imageSrc,
  initialSettings = null,
  aspect = FRAME_ASPECT,
  previewAspectClassName = 'aspect-[4/3]',
  title = 'Edit certificate photo',
  hint = 'Pick an Improve style, then fine-tune with drag and zoom.',
  initialZoom = DEFAULT_ZOOM,
  minZoom = MIN_ZOOM,
  fillMode = 'contain',
  onCancel,
  onConfirm,
}) {
  const titleId = useId()
  const zoomId = useId()
  const clearBgId = useId()
  const frameAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : FRAME_ASPECT
  const zoomFloor = Number.isFinite(minZoom) ? minZoom : MIN_ZOOM
  const zoomStart = Number.isFinite(initialZoom) ? Math.max(zoomFloor, Math.min(MAX_ZOOM, initialZoom)) : DEFAULT_ZOOM

  const [studio, setStudio] = useState(
    () => normalizeCertificateImageFrame(initialSettings)?.studio || DEFAULT_FRAME_SETTINGS.studio,
  )
  const [improvePreset, setImprovePreset] = useState(DEFAULT_FRAME_SETTINGS.improvePreset)
  const [improveStrength, setImproveStrength] = useState(DEFAULT_FRAME_SETTINGS.improveStrength)
  const [clearBackground, setClearBackground] = useState(false)
  const [workingSrc, setWorkingSrc] = useState('')
  const [improved, setImproved] = useState(false)
  const [usedClearBackground, setUsedClearBackground] = useState(false)
  const [crop, setCrop] = useState(DEFAULT_CROP)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [percentCrop, setPercentCrop] = useState(null)
  const [improving, setImproving] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const revokeIfBlob = (src) => {
    if (src?.startsWith('blob:') && src !== imageSrc) URL.revokeObjectURL(src)
  }

  useEffect(() => {
    if (!open) {
      clearMagicFrameCutoutCache()
      return undefined
    }

    const restored = normalizeCertificateImageFrame(initialSettings)
    const wasImproved = Boolean(restored?.improved || restored?.horizontalFit)
    setStudio(restored?.studio || DEFAULT_FRAME_SETTINGS.studio)
    setImprovePreset(restored?.improvePreset || DEFAULT_FRAME_SETTINGS.improvePreset)
    setImproveStrength(restored?.improveStrength || DEFAULT_FRAME_SETTINGS.improveStrength)
    setClearBackground(Boolean(restored?.removeBg))
    setWorkingSrc((current) => {
      revokeIfBlob(current)
      return imageSrc || ''
    })
    setImproved(wasImproved)
    setUsedClearBackground(Boolean(restored?.removeBg))
    setCrop(DEFAULT_CROP)
    setZoom(zoomStart)
    setPercentCrop(null)
    setImproving(false)
    setSaving(false)
    setError('')
    setStatus(
      wasImproved
        ? 'Showing your last saved photo. Pick an Improve style, or adjust crop, then Save.'
        : 'Choose an Improve style, then Improve photo. Drag and zoom to fine-tune.',
    )
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset once per open/src
  }, [open, imageSrc])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        if (!improving && !saving) onCancel()
      }
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown, true)
    }
  }, [open, onCancel, improving, saving])

  const onCropComplete = useCallback((croppedArea) => {
    if (croppedArea && croppedArea.width > 0 && croppedArea.height > 0) {
      setPercentCrop({
        x: croppedArea.x,
        y: croppedArea.y,
        width: croppedArea.width,
        height: croppedArea.height,
      })
    }
  }, [])

  const backgroundOptions = useMemo(
    () => [STUDIO_BACKGROUNDS.white, STUDIO_BACKGROUNDS.black, STUDIO_BACKGROUNDS.auto],
    [],
  )

  const activePreset = IMPROVE_PRESETS[improvePreset] || IMPROVE_PRESETS.balanced
  const strengthDisabled = improvePreset === 'center'

  const previewBg =
    studio === 'white' ? '#f8f8fa' : studio === 'black' ? '#121214' : '#1c1c1e'

  const busy = improving || saving

  const handleImprove = async () => {
    // Always start from the opened photo so switching styles does not stack.
    if (!imageSrc || busy) return

    setImproving(true)
    setError('')
    setStatus('Improving photo…')

    try {
      const file = await improveCertificatePhoto(imageSrc, {
        studio,
        clearBackground,
        improvePreset,
        improveStrength: strengthDisabled ? 'normal' : improveStrength,
        aspect: frameAspect,
        fillMode,
        onProgress: (message) => setStatus(message || 'Improving photo…'),
      })
      const nextUrl = URL.createObjectURL(file)
      setWorkingSrc((current) => {
        revokeIfBlob(current)
        return nextUrl
      })
      setImproved(true)
      setUsedClearBackground(clearBackground)
      setCrop(DEFAULT_CROP)
      setZoom(zoomStart)
      setPercentCrop(null)
      setStatus(`${activePreset.label} ready — drag and zoom, then Save.`)
    } catch (improveError) {
      setError(improveError?.message || 'Could not improve this photo. Try another one.')
      setStatus('You can still crop the photo and Save.')
    } finally {
      setImproving(false)
    }
  }

  const handleSave = async () => {
    if (!workingSrc || busy) return

    setSaving(true)
    setError('')
    setStatus('Saving…')

    const cropArea = percentCrop || FULL_FRAME_CROP

    try {
      const file = await cropToCertificateFrame(workingSrc, cropArea, { aspect: frameAspect })
      await onConfirm(file, {
        mode: 'remaster',
        removeBg: usedClearBackground,
        horizontalFit: improved,
        improved,
        zoom: 1,
        studio,
        improvePreset,
        improveStrength,
        region: null,
        frameCrop: cropArea,
      })
      setStatus('Saved.')
    } catch (saveError) {
      setError(saveError?.message || 'Could not save the photo.')
      setStatus('Adjust the crop, then Save again.')
    } finally {
      setSaving(false)
    }
  }

  if (!open || !imageSrc || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Cancel"
        className="absolute inset-0 bg-ink/55"
        onClick={() => {
          if (!busy) onCancel()
        }}
      />

      <div
        className="relative z-10 flex max-h-[min(94vh,58rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_48px_-12px_rgba(28,40,51,0.28)]"
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
              if (!busy) onCancel()
            }}
            aria-label="Close"
            disabled={busy}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-muted/70 transition-colors hover:bg-surface-alt hover:text-brand disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-2">
          <div
            className="relative overflow-hidden rounded-xl border border-slate-200/80"
            style={{ background: previewBg }}
          >
            <div className={`relative w-full ${previewAspectClassName}`}>
              {workingSrc && !improving ? (
                <Cropper
                  key={workingSrc.slice(-32)}
                  image={workingSrc}
                  crop={crop}
                  zoom={zoom}
                  minZoom={zoomFloor}
                  maxZoom={MAX_ZOOM}
                  aspect={frameAspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  showGrid
                  objectFit="contain"
                  classes={{
                    containerClassName: 'certificate-crop-container',
                    cropAreaClassName: 'certificate-crop-area',
                  }}
                  style={{
                    containerStyle: { background: previewBg },
                    cropAreaStyle: {
                      border: '3px solid #f08a5d',
                      boxShadow:
                        '0 0 0 2px #1a4d5c, 0 0 0 9999px rgba(28, 40, 51, 0.52)',
                    },
                  }}
                />
              ) : null}
            </div>

            {improving ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 px-6 text-center">
                <div>
                  <p className="text-sm font-medium text-white">{status || 'Improving photo…'}</p>
                  {clearBackground ? (
                    <p className="mt-1 text-[0.7rem] text-white/70">First clear-background run may download the AI model</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor={zoomId} className="text-sm font-medium text-ink">
                Zoom
              </label>
              <span className="text-xs tabular-nums text-ink-muted">{zoom.toFixed(2)}×</span>
            </div>
            <input
              id={zoomId}
              type="range"
              min={zoomFloor}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              disabled={busy}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand disabled:cursor-not-allowed disabled:opacity-60"
            />
            <div className="mt-1.5 flex justify-between text-xs text-ink-muted">
              <span>See more</span>
              <span>Closer</span>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-ink">Improve style</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {IMPROVE_PRESET_LIST.map((option) => {
                const active = improvePreset === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={busy}
                    onClick={() => setImprovePreset(option.id)}
                    className={`rounded-lg border px-2.5 py-2.5 text-left transition-colors disabled:opacity-60 ${
                      active
                        ? 'border-brand bg-brand-muted/50 text-brand'
                        : 'border-slate-200 bg-white text-ink-muted hover:border-brand/25 hover:text-brand'
                    }`}
                  >
                    <span className="block text-sm font-medium">{option.label}</span>
                    <span className={`mt-0.5 block text-[0.7rem] leading-snug ${active ? 'text-brand/80' : 'text-ink-muted'}`}>
                      {option.hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-ink">Strength</p>
            <div className="grid grid-cols-3 gap-2">
              {IMPROVE_STRENGTH_LIST.map((option) => {
                const active = improveStrength === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={busy || strengthDisabled}
                    onClick={() => setImproveStrength(option.id)}
                    className={`rounded-lg border px-2.5 py-2.5 text-center text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      active && !strengthDisabled
                        ? 'border-brand bg-brand-muted/50 text-brand'
                        : 'border-slate-200 bg-white text-ink-muted hover:border-brand/25 hover:text-brand'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-xs text-ink-muted">
              {strengthDisabled
                ? 'Strength is unused for Center only.'
                : `Selected: ${activePreset.label} · ${IMPROVE_STRENGTHS[improveStrength]?.label || 'Normal'}`}
            </p>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-ink">Background</p>
            <div className="grid grid-cols-3 gap-2">
              {backgroundOptions.map((option) => {
                const active = studio === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={busy}
                    onClick={() => setStudio(option.id)}
                    className={`rounded-lg border px-2.5 py-2.5 text-center text-sm font-medium transition-colors disabled:opacity-60 ${
                      active
                        ? 'border-brand bg-brand-muted/50 text-brand'
                        : 'border-slate-200 bg-white text-ink-muted hover:border-brand/25 hover:text-brand'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-xs text-ink-muted">
              {fillMode === 'cover'
                ? 'Improve fills the card edge-to-edge (best for small service cards). White/Black still apply if you clear the background.'
                : 'Keep photo matches the photo’s own background and fills the card so it fits seamlessly.'}
            </p>
          </div>

          <label
            htmlFor={clearBgId}
            className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200/80 bg-surface-alt/50 px-3.5 py-3"
          >
            <input
              id={clearBgId}
              type="checkbox"
              checked={clearBackground}
              onChange={(event) => setClearBackground(event.target.checked)}
              disabled={busy}
              className="mt-0.5 h-4 w-4 accent-brand"
            />
            <span>
              <span className="block text-sm font-medium text-ink">Clear background</span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                Off by default — only turn on if you want a cutout studio look.
              </span>
            </span>
          </label>

          {status && !improving ? <p className="mt-4 text-xs text-brand">{status}</p> : null}
          {error ? <p className="mt-2 text-xs text-accent-hover">{error}</p> : null}
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-slate-200/80 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-brand/20 hover:bg-surface-alt hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImprove}
            disabled={busy}
            className="rounded-xl border border-brand/30 bg-brand-muted/50 px-3 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-brand-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {improving ? 'Improving…' : 'Improve photo'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={busy}
            className="rounded-xl bg-brand px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
