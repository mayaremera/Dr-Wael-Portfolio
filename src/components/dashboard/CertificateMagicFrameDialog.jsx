import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import {
  DEFAULT_FRAME_SETTINGS,
  FRAME_ASPECT,
  STUDIO_BACKGROUNDS,
  clearMagicFrameCutoutCache,
  createMagicFrameFile,
  createMagicFramePreviewDataUrl,
  cropToCertificateFrame,
  normalizeCertificateImageFrame,
} from '../../lib/certificateMagicFrame'

const DEFAULT_CROP = { x: 0, y: 0 }
const DEFAULT_CROP_ZOOM = 1
const FULL_FRAME_CROP = { x: 0, y: 0, width: 100, height: 100 }
const SUBJECT_ZOOM_DEBOUNCE_MS = 180

export default function CertificateMagicFrameDialog({
  open,
  imageSrc,
  initialSettings = null,
  onCancel,
  onConfirm,
}) {
  const titleId = useId()
  const subjectZoomId = useId()
  const cropZoomId = useId()
  const subjectZoomTimerRef = useRef(null)
  const previewRequestRef = useRef(0)

  const [settings, setSettings] = useState(() =>
    normalizeCertificateImageFrame(initialSettings) || { ...DEFAULT_FRAME_SETTINGS },
  )
  const [resultUrl, setResultUrl] = useState('')
  const [hasResult, setHasResult] = useState(false)
  const [running, setRunning] = useState(false)
  const [previewUpdating, setPreviewUpdating] = useState(false)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const [crop, setCrop] = useState(DEFAULT_CROP)
  const [cropZoom, setCropZoom] = useState(DEFAULT_CROP_ZOOM)
  const [percentCrop, setPercentCrop] = useState(null)

  const resetCropFrame = useCallback(() => {
    setCrop(DEFAULT_CROP)
    setCropZoom(DEFAULT_CROP_ZOOM)
    setPercentCrop(null)
  }, [])

  useEffect(() => {
    if (!open) {
      clearMagicFrameCutoutCache()
      if (subjectZoomTimerRef.current) window.clearTimeout(subjectZoomTimerRef.current)
      return undefined
    }

    setSettings(normalizeCertificateImageFrame(initialSettings) || { ...DEFAULT_FRAME_SETTINGS })
    setResultUrl('')
    setHasResult(false)
    setRunning(false)
    setPreviewUpdating(false)
    setApplying(false)
    setError('')
    resetCropFrame()
    setStatus(
      'Crop anytime and Apply — or check options and Run Remaster. Subject size updates the preview live after Remaster.',
    )
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prefs loaded once per open/src
  }, [open, imageSrc, resetCropFrame])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        if (!running && !applying && !previewUpdating) onCancel()
      }
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown, true)
    }
  }, [open, onCancel, running, applying, previewUpdating])

  const updateSetting = useCallback(
    (key, value) => {
      setSettings((current) =>
        normalizeCertificateImageFrame({
          ...(current || DEFAULT_FRAME_SETTINGS),
          [key]: value,
        }),
      )
      setHasResult((hadResult) => {
        if (hadResult) resetCropFrame()
        return false
      })
      setResultUrl('')
      setStatus('Remaster options updated. You can still Apply crop-only, or Run Remaster for AI.')
      setError('')
    },
    [resetCropFrame],
  )

  const refreshRemasterPreview = useCallback(
    async (nextSettings) => {
      if (!imageSrc) return
      const requestId = ++previewRequestRef.current
      setPreviewUpdating(true)
      setError('')
      setStatus('Updating subject size in the frame…')

      try {
        const nextPreview = await createMagicFramePreviewDataUrl(imageSrc, nextSettings, 1400)
        if (previewRequestRef.current !== requestId) return
        setResultUrl(nextPreview)
        setHasResult(true)
        resetCropFrame()
        setStatus('Subject size updated — review the frame, then Apply.')
      } catch (previewError) {
        if (previewRequestRef.current !== requestId) return
        setError(previewError?.message || 'Could not update subject size preview.')
      } finally {
        if (previewRequestRef.current === requestId) setPreviewUpdating(false)
      }
    },
    [imageSrc, resetCropFrame],
  )

  const handleSubjectZoomChange = (value) => {
    const nextSettings = normalizeCertificateImageFrame({
      ...(settings || DEFAULT_FRAME_SETTINGS),
      zoom: value,
    })
    setSettings(nextSettings)
    setError('')

    if (!hasResult) {
      setStatus('Subject size saved — Run Remaster to see it in the frame (then the slider updates live).')
      return
    }

    if (subjectZoomTimerRef.current) window.clearTimeout(subjectZoomTimerRef.current)
    subjectZoomTimerRef.current = window.setTimeout(() => {
      void refreshRemasterPreview(nextSettings)
    }, SUBJECT_ZOOM_DEBOUNCE_MS)
  }

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

  const studioOptions = useMemo(() => Object.values(STUDIO_BACKGROUNDS), [])
  const busy = running || applying
  const cropImageSrc = hasResult && resultUrl ? resultUrl : imageSrc
  const showCropper = Boolean(cropImageSrc) && !running
  const previewBg =
    settings.studio === 'white'
      ? '#f8f8fa'
      : settings.studio === 'black'
        ? '#121214'
        : '#1c1c1e'

  const handleRun = async () => {
    if (!imageSrc || busy || previewUpdating) return

    if (subjectZoomTimerRef.current) window.clearTimeout(subjectZoomTimerRef.current)
    setRunning(true)
    setError('')
    setHasResult(false)
    setResultUrl('')
    resetCropFrame()
    setStatus('Starting remaster…')

    try {
      const nextPreview = await createMagicFramePreviewDataUrl(
        imageSrc,
        settings,
        1400,
        (message) => setStatus(message),
      )

      setResultUrl(nextPreview)
      setHasResult(true)
      resetCropFrame()
      setStatus('Remaster ready. Drag subject size to fine-tune live, adjust the 4:3 crop, then Apply.')
    } catch (runError) {
      setError(runError?.message || 'Could not remaster this photo. Try another one.')
      setStatus('Remaster failed. You can still crop the original and Apply.')
      setHasResult(false)
      setResultUrl('')
    } finally {
      setRunning(false)
    }
  }

  const handleApply = async () => {
    if (!imageSrc || busy || previewUpdating) return

    setApplying(true)
    setError('')
    const cropArea = percentCrop || FULL_FRAME_CROP

    try {
      if (hasResult) {
        setStatus('Saving high-quality remaster…')
        const remastered = await createMagicFrameFile(imageSrc, settings, {
          onProgress: (message) => setStatus(message),
        })
        const remasterUrl = URL.createObjectURL(remastered)

        try {
          setStatus('Applying 4:3 certificate crop frame…')
          const file = await cropToCertificateFrame(remasterUrl, cropArea)
          await onConfirm(file, {
            ...settings,
            frameCrop: cropArea,
          })
        } finally {
          URL.revokeObjectURL(remasterUrl)
        }
      } else {
        setStatus('Saving 4:3 crop…')
        const file = await cropToCertificateFrame(imageSrc, cropArea)
        await onConfirm(file, {
          ...settings,
          frameCrop: cropArea,
        })
      }
    } catch (applyError) {
      setError(applyError?.message || 'Could not save the certificate image.')
      setStatus(
        hasResult
          ? 'Adjust the 4:3 crop, then Apply — or Run Remaster again.'
          : 'Adjust the 4:3 crop on the original, then Apply — or Run Remaster for AI.',
      )
      setApplying(false)
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
          if (!busy && !previewUpdating) onCancel()
        }}
      />

      <div
        className="relative z-10 flex max-h-[min(94vh,54rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_48px_-12px_rgba(28,40,51,0.28)]"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="h-0.5 shrink-0 bg-brand" aria-hidden="true" />

        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-brand uppercase">Certificate frame</p>
            <h2 id={titleId} className="mt-1 font-serif text-2xl leading-tight text-ink">
              Crop only, or remaster + crop
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Checkboxes stay off until you enable them. For tall awards, turn on Make more horizontal, Run Remaster,
              then use Subject size live in the frame.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!busy && !previewUpdating) onCancel()
            }}
            aria-label="Close"
            disabled={busy || previewUpdating}
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
            <div className="relative aspect-[4/3] w-full">
              {showCropper ? (
                <Cropper
                  key={hasResult ? `remastered-${resultUrl.slice(-24)}` : 'original'}
                  image={cropImageSrc}
                  crop={crop}
                  zoom={cropZoom}
                  aspect={FRAME_ASPECT}
                  onCropChange={setCrop}
                  onZoomChange={setCropZoom}
                  onCropComplete={onCropComplete}
                  showGrid
                  objectFit="contain"
                  style={{
                    containerStyle: { background: previewBg },
                    cropAreaStyle: {
                      border: '2px solid rgba(255,255,255,0.95)',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                    },
                  }}
                />
              ) : null}

              {!running ? (
                <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-brand/90 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
                  {hasResult ? '4:3 on remaster · drag to frame' : '4:3 crop · drag to frame'}
                </span>
              ) : null}
            </div>

            {running || previewUpdating ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 px-6 text-center">
                <div>
                  <p className="text-sm font-medium text-white">
                    {previewUpdating ? 'Updating subject size…' : status || 'Running remaster…'}
                  </p>
                  {!previewUpdating ? (
                    <p className="mt-1 text-[0.7rem] text-white/70">First run may download the AI model</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200/80 bg-surface-alt/50 px-3.5 py-3">
              <input
                type="checkbox"
                checked={settings.removeBg}
                onChange={(event) => updateSetting('removeBg', event.target.checked)}
                disabled={busy || previewUpdating}
                className="mt-0.5 h-4 w-4 accent-brand"
              />
              <span>
                <span className="block text-sm font-medium text-ink">AI remove background</span>
                <span className="mt-0.5 block text-xs text-ink-muted">
                  Off by default — enable only if you want AI cutout on Run Remaster.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200/80 bg-surface-alt/50 px-3.5 py-3">
              <input
                type="checkbox"
                checked={settings.horizontalFit}
                onChange={(event) => updateSetting('horizontalFit', event.target.checked)}
                disabled={busy || previewUpdating}
                className="mt-0.5 h-4 w-4 accent-brand"
              />
              <span>
                <span className="block text-sm font-medium text-ink">Make more horizontal</span>
                <span className="mt-0.5 block text-xs text-ink-muted">
                  Off by default — enable for tall certificates so the full award fits in the wide card.
                </span>
              </span>
            </label>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">Studio background</p>
            <div className="grid grid-cols-3 gap-2">
              {studioOptions.map((option) => {
                const active = settings.studio === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={busy || previewUpdating}
                    onClick={() => updateSetting('studio', option.id)}
                    className={`rounded-lg border px-2.5 py-2 text-left transition-colors disabled:opacity-60 ${
                      active
                        ? 'border-brand bg-brand-muted/50 text-brand'
                        : 'border-slate-200 bg-white text-ink-muted hover:border-brand/25 hover:text-brand'
                    }`}
                  >
                    <span className="block text-xs font-semibold">{option.label}</span>
                    <span className="mt-0.5 block text-[0.65rem] leading-snug opacity-80">{option.hint}</span>
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-[0.65rem] tracking-wide text-ink-muted/80 uppercase">
              Studio options apply on Run Remaster
            </p>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor={subjectZoomId} className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
                  Subject size
                </label>
                <span className="text-xs tabular-nums text-ink-muted">{settings.zoom.toFixed(2)}×</span>
              </div>
              <input
                id={subjectZoomId}
                type="range"
                min={0.45}
                max={1.55}
                step={0.01}
                value={settings.zoom}
                onChange={(event) => handleSubjectZoomChange(Number(event.target.value))}
                disabled={busy || previewUpdating}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand disabled:cursor-not-allowed disabled:opacity-60"
              />
              <p className="mt-1 text-[0.65rem] tracking-wide text-ink-muted/80 uppercase">
                {hasResult
                  ? 'Live — how big the certificate sits inside the remastered card'
                  : 'Run Remaster first, then this slider updates the frame live'}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor={cropZoomId} className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
                  Crop zoom
                </label>
                <span className="text-xs tabular-nums text-ink-muted">{cropZoom.toFixed(2)}×</span>
              </div>
              <input
                id={cropZoomId}
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={cropZoom}
                onChange={(event) => setCropZoom(Number(event.target.value))}
                disabled={busy || previewUpdating}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand disabled:cursor-not-allowed disabled:opacity-60"
              />
              <div className="mt-1.5 flex justify-between text-[0.65rem] tracking-wide text-ink-muted/80 uppercase">
                <span>See more of the photo</span>
                <span>Zoom into the 4:3 frame</span>
              </div>
            </div>
          </div>

          {status ? <p className="mt-4 text-xs text-brand">{status}</p> : null}
          {error ? <p className="mt-2 text-xs text-accent-hover">{error}</p> : null}
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-slate-200/80 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy || previewUpdating}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/20 hover:bg-surface-alt hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={busy || previewUpdating}
            className="rounded-xl border border-brand/30 bg-brand-muted/50 px-3 py-2.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:bg-brand-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? 'Running…' : 'Run Remaster'}
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={busy || previewUpdating}
            className="rounded-xl bg-brand px-3 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {applying ? 'Saving…' : hasResult ? 'Apply' : 'Apply crop'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
