import { useCallback, useRef, useState } from 'react'
import { assertCloudMediaReady, isMediaStorageAvailable, uploadMediaToStorage } from '../../lib/mediaUpload'
import { isImageFile } from '../../lib/mediaFileTypes'
import { hasMediaSrc } from '../../lib/mediaUrl'
import { isSupabaseConfigured } from '../../lib/supabase'
import { getCertificateDisplayImage } from '../../data/aboutContentStore'
import { DEFAULT_FRAME_SETTINGS, FRAME_ASPECT, normalizeCertificateImageFrame } from '../../lib/certificateMagicFrame'
import { useConfirmDelete } from './DeleteConfirmDialog'
import CertificateMagicFrameDialog from './CertificateMagicFrameDialog'

const MAX_FILE_SIZE_MB = 12
const HEIC_OR_HEIF = /\.(heic|heif)$/i

function isHeicFile(file) {
  if (!file) return false
  const type = (file.type || '').toLowerCase()
  if (type === 'image/heic' || type === 'image/heif') return true
  return HEIC_OR_HEIF.test(file.name || '')
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read that file. Try another one.'))
    reader.readAsDataURL(file)
  })
}

/**
 * Upload a certificate image to Supabase when configured.
 * Never falls back to data URLs while Supabase env vars are present.
 */
async function uploadImageFile(file) {
  if (isSupabaseConfigured) {
    await assertCloudMediaReady()
    const result = await uploadMediaToStorage(file)
    return { url: result.url, localOnly: false, path: result.path, bucket: result.bucket }
  }

  const canUpload = await isMediaStorageAvailable()
  if (canUpload) {
    const result = await uploadMediaToStorage(file)
    return { url: result.url, localOnly: false, path: result.path, bucket: result.bucket }
  }

  const dataUrl = await fileToDataUrl(file)
  return { url: dataUrl, localOnly: true, path: '', bucket: '' }
}

export default function CertificateImageField({
  image = '',
  imageSource = '',
  imageFrame = null,
  onChange,
  aspect = FRAME_ASPECT,
  previewAspectClassName = 'aspect-[4/3]',
  title = 'Edit certificate photo',
  hint = 'Pick an Improve style, then fine-tune with drag and zoom.',
  emptyLabel = 'Drop a certificate photo',
  badgeLabel = 'Photo',
  saveHint = 'Save the certificate to keep it.',
  initialZoom = 1,
  minZoom = 0.6,
}) {
  const confirmDelete = useConfirmDelete()
  const inputRef = useRef(null)
  const pendingOriginalFileRef = useRef(null)
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
    pendingOriginalFileRef.current = null
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

  const handleFile = (file) => {
    if (!file) return

    if (!isImageFile(file)) {
      setError('Please choose a supported image file (JPG, PNG, WebP, etc.).')
      return
    }

    if (isHeicFile(file)) {
      setError('HEIC/HEIF photos are not supported here. Export or convert to JPG or PNG, then upload again.')
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`)
      return
    }

    setError('')
    setUploadStatus('Ready to edit — crop, improve, then Save.')
    pendingOriginalFileRef.current = file
    openStudio(URL.createObjectURL(file), false)
  }

  const handleStudioConfirm = useCallback(
    async (framedFile, frameSettings) => {
      const originalFile = pendingOriginalFileRef.current
      const existingSourceUrl = sourceSrc

      setUploading(true)
      setError('')
      setUploadStatus(isSupabaseConfigured ? 'Uploading to Supabase…' : 'Saving image…')

      try {
        if (isSupabaseConfigured) {
          await assertCloudMediaReady()
        }

        let sourceUrl = existingSourceUrl

        if (originalFile) {
          const uploadedOriginal = await uploadImageFile(originalFile)
          sourceUrl = uploadedOriginal.url
        }

        if (!sourceUrl) {
          throw new Error('Original image is missing. Replace the image and try again.')
        }

        const uploadedRemaster = await uploadImageFile(framedFile)

        if (
          isSupabaseConfigured &&
          (uploadedRemaster.localOnly ||
            !String(uploadedRemaster.url).includes('/storage/v1/object/public/media/'))
        ) {
          throw new Error(
            'Image did not upload to the media bucket. Check Settings → Test media upload, then try again.',
          )
        }

        emitChange({
          image: uploadedRemaster.url,
          imageSource: sourceUrl,
          imageFrame: normalizeCertificateImageFrame(frameSettings),
        })

        setUploadStatus(
          uploadedRemaster.localOnly
            ? 'Saved locally. Original kept for re-adjusting.'
            : `Uploaded to Storage bucket media/${uploadedRemaster.path || 'file'}. ${saveHint}`,
        )

        pendingOriginalFileRef.current = null
        setStudioOpen(false)
        setRestoreSettings(false)
        setStudioSrc((current) => {
          revokeStudioSrc(current)
          return ''
        })
      } catch (uploadError) {
        setError(uploadError?.message || 'Could not save the remastered certificate.')
        setUploadStatus('')
        // Re-throw so the dialog stays open and can show the same failure.
        throw uploadError
      } finally {
        setUploading(false)
      }
    },
    [emitChange, sourceSrc, saveHint],
  )

  const handleAdjustImage = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (uploading) return
    // Re-open on the last saved card photo so Improve/crop edits are remembered
    const editSrc = hasMediaSrc(image) ? image.trim() : sourceSrc
    if (!editSrc) return
    pendingOriginalFileRef.current = null
    openStudio(editSrc, true)
  }

  const handleClear = () => {
    setError('')
    setUploadStatus('')
    pendingOriginalFileRef.current = null
    emitChange({ image: '', imageSource: '', imageFrame: null })
  }

  const onDrop = (dropEvent) => {
    dropEvent.preventDefault()
    setDragging(false)
    handleFile(dropEvent.dataTransfer.files?.[0])
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif,image/*"
        className="hidden"
        onChange={(changeEvent) => {
          handleFile(changeEvent.target.files?.[0])
          changeEvent.target.value = ''
        }}
      />

      {displaySrc ? (
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
          <div className={`relative mx-auto w-full max-w-md bg-slate-900 ${previewAspectClassName}`}>
            <img
              key={displaySrc}
              src={displaySrc}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
              {badgeLabel}
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
              disabled={uploading || !(hasMediaSrc(image) || sourceSrc)}
              className="rounded-lg border border-brand/30 bg-brand-muted/40 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:border-brand/50 hover:bg-brand-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              Edit photo
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
            {uploading ? 'Uploading…' : emptyLabel}
          </span>
          <span className="mt-1 max-w-xs text-xs text-ink-muted">
            Adjust crop · Improve photo · Save · max {MAX_FILE_SIZE_MB} MB · JPG/PNG/WebP
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
        aspect={aspect}
        previewAspectClassName={previewAspectClassName}
        title={title}
        hint={hint}
        initialZoom={initialZoom}
        minZoom={minZoom}
        onCancel={closeStudio}
        onConfirm={handleStudioConfirm}
      />
    </div>
  )
}
