import { useCallback, useRef, useState } from 'react'
import { isMediaStorageAvailable, uploadMediaToStorage } from '../../lib/mediaUpload'
import { isImageFile } from '../../lib/mediaFileTypes'
import { hasMediaSrc } from '../../lib/mediaUrl'
import { isSupabaseConfigured } from '../../lib/supabase'
import { getCertificateDisplayImage } from '../../data/aboutContentStore'
import { DEFAULT_FRAME_SETTINGS, normalizeCertificateImageFrame } from '../../lib/certificateMagicFrame'
import { useConfirmDelete } from './DeleteConfirmDialog'
import CertificateMagicFrameDialog from './CertificateMagicFrameDialog'

const MAX_FILE_SIZE_MB = 12

async function uploadImageFile(file) {
  const canUpload = await isMediaStorageAvailable()

  if (isSupabaseConfigured && !canUpload) {
    throw new Error('Sign in to Supabase before uploading media.')
  }

  if (!canUpload) {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Could not read that file. Try another one.'))
      reader.readAsDataURL(file)
    })
    return { url: dataUrl, localOnly: true }
  }

  const result = await uploadMediaToStorage(file)
  return { url: result.url, localOnly: false }
}

export default function CertificateImageField({
  image = '',
  imageSource = '',
  imageFrame = null,
  onChange,
}) {
  const confirmDelete = useConfirmDelete()
  const inputRef = useRef(null)
  const pendingSourceUrlRef = useRef('')
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [studioSrc, setStudioSrc] = useState('')
  const [studioOpen, setStudioOpen] = useState(false)
  const [studioSessionKey, setStudioSessionKey] = useState(0)
  const [restoreSettings, setRestoreSettings] = useState(false)

  const displaySrc = getCertificateDisplayImage({ image, imageSource })
  const sourceSrc = hasMediaSrc(imageSource) ? imageSource.trim() : hasMediaSrc(image) ? image.trim() : ''
  const savedFrame = normalizeCertificateImageFrame(imageFrame) || { ...DEFAULT_FRAME_SETTINGS }

  const revokeStudioSrc = (src) => {
    if (src?.startsWith('blob:')) URL.revokeObjectURL(src)
  }

  const closeStudio = useCallback(() => {
    setStudioOpen(false)
    setRestoreSettings(false)
    setStudioSrc((current) => {
      revokeStudioSrc(current)
      return ''
    })
    pendingSourceUrlRef.current = ''
  }, [])

  const openStudio = useCallback((src, shouldRestore = false) => {
    if (!src) return
    setError('')
    setRestoreSettings(shouldRestore)
    setStudioSessionKey((key) => key + 1)
    setStudioSrc((current) => {
      if (current && current !== src) revokeStudioSrc(current)
      return src
    })
    setStudioOpen(true)
  }, [])

  const emitChange = useCallback(
    (next) => {
      onChange({
        image: next.image ?? '',
        imageSource: next.imageSource ?? '',
        imageCrop: null,
        imageFrame: next.imageFrame ?? null,
      })
    },
    [onChange],
  )

  const handleFile = async (file) => {
    if (!file) return

    if (!isImageFile(file)) {
      setError('Please choose a supported image file (JPG, PNG, WebP, etc.).')
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`)
      return
    }

    setError('')
    setUploadStatus('')
    setUploading(true)

    const localStudioUrl = URL.createObjectURL(file)

    try {
      const uploaded = await uploadImageFile(file)
      pendingSourceUrlRef.current = uploaded.url
      openStudio(localStudioUrl, false)
      setUploadStatus(
        uploaded.localOnly
          ? 'Original saved locally. Remaster is ready.'
          : 'Original uploaded. Remaster is ready — tweak if you like, then apply.',
      )
    } catch (uploadError) {
      revokeStudioSrc(localStudioUrl)
      setError(uploadError?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleStudioConfirm = useCallback(
    async (framedFile, frameSettings) => {
      const sourceUrl = pendingSourceUrlRef.current || sourceSrc
      setStudioOpen(false)
      setStudioSrc((current) => {
        revokeStudioSrc(current)
        return ''
      })

      if (!sourceUrl) {
        setError('Original image is missing. Replace the image and try again.')
        pendingSourceUrlRef.current = ''
        return
      }

      setUploading(true)
      setError('')
      setUploadStatus('')

      try {
        const uploaded = await uploadImageFile(framedFile)
        emitChange({
          image: uploaded.url,
          imageSource: sourceUrl,
          imageFrame: normalizeCertificateImageFrame(frameSettings),
        })
        setUploadStatus(
          uploaded.localOnly
            ? 'Remaster saved locally. Original kept for re-adjusting.'
            : 'Remaster saved. Original kept for re-adjusting.',
        )
      } catch (uploadError) {
        setError(uploadError?.message || 'Could not save the remastered certificate.')
      } finally {
        pendingSourceUrlRef.current = ''
        setUploading(false)
      }
    },
    [emitChange, sourceSrc],
  )

  const handleAdjustImage = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!sourceSrc || uploading) return
    pendingSourceUrlRef.current = sourceSrc
    openStudio(sourceSrc, true)
  }

  const handleClear = () => {
    setError('')
    setUploadStatus('')
    emitChange({ image: '', imageSource: '', imageFrame: null })
  }

  const onDrop = (dropEvent) => {
    dropEvent.preventDefault()
    setDragging(false)
    void handleFile(dropEvent.dataTransfer.files?.[0])
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(changeEvent) => {
          void handleFile(changeEvent.target.files?.[0])
          changeEvent.target.value = ''
        }}
      />

      {displaySrc ? (
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md bg-slate-900">
            <img
              key={displaySrc}
              src={displaySrc}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
              Remastered
            </span>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-slate-200/80 p-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:border-brand/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : 'Replace'}
            </button>
            <button
              type="button"
              onClick={handleAdjustImage}
              disabled={uploading || !sourceSrc}
              className="rounded-lg border border-brand/30 bg-brand-muted/40 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:border-brand/50 hover:bg-brand-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              Re-open Crop / Remaster
            </button>
            <button
              type="button"
              onClick={() =>
                confirmDelete({
                  title: 'Remove this media?',
                  message: 'The original photo and remastered certificate image will be cleared from this field.',
                  confirmLabel: 'Remove',
                  onConfirm: handleClear,
                })
              }
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-hover uppercase transition-colors hover:border-accent/30"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(dragEvent) => {
            dragEvent.preventDefault()
            setDragging(true)
          }}
          onDragOver={(dragEvent) => {
            dragEvent.preventDefault()
            setDragging(true)
          }}
          onDragLeave={(dragEvent) => {
            dragEvent.preventDefault()
            setDragging(false)
          }}
          onDrop={onDrop}
          className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragging
              ? 'border-brand bg-brand-muted/40'
              : 'border-slate-200 bg-surface-alt/60 hover:border-brand/35 hover:bg-brand-muted/20'
          }`}
        >
          <svg viewBox="0 0 24 24" className="mb-3 h-8 w-8 text-brand/70" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
          </svg>
          <span className="text-sm font-medium text-ink">
            {uploading ? 'Uploading…' : 'Drop any certificate photo'}
          </span>
          <span className="mt-1 max-w-xs text-xs text-ink-muted">
            AI removes the background and rebuilds a clean studio card · max {MAX_FILE_SIZE_MB} MB
          </span>
        </button>
      )}

      {uploadStatus ? <p className="mt-2 text-xs text-brand">{uploadStatus}</p> : null}
      {error ? <p className="mt-2 text-xs text-accent-hover">{error}</p> : null}

      <CertificateMagicFrameDialog
        key={studioSessionKey}
        open={studioOpen}
        imageSrc={studioSrc}
        initialSettings={restoreSettings ? savedFrame : null}
        onCancel={closeStudio}
        onConfirm={handleStudioConfirm}
      />
    </div>
  )
}
