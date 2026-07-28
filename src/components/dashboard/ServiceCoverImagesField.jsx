import { useCallback, useRef, useState } from 'react'
import { assertCloudMediaReady, isMediaStorageAvailable, uploadMediaToStorage } from '../../lib/mediaUpload'
import { isImageFile } from '../../lib/mediaFileTypes'
import { hasMediaSrc } from '../../lib/mediaUrl'
import { isSupabaseConfigured } from '../../lib/supabase'
import {
  DEFAULT_FRAME_SETTINGS,
  SERVICE_HOME_ASPECT,
  SERVICE_PAGE_ASPECT,
  normalizeCertificateImageFrame,
} from '../../lib/certificateMagicFrame'
import { useConfirmDelete } from './DeleteConfirmDialog'
import CertificateMagicFrameDialog from './CertificateMagicFrameDialog'

const MAX_FILE_SIZE_MB = 12
const HEIC_OR_HEIF = /\.(heic|heif)$/i

const SLOTS = {
  page: {
    id: 'page',
    aspect: SERVICE_PAGE_ASPECT,
    previewAspectClassName: 'aspect-[5/4]',
    title: 'Edit services page photo',
    hint: 'Frame for /services cards (5:4). Improve fills the card — no empty bars.',
    badgeLabel: 'Services page',
    label: 'Services page card',
    ratioLabel: '5:4',
    description: 'Used on /services detail cards.',
    initialZoom: 1.1,
    minZoom: 0.7,
  },
  home: {
    id: 'home',
    aspect: SERVICE_HOME_ASPECT,
    previewAspectClassName: 'aspect-square',
    title: 'Edit homepage service photo',
    hint: 'Frame for the homepage side image (1:1). Improve fills the card — no empty bars.',
    badgeLabel: 'Homepage',
    label: 'Homepage service card',
    ratioLabel: '1:1',
    description: 'Used in the homepage services section (square side image).',
    initialZoom: 1.15,
    minZoom: 0.75,
  },
}

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

