import { useCallback, useEffect, useRef, useState } from 'react'
import { useGalleryContent } from '../hooks/useGalleryContent'

const imageAspects = ['aspect-[4/5]', 'aspect-square', 'aspect-[5/4]', 'aspect-[3/4]']

const soundWaveHeights = [5, 8, 6, 10, 7, 9, 5, 8, 6, 11, 7, 9, 5, 8, 6, 10, 7, 8, 5, 9, 6, 7, 5, 8]

const protectedMediaProps = {
  draggable: false,
  onContextMenu: (event) => event.preventDefault(),
  onDragStart: (event) => event.preventDefault(),
}

function VideoSoundWaves() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center gap-[5px] bg-gradient-to-t from-black/15 via-black/5 to-transparent px-3 pb-0.5 pt-8"
      aria-hidden="true"
    >
      {soundWaveHeights.map((height, index) => (
        <span
          key={index}
          className="animate-event-sound-wave w-[2px] rounded-full bg-white/40"
          style={{
            height: `${height}px`,
            animationDelay: `${index * 70}ms`,
            animationDuration: `${0.95 + (index % 4) * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}

function GalleryModal({ item, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-label="Close preview"
      />

      <div className="relative z-10 flex max-h-[90vh] max-w-5xl flex-col items-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          Close
        </button>

        <div className="overflow-hidden rounded-xl bg-white p-1 shadow-2xl">
          <img
            src={encodeURI(item.src)}
            alt={item.alt}
            className="max-h-[calc(90vh-3rem)] w-auto max-w-[min(90vw,64rem)] select-none object-contain"
            {...protectedMediaProps}
          />
        </div>
      </div>
    </div>
  )
}

function GalleryTile({ item, aspectClass, onImageClick }) {
  const videoRef = useRef(null)
  const isVideo = item.type === 'video'

  useEffect(() => {
    if (!isVideo) return undefined
    const video = videoRef.current
    if (!video) return undefined

    const playVideo = () => {
      video.play().catch(() => {})
    }

    playVideo()
    video.addEventListener('loadeddata', playVideo)

    return () => video.removeEventListener('loadeddata', playVideo)
  }, [isVideo, item.src])

  const tileClassName = `group relative w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/70 transition-shadow duration-300 hover:shadow-md ${aspectClass}`

  if (isVideo) {
    return (
      <figure className={tileClassName}>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03] select-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={item.alt}
          controlsList="nodownload"
          {...protectedMediaProps}
        >
          <source src={encodeURI(item.src)} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <VideoSoundWaves />
      </figure>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onImageClick(item)}
      className={`${tileClassName} block w-full cursor-zoom-in text-left`}
      aria-label={`View ${item.alt}`}
    >
      <img
        src={encodeURI(item.src)}
        alt={item.alt}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04] select-none"
        loading="lazy"
        {...protectedMediaProps}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
    </button>
  )
}

export default function GalleryGrid() {
  const { mediaGallery } = useGalleryContent()
  const { label, title, items } = mediaGallery
  const [activeImage, setActiveImage] = useState(null)
  let imageIndex = 0
  let videoIndex = 0

  const closeModal = useCallback(() => setActiveImage(null), [])

  return (
    <section id="gallery" className="border-t border-slate-200 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{label}</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{title}</h2>
        </header>

        <div className="mt-10 columns-2 gap-3 sm:columns-3 md:columns-4 lg:columns-5 [column-gap:0.75rem] sm:[column-gap:1rem]">
          {items.map((item) => {
            const aspectClass =
              item.type === 'video'
                ? videoIndex++ === 0
                  ? 'aspect-[3/5]'
                  : 'aspect-video'
                : imageAspects[imageIndex++ % imageAspects.length]

            return (
              <div key={item.src} className="mb-3 break-inside-avoid sm:mb-4">
                <GalleryTile
                  item={item}
                  aspectClass={aspectClass}
                  onImageClick={setActiveImage}
                />
              </div>
            )
          })}
        </div>
      </div>

      {activeImage ? <GalleryModal item={activeImage} onClose={closeModal} /> : null}
    </section>
  )
}
