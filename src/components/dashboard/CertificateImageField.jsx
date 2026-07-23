import { useCallback, useRef, useState } from 'react'
import { isMediaStorageAvailable, uploadMediaToStorage } from '../../lib/mediaUpload'
import { isImageFile } from '../../lib/mediaFileTypes'
import { hasMediaSrc } from '../../lib/mediaUrl'
import { isSupabaseConfigured } from '../../lib/supabase'
import { getCertificateDisplayImage } from '../../data/aboutContentStore'
import { useConfirmDelete } from './DeleteConfirmDialog'
import ImageCropDialog from './ImageCropDialog'

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
  imageCrop = null,
  onChange,
}) {
  const confirmDelete = useConfirmDelete()
  const inputRef = useRef(null)
  const pendingSourceUrlRef = useRef('')
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [cropSrc, setCropSrc] = useState('')
  const [cropOpen, setCropOpen] = useState(false)
  const [cropSessionKey, setCropSessionKey] = useState(0)
  const [restoreCrop, setRestoreCrop] = useState(false)

  const displaySrc = getCertificateDisplayImage({ image, imageSource })
  const sourceSrc = hasMediaSrc(imageSource) ? imageSource.trim() : hasMediaSrc(image) ? image.trim() : ''

  const revokeCropSrc = (src) => {
    if (src?.startsWith('blob:')) URL.revokeObjectURL(src)
  }

  const closeCrop = useCallback(() => {
    setCropOpen(false)
    setRestoreCrop(false)
    setCropSrc((current) => {
      revokeCropSrc(current)
      return ''
    })
    pendingSourceUrlRef.current = ''
  }, [])

  const openCrop = useCallback((src, shouldRestoreCrop = false) => {
    if (!src) return
    setError('')
    setRestoreCrop(shouldRestoreCrop)
    setCropSessionKey((key) => key + 1)
    setCropSrc((current) => {
      if (current && current !== src) revokeCropSrc(current)
      return src
    })
    setCropOpen(true)
  }, [])

  const emitChange = useCallback(
    (next) => {
      onChange({
        image: next.image ?? '',
        imageSource: next.imageSource ?? '',
        imageCrop: next.imageCrop ?? null,
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

    const localCropUrl = URL.createObjectURL(file)

    try {
      const uploaded = await uploadImageFile(file)
      pendingSourceUrlRef.current = uploaded.url
      openCrop(localCropUrl, false)
      setUploadStatus(uploaded.localOnly ? 'Original saved locally.' : 'Original uploaded. Adjust the crop, then apply.')
    } catch (uploadError) {
      revokeCropSrc(localCropUrl)
      setError(uploadError?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleCropConfirm = useCallback(
    async (croppedFile, percentCrop) => {
      const sourceUrl = pendingSourceUrlRef.current || sourceSrc
      setCropOpen(false)
      setCropSrc((current) => {
        revokeCropSrc(current)
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
        const uploaded = await uploadImageFile(croppedFile)
        emitChange({
          image: uploaded.url,
          imageSource: sourceUrl,
          imageCrop: percentCrop,
        })
        setUploadStatus(
          uploaded.localOnly
            ? 'Crop saved locally. Original kept for re-adjusting.'
            : 'Crop saved. Original kept for re-adjusting.',
        )
      } catch (uploadError) {
        setError(uploadError?.message || 'Could not save the cropped image.')
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
    openCrop(sourceSrc, true)
  }

  const handleClear = () => {
    setError('')
    setUploadStatus('')
    emitChange({ image: '', imageSource: '', imageCrop: null })
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
          <div className="relative mx-auto aspect-4/3 w-full max-w-md bg-surface-alt">
            <img
              key={displaySrc}
              src={displaySrc}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain"
            />
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
              Image
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
              Adjust fit
            </button>
            <button
              type="button"
              onClick={() =>
                confirmDelete({
                  title: 'Remove this media?',
                  message: 'The original and cropped certificate images will be cleared from this field.',
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
            {uploading ? 'Uploading…' : 'Drag & drop certificate image'}
          </span>
          <span className="mt-1 text-xs text-ink-muted">
            or click to browse · free crop · max {MAX_FILE_SIZE_MB} MB
          </span>
        </button>
      )}

      {uploadStatus ? <p className="mt-2 text-xs text-brand">{uploadStatus}</p> : null}
      {error ? <p className="mt-2 text-xs text-accent-hover">{error}</p> : null}

      <ImageCropDialog
        key={cropSessionKey}
        open={cropOpen}
        imageSrc={cropSrc}
        aspect={null}
        initialCrop={restoreCrop ? imageCrop : null}
        title="Crop certificate"
        hint="Crop freely to the certificate edges · mosaic tiles keep each image’s true shape · original is kept for re-adjusting."
        onCancel={closeCrop}
        onConfirm={handleCropConfirm}
      />
    </div>
  )
}
