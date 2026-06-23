import { useMemo, useState } from 'react'
import { useGalleryContent } from '../hooks/useGalleryContent'
import { parseYoutubeId } from '../data/galleryContentStore'
import { blockMediaContext, protectedMediaProps, protectedShellProps, protectedVideoProps } from '../lib/mediaProtection'

function FeaturedPlayer({ item }) {
  const [playing, setPlaying] = useState(false)

  if (!item) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-sm bg-brand/5 ring-1 ring-brand/10">
        <p className="text-sm text-ink-muted">Select a video below to preview</p>
      </div>
    )
  }

  const isYoutube = item.type === 'youtube' && item.youtubeId
  const embedUrl = `https://www.youtube-nocookie.com/embed/${item.youtubeId}?rel=0&autoplay=1&modestbranding=1&iv_load_policy=3`

  if (playing && isYoutube) {
    return (
      <div
        {...protectedShellProps}
        className={`${protectedShellProps.className} relative aspect-video overflow-hidden rounded-sm bg-slate-900 shadow-2xl ring-1 ring-white/10`}
      >
        <iframe
          src={embedUrl}
          title={item.title}
          className="pointer-events-auto absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    )
  }

  if (playing && item.videoSrc) {
    return (
      <div
        {...protectedShellProps}
        className={`${protectedShellProps.className} relative aspect-video overflow-hidden rounded-sm bg-slate-900 shadow-2xl ring-1 ring-white/10`}
      >
        <video
          src={item.videoSrc}
          className="h-full w-full object-cover"
          controls
          autoPlay
          playsInline
          {...protectedVideoProps}
        />
      </div>
    )
  }

  return (
    <div
      {...protectedShellProps}
      className={`${protectedShellProps.className} group relative aspect-video overflow-hidden rounded-sm bg-slate-900 shadow-2xl ring-1 ring-white/10`}
    >
      {item.poster ? (
        <img
          src={item.poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          {...protectedMediaProps}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-light to-slate-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/20 to-transparent" />

      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
        aria-label={`Play ${item.title}`}
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-brand shadow-xl ring-4 ring-white/30 transition-transform duration-300 group-hover:scale-110">
          <svg className="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9 7.5v9l7.5-4.5L9 7.5z" />
          </svg>
        </span>
        <div className="max-w-lg">
          <p className="font-serif text-2xl text-white md:text-3xl">{item.title}</p>
          {item.subtitle ? <p className="mt-2 text-sm text-white/80">{item.subtitle}</p> : null}
        </div>
      </button>
    </div>
  )
}

function VideoReelCard({ item, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-[220px] shrink-0 snap-start overflow-hidden rounded-sm text-left transition-all duration-300 sm:w-[260px] ${
        isActive ? 'ring-2 ring-white/80 shadow-lg shadow-brand/30' : 'ring-1 ring-white/15 hover:ring-white/40'
      }`}
    >
      <div
        className="relative aspect-video overflow-hidden bg-slate-800"
        onContextMenu={blockMediaContext}
      >
        {item.poster ? (
          <img
            src={item.poster}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            {...protectedMediaProps}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand/80 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand shadow-md">
          <svg className="ml-0.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9 7.5v9l7.5-4.5L9 7.5z" />
          </svg>
        </span>
      </div>
      <div className="border-t border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
        <p className="line-clamp-2 font-serif text-base leading-snug text-white">{item.title}</p>
        {item.subtitle ? <p className="mt-1 line-clamp-1 text-xs text-white/65">{item.subtitle}</p> : null}
      </div>
    </button>
  )
}

export default function VideoLibrarySection() {
  const { videoLibrary } = useGalleryContent()
  const { label, title, description, items } = videoLibrary
  const [activeId, setActiveId] = useState(null)

  const playableItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (item.type === 'youtube' && parseYoutubeId(item.youtubeId)) ||
          (item.type === 'file' && item.videoSrc),
      ),
    [items],
  )

  const activeItem = playableItems.find((item) => item.id === activeId) ?? playableItems[0] ?? null

  if (playableItems.length === 0) return null

  return (
    <section
      id="video-library"
      className="relative overflow-hidden border-b border-brand/20 bg-brand py-20 lg:py-28 select-none"
      onContextMenu={blockMediaContext}
      onCopy={(event) => event.preventDefault()}
    >
      <div
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #fff 0, #fff 2px, transparent 2px, transparent 18px)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.24em] text-white/70 uppercase">{label}</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl lg:text-5xl">{title}</h2>
          {description ? (
            <p className="mt-5 text-base leading-relaxed text-white/75 md:text-lg">{description}</p>
          ) : null}
        </header>

        <div className="mt-12 lg:mt-14">
          <FeaturedPlayer key={activeItem?.id} item={activeItem} />
        </div>

        {playableItems.length > 1 ? (
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">Browse the collection</p>
              <p className="text-xs text-white/50">{playableItems.length} videos</p>
            </div>
            <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 lg:-mx-8 lg:px-8">
              {playableItems.map((item) => (
                <VideoReelCard
                  key={item.id}
                  item={item}
                  isActive={item.id === activeItem?.id}
                  onSelect={() => setActiveId(item.id)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