function SlotPreview({
  src,
  slot,
  uploading,
  canEdit,
  onEdit,
  onClear,
}) {
  const confirmDelete = useConfirmDelete()

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
      <div className={`relative w-full bg-slate-900 ${slot.previewAspectClassName}`}>
        {hasMediaSrc(src) ? (
          <img
            key={src}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-alt/80 px-4 text-center">
            <p className="text-xs text-ink-muted">Not framed yet — click Edit to crop for this card</p>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
          {slot.badgeLabel}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-slate-200/80 p-3">
        <button
          type="button"
          onClick={onEdit}
          disabled={uploading || !canEdit}
          className="rounded-lg border border-brand/30 bg-brand-muted/40 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:border-brand/50 hover:bg-brand-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          Edit photo
        </button>
        {hasMediaSrc(src) ? (
          <button
            type="button"
            onClick={() =>
              confirmDelete({
                title: `Clear ${slot.label}?`,
                message: 'Only this framed card image is cleared. The shared original stays so you can frame again.',
                confirmLabel: 'Clear',
                onConfirm: onClear,
              })
            }
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-hover uppercase transition-colors hover:border-accent/30"
          >
            Clear frame
          </button>
        ) : null}
      </div>
    </div>
  )
}

/**
 * One shared original + two independent magic-frame edits (services page 5:4, homepage 3:4).
 */
export default function ServiceCoverImagesField({
  image = '',
  imageSource = '',
  imageFrame = null,
  homepageImage = '',
  homepageImageFrame = null,
  onChange,
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
  const [activeSlot, setActiveSlot] = useState('page')

  const sourceSrc = hasMediaSrc(imageSource)
    ? imageSource.trim()
    : hasMediaSrc(image)
      ? image.trim()
      : hasMediaSrc(homepageImage)
        ? homepageImage.trim()
        : ''

  const pageFrame = normalizeCertificateImageFrame(imageFrame) || { ...DEFAULT_FRAME_SETTINGS }
  const homeFrame = normalizeCertificateImageFrame(homepageImageFrame) || { ...DEFAULT_FRAME_SETTINGS }
  const slotConfig = SLOTS[activeSlot] || SLOTS.page
  const activeSavedFrame = activeSlot === 'home' ? homeFrame : pageFrame

  const revokeStudioSrc = (src) => {
    if (src?.startsWith('blob:')) URL.revokeObjectURL(src)
  }

  const emitChange = useCallback(
    (next) => {
      onChange({
        image: next.image ?? image,
        imageSource: next.imageSource ?? imageSource,
        imageFrame: next.imageFrame !== undefined ? next.imageFrame : imageFrame,
        homepageImage: next.homepageImage ?? homepageImage,
        homepageImageFrame:
          next.homepageImageFrame !== undefined ? next.homepageImageFrame : homepageImageFrame,
      })
    },
    [onChange, image, imageSource, imageFrame, homepageImage, homepageImageFrame],
  )

  const closeStudio = useCallback(() => {
    setStudioOpen(false)
    setRestoreSettings(false)
    setStudioSrc((current) => {
      revokeStudioSrc(current)
      return ''
    })
    pendingOriginalFileRef.current = null
  }, [])

  const openStudio = useCallback((src, slotId, shouldRestore = false) => {
    if (!src) return
    setError('')
    setActiveSlot(slotId)
    setRestoreSettings(shouldRestore)
    setStudioSessionKey((key) => key + 1)
    setStudioSrc((current) => {
      if (current && current !== src) revokeStudioSrc(current)
      return src
    })
    setStudioOpen(true)
  }, [])

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
    setUploadStatus('Upload once — frame separately for each card. Opening services page studio…')
    pendingOriginalFileRef.current = file
    openStudio(URL.createObjectURL(file), 'page', false)
  }

  const handleStudioConfirm = useCallback(
    async (framedFile, frameSettings) => {
      const originalFile = pendingOriginalFileRef.current
      const existingSourceUrl = sourceSrc
      const slot = SLOTS[activeSlot] || SLOTS.page
      const isNewOriginal = Boolean(originalFile)

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
          throw new Error('Original image is missing. Upload a photo first, then try again.')
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

        const normalizedFrame = normalizeCertificateImageFrame(frameSettings)

        // New original replaces both framed cards — only this slot is filled on first save.
        if (isNewOriginal) {
          if (slot.id === 'home') {
            emitChange({
              imageSource: sourceUrl,
              image: '',
              imageFrame: null,
              homepageImage: uploadedRemaster.url,
              homepageImageFrame: normalizedFrame,
            })
          } else {
            emitChange({
              imageSource: sourceUrl,
              image: uploadedRemaster.url,
              imageFrame: normalizedFrame,
              homepageImage: '',
              homepageImageFrame: null,
            })
          }
        } else if (slot.id === 'home') {
          emitChange({
            imageSource: sourceUrl,
            homepageImage: uploadedRemaster.url,
            homepageImageFrame: normalizedFrame,
          })
        } else {
          emitChange({
            imageSource: sourceUrl,
            image: uploadedRemaster.url,
            imageFrame: normalizedFrame,
          })
        }

        setUploadStatus(
          uploadedRemaster.localOnly
            ? `Saved ${slot.label} locally. Frame the other card when ready.`
            : `${slot.label} uploaded. Save the service to keep it. You can still Edit the other card.`,
        )

        pendingOriginalFileRef.current = null
        setStudioOpen(false)
        setRestoreSettings(false)
        setStudioSrc((current) => {
          revokeStudioSrc(current)
          return ''
        })
      } catch (uploadError) {
        setError(uploadError?.message || 'Could not save the framed service photo.')
        setUploadStatus('')
        throw uploadError
      } finally {
        setUploading(false)
      }
    },
    [activeSlot, emitChange, sourceSrc],
  )

  const handleEditSlot = (slotId) => {
    if (uploading) return
    const slot = SLOTS[slotId]
    const framed =
      slotId === 'home'
        ? hasMediaSrc(homepageImage)
          ? homepageImage.trim()
          : ''
        : hasMediaSrc(image)
          ? image.trim()
          : ''
    // Remember last framed result for that slot; otherwise start from shared original.
    const editSrc = framed || sourceSrc
    if (!editSrc) {
      setError('Upload a photo first, then frame each card.')
      return
    }
    pendingOriginalFileRef.current = null
    openStudio(editSrc, slotId, Boolean(framed))
  }

  const handleClearSlot = (slotId) => {
    setError('')
    setUploadStatus('')
    if (slotId === 'home') {
      emitChange({ homepageImage: '', homepageImageFrame: null })
    } else {
      emitChange({ image: '', imageFrame: null })
    }
  }

  const handleClearAll = () => {
    setError('')
    setUploadStatus('')
    pendingOriginalFileRef.current = null
    emitChange({
      image: '',
      imageSource: '',
      imageFrame: null,
      homepageImage: '',
      homepageImageFrame: null,
    })
  }

  const onDrop = (dropEvent) => {
    dropEvent.preventDefault()
    setDragging(false)
    handleFile(dropEvent.dataTransfer.files?.[0])
  }

  const hasAnyMedia = Boolean(sourceSrc || hasMediaSrc(image) || hasMediaSrc(homepageImage))

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

      {!hasAnyMedia ? (
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
            {uploading ? 'Uploading…' : 'Upload once, then frame for each place'}
          </span>
          <span className="mt-1 max-w-sm text-xs text-ink-muted">
            Same photo · separate crops for Services page (5:4) and Homepage (1:1) · max {MAX_FILE_SIZE_MB} MB
          </span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:border-brand/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : 'Replace original'}
            </button>
            <button
              type="button"
              onClick={() =>
                confirmDelete({
                  title: 'Remove all service photos?',
                  message: 'Clears the shared original and both framed card images.',
                  confirmLabel: 'Remove all',
                  onConfirm: handleClearAll,
                })
              }
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-hover uppercase transition-colors hover:border-accent/30"
            >
              Remove all
            </button>
            <span className="text-[0.7rem] text-ink-muted">
              One original · edit each card separately
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1.5 text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                {SLOTS.page.label} ({SLOTS.page.ratioLabel})
              </p>
              <p className="mb-2 text-[0.65rem] text-ink-muted">{SLOTS.page.description}</p>
              <SlotPreview
                src={image}
                slot={SLOTS.page}
                uploading={uploading}
                canEdit={Boolean(sourceSrc || hasMediaSrc(image))}
                onEdit={() => handleEditSlot('page')}
                onClear={() => handleClearSlot('page')}
              />
            </div>
            <div>
              <p className="mb-1.5 text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                {SLOTS.home.label} ({SLOTS.home.ratioLabel})
              </p>
              <p className="mb-2 text-[0.65rem] text-ink-muted">{SLOTS.home.description}</p>
              <SlotPreview
                src={homepageImage}
                slot={SLOTS.home}
                uploading={uploading}
                canEdit={Boolean(sourceSrc || hasMediaSrc(homepageImage))}
                onEdit={() => handleEditSlot('home')}
                onClear={() => handleClearSlot('home')}
              />
            </div>
          </div>
        </div>
      )}

      {uploadStatus ? <p className="mt-2 text-xs text-brand">{uploadStatus}</p> : null}
      {error ? <p className="mt-2 text-xs text-accent-hover">{error}</p> : null}

      <CertificateMagicFrameDialog
        key={`${studioSessionKey}-${slotConfig.id}`}
        open={studioOpen}
        imageSrc={studioSrc}
        initialSettings={restoreSettings ? activeSavedFrame : null}
        aspect={slotConfig.aspect}
        previewAspectClassName={slotConfig.previewAspectClassName}
        title={slotConfig.title}
        hint={slotConfig.hint}
        initialZoom={slotConfig.initialZoom}
        minZoom={slotConfig.minZoom}
        fillMode="cover"
        onCancel={closeStudio}
        onConfirm={handleStudioConfirm}
      />
    </div>
  )
}
