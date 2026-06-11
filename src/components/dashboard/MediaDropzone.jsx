import { useRef, useState } from 'react'
import { isMediaStorageAvailable, uploadMediaToStorage } from '../../lib/mediaUpload'

const MAX_FILE_SIZE_MB = 12

export default function MediaDropzone({ image, video, onChange, onClear }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const mediaSrc = video || image
  const isVideo = Boolean(video)

  const handleFile = (file) => {
    if (!file) return

    const isImage = file.type.startsWith('image/')
    const isVideoFile = file.type.startsWith('video/')

    if (!isImage && !isVideoFile) {
      setError('Please drop an image or video file.')
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`)
      return
    }

    setError('')
    setUploading(true)

    const applyLocalFallback = () => {
      const reader = new FileReader()
      reader.onload = () => {
        onChange({
          image: isImage ? reader.result : '',
          video: isVideoFile ? reader.result : '',
        })
        setUploading(false)
      }
      reader.onerror = () => {
        setError('Could not read that file. Try another one.')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    }

    isMediaStorageAvailable()
      .then((canUpload) => {
        if (!canUpload) {
          applyLocalFallback()
          return
        }

        return uploadMediaToStorage(file)
          .then((result) => {
            onChange({
              image: result.isVideo ? '' : result.url,
              video: result.isVideo ? result.url : '',
            })
            setUploading(false)
          })
          .catch((uploadError) => {
            setError(uploadError?.message || 'Upload failed. Saved locally instead.')
            applyLocalFallback()
          })
      })
      .catch(() => applyLocalFallback())
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
        accept="image/*,video/*"
        className="hidden"
        onChange={(changeEvent) => handleFile(changeEvent.target.files?.[0])}
      />

      {mediaSrc ? (
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
          <div className="relative aspect-video w-full bg-slate-900">
            {isVideo ? (
              <video src={video} className="h-full w-full object-cover" muted playsInline controls />
            ) : (
              <img src={image} alt="" className="h-full w-full object-cover" />
            )}
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
              {isVideo ? 'Video' : 'Image'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-slate-200/80 p-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:border-brand/25"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                setError('')
                onClear()
              }}
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
            {uploading ? 'Uploading…' : 'Drag & drop image or video'}
          </span>
          <span className="mt-1 text-xs text-ink-muted">or click to browse · max {MAX_FILE_SIZE_MB} MB</span>
        </button>
      )}

      {error ? <p className="mt-2 text-xs text-accent-hover">{error}</p> : null}
    </div>
  )
}
