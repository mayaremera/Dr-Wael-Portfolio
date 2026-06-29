import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGalleryContent } from '../hooks/useGalleryContent'
import { parseYoutubeId } from '../data/galleryContentStore'
import { blockMediaContext, protectedMediaProps, protectedShellProps, protectedVideoProps } from '../lib/mediaProtection'

function getItemDescription(item) {
  return item.description?.trim() || ''
}

function PlayIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 7.5v9l7.5-4.5L9 7.5z" />
    </svg>
  )
}

function MomentVideoModal({ item, onClose }) {
  const youtubeId = item.type === 'youtube' ? parseYoutubeId(item.youtubeId || '') : ''
  const isYoutube = Boolean(youtubeId)
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&autoplay=1&modestbranding=1&iv_load_policy=3`

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
      aria-label={item.title}
      onContextMenu={blockMediaContext}
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close video"
      />

      <div className="relative z-10 w-full max-w-4xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 rounded-full p-2 text-white/90 transition-colors hover:text-white sm:-top-12"
          aria-label="Close"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div
          {...protectedShellProps}
          className={`${protectedShellProps.className} relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl`}
        >
          {isYoutube ? (
            <iframe
              src={embedUrl}
              title={item.title}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : item.videoSrc ? (
            <video
              src={item.videoSrc}
              className="h-full w-full object-contain"
              controls
              autoPlay
              playsInline
              preload="metadata"
              {...protectedVideoProps}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

function VideoCard({ item, onPlay }) {
  const description = getItemDescription(item)

  return (
    <article className="group h-full">
      <button
        type="button"
        onClick={onPlay}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white text-left shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:border-brand/25 hover:shadow-md hover:ring-brand/20 lg:rounded-2xl"
        aria-label={`Play ${item.title}`}
        onContextMenu={blockMediaContext}
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 lg:aspect-[16/10]">
          {item.poster ? (
            <img
              src={item.poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              {...protectedMediaProps}
            />
          ) : (
            <div className="absolute inset-0 bg-brand-muted" />
          )}

          <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
              <PlayIcon className="ml-0.5 h-5 w-5 sm:h-6 sm:w-6" />
            </span>
          </span>
        </div>

        <div className="flex flex-1 flex-col p-3.5 sm:p-5">
          {item.subtitle ? (
            <p className="text-[0.62rem] font-semibold tracking-[0.14em] text-brand uppercase lg:text-[0.65rem] lg:tracking-[0.16em]">
              {item.subtitle}
            </p>
          ) : null}
          <h3 className={`font-serif text-base leading-snug text-ink lg:text-lg lg:sm:text-xl ${item.subtitle ? 'mt-1 lg:mt-1.5' : ''}`}>
            {item.title}
          </h3>
          {description ? (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-muted lg:mt-2 lg:text-sm">
              {description}
            </p>
          ) : null}
        </div>
      </button>
    </article>
  )
}

export default function VideoLibrarySection({ tone = 'alt' }) {
  const { isReady, videoLibrary } = useGalleryContent()
  const [activeItem, setActiveItem] = useState(null)

  const items = videoLibrary?.items ?? []

  const playableItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (item.type === 'youtube' && parseYoutubeId(item.youtubeId)) ||
          (item.type === 'file' && item.videoSrc),
      ),
    [items],
  )

  const closeModal = useCallback(() => setActiveItem(null), [])

  if (!isReady || !videoLibrary) return null

  const { label, title, description } = videoLibrary

  if (playableItems.length === 0) return null

  return (
    <section
      id="video-library"
      className={`border-t border-slate-200 py-12 select-none lg:py-28 ${tone === 'white' ? 'bg-white' : 'bg-surface-alt'}`}
      onContextMenu={blockMediaContext}
      onCopy={(event) => event.preventDefault()}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{label}</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-4 text-sm leading-relaxed text-ink-muted md:text-base">{description}</p>
          ) : null}
        </header>

        <div className="mt-8 mobile-card-scroll mobile-card-scroll--gap-lg lg:mt-14 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
          {playableItems.map((item) => (
            <div key={item.id} className="mobile-card-scroll__item mobile-card-scroll__item--wide h-full lg:w-auto">
              <VideoCard item={item} onPlay={() => setActiveItem(item)} />
            </div>
          ))}
        </div>
      </div>

      {activeItem ? <MomentVideoModal item={activeItem} onClose={closeModal} /> : null}
    </section>
  )
}
