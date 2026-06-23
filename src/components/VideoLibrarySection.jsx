import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGalleryContent } from '../hooks/useGalleryContent'
import { parseYoutubeId } from '../data/galleryContentStore'
import { blockMediaContext, protectedMediaProps, protectedShellProps, protectedVideoProps } from '../lib/mediaProtection'

function getItemDescription(item) {
  return item.description?.trim() || item.subtitle?.trim() || ''
}

function MomentVideoModal({ item, onClose }) {
  const youtubeId = item.type === 'youtube' ? parseYoutubeId(item.youtubeId || '') : ''
  const isYoutube = Boolean(youtubeId)
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&autoplay=1&modestbranding=1&iv_load_policy=3`
  const description = getItemDescription(item)

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="moment-video-title"
      onContextMenu={blockMediaContext}
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand/90 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close video"
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col gap-4">
        <button
          type="button"
          onClick={onClose}
          className="self-end rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          Close
        </button>

        <div className="overflow-hidden rounded-sm bg-white shadow-2xl shadow-brand/20 ring-1 ring-white/20">
          <div
            {...protectedShellProps}
            className={`${protectedShellProps.className} relative aspect-video w-full bg-slate-900`}
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

          <div className="border-t border-slate-100 px-5 py-5 sm:px-6 sm:py-6">
            {item.subtitle ? (
              <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">{item.subtitle}</p>
            ) : null}
            <h3 id="moment-video-title" className="mt-1 font-serif text-2xl leading-tight text-ink sm:text-[1.65rem]">
              {item.title}
            </h3>
            {description ? (
              <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">{description}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function MomentCard({ item, onPlay }) {
  const description = getItemDescription(item)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-brand/25 hover:shadow-lg hover:shadow-brand/10">
      <button
        type="button"
        onClick={onPlay}
        className="relative aspect-video w-full overflow-hidden bg-slate-900 text-left"
        aria-label={`Play ${item.title}`}
        onContextMenu={blockMediaContext}
      >
        {item.poster ? (
          <img
            src={item.poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            {...protectedMediaProps}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-light to-slate-900" />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand/55 via-brand/10 to-transparent transition-opacity duration-300 group-hover:opacity-90"
          aria-hidden="true"
        />

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="relative grid h-12 w-12 place-items-center md:h-14 md:w-14">
            <span
              className="absolute inset-0 rounded-full border-2 border-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-play-ring"
              aria-hidden="true"
            />
            <span className="relative grid h-full w-full place-items-center rounded-full bg-white/95 text-brand shadow-lg ring-2 ring-white/60 transition-[transform,box-shadow] duration-300 ease-out group-hover:scale-110 group-hover:shadow-xl">
              <svg className="ml-0.5 h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 7.5v9l7.5-4.5L9 7.5z" />
              </svg>
            </span>
          </span>
        </span>
      </button>

      <div className="flex flex-1 flex-col px-5 py-5 sm:px-6">
        {item.subtitle ? (
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-brand uppercase sm:text-xs">{item.subtitle}</p>
        ) : null}
        <h3 className={`font-serif text-xl leading-snug text-ink sm:text-[1.35rem] ${item.subtitle ? 'mt-2' : ''}`}>
          {item.title}
        </h3>
        {description ? (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">{description}</p>
        ) : null}
        <button
          type="button"
          onClick={onPlay}
          className="mt-4 self-start text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:text-brand-light hover:underline"
        >
          Watch video
        </button>
      </div>
    </article>
  )
}

export default function VideoLibrarySection() {
  const { videoLibrary } = useGalleryContent()
  const { label, title, description, items } = videoLibrary
  const [activeItem, setActiveItem] = useState(null)

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

  if (playableItems.length === 0) return null

  return (
    <section
      id="video-library"
      className="relative overflow-hidden border-b border-slate-200 bg-surface-alt py-20 lg:py-28 select-none"
      onContextMenu={blockMediaContext}
      onCopy={(event) => event.preventDefault()}
    >
      <div
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand/8 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-8 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{label}</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-[2.75rem]">{title}</h2>
          {description ? (
            <p className="mt-5 text-base leading-relaxed text-ink-muted md:text-lg">{description}</p>
          ) : null}
        </header>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-7 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {playableItems.map((item) => (
            <MomentCard key={item.id} item={item} onPlay={() => setActiveItem(item)} />
          ))}
        </div>
      </div>

      {activeItem ? <MomentVideoModal item={activeItem} onClose={closeModal} /> : null}
    </section>
  )
}
