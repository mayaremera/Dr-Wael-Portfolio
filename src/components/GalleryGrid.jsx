import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { sortGalleryItems, GALLERY_PAGE_SIZE } from '../data/galleryContentStore'
import { useGalleryContent } from '../hooks/useGalleryContent'
import { protectedMediaProps, protectedShellProps, protectedVideoProps } from '../lib/mediaProtection'
import { hasMediaSrc } from '../lib/mediaUrl'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'image', label: 'Photos' },
  { id: 'video', label: 'Videos' },
]

const PAGE_SIZE = GALLERY_PAGE_SIZE

const soundWaveHeights = [5, 8, 6, 10, 7, 9, 5, 8, 6, 11, 7, 9, 5, 8, 6, 10, 7, 8, 5, 9, 6, 7, 5, 8]

function getItemTitle(item) {
  return item.title?.trim() || item.alt?.trim() || 'Untitled moment'
}

function getItemDescription(item) {
  return item.description?.trim() || ''
}

function VideoSoundWaves() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center gap-[5px] bg-gradient-to-t from-black/25 via-black/10 to-transparent px-3 pb-0.5 pt-8"
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

function GalleryMediaPreview({ item }) {
  const videoRef = useRef(null)
  const isVideo = item.type === 'video'
  const mediaSrc = hasMediaSrc(item.src) ? item.src.trim() : ''

  useEffect(() => {
    if (!isVideo || !mediaSrc) return undefined
    const video = videoRef.current
    if (!video) return undefined

    const playVideo = () => {
      video.play().catch(() => {})
    }

    playVideo()
    video.addEventListener('loadeddata', playVideo)

    return () => video.removeEventListener('loadeddata', playVideo)
  }, [isVideo, mediaSrc])

  if (!mediaSrc) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-200 text-xs font-medium tracking-wide text-ink-muted uppercase">
        Media unavailable
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-900">
      {isVideo ? (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-[center_28%] select-none"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
            aria-hidden="true"
            {...protectedVideoProps}
          >
            <source src={encodeURI(mediaSrc)} type="video/mp4" />
          </video>
          <VideoSoundWaves />
        </>
      ) : (
        <img
          src={encodeURI(mediaSrc)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_28%] select-none"
          loading="lazy"
          {...protectedMediaProps}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5" />

      <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[0.58rem] font-semibold tracking-[0.12em] text-brand uppercase shadow-sm">
        {isVideo ? 'Video' : 'Photo'}
      </span>
    </div>
  )
}

function GalleryLightbox({ items, activeIndex, onClose, onNavigate }) {
  const videoRef = useRef(null)
  const item = items[activeIndex]
  const isVideo = item?.type === 'video'
  const mediaSrc = hasMediaSrc(item?.src) ? item.src.trim() : ''
  const title = getItemTitle(item)
  const description = getItemDescription(item)
  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < items.length - 1

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && hasPrev) onNavigate(activeIndex - 1)
      if (event.key === 'ArrowRight' && hasNext) onNavigate(activeIndex + 1)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, hasNext, hasPrev, onClose, onNavigate])

  useEffect(() => {
    if (!isVideo) return undefined
    const video = videoRef.current
    if (!video) return undefined

    video.play().catch(() => {})

    return () => {
      video.pause()
    }
  }, [isVideo, mediaSrc, activeIndex])

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/80 backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Close gallery"
      />

      <div
        {...protectedShellProps}
        className={`${protectedShellProps.className} relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl lg:max-h-[88vh] lg:flex-row`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-md transition-colors hover:bg-white lg:right-4 lg:top-4"
          aria-label="Close"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="relative min-h-[45vh] flex-1 bg-slate-950 lg:min-h-0 lg:max-w-[62%]">
          {mediaSrc ? (
            isVideo ? (
              <video
                key={item.id}
                ref={videoRef}
                className="h-full w-full object-contain select-none"
                controls
                autoPlay
                playsInline
                aria-label={title}
                {...protectedVideoProps}
              >
                <source src={encodeURI(mediaSrc)} type="video/mp4" />
              </video>
            ) : (
              <img
                key={item.id}
                src={encodeURI(mediaSrc)}
                alt={title}
                className="h-full w-full object-contain select-none"
                {...protectedMediaProps}
              />
            )
          ) : (
            <div className="flex h-full min-h-[45vh] items-center justify-center text-sm text-white/60">Media unavailable</div>
          )}

          {hasPrev ? (
            <button
              type="button"
              onClick={() => onNavigate(activeIndex - 1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg transition-transform hover:scale-105"
              aria-label="Previous item"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : null}

          {hasNext ? (
            <button
              type="button"
              onClick={() => onNavigate(activeIndex + 1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg transition-transform hover:scale-105"
              aria-label="Next item"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ) : null}
        </div>

        <div className="flex w-full flex-col justify-between border-t border-slate-200 p-5 sm:p-6 lg:max-w-[38%] lg:border-t-0 lg:border-l">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-brand uppercase">
              {item.type === 'video' ? 'Video moment' : 'Photo moment'}
              {items.length > 1 ? (
                <span className="text-ink-muted">
                  {' '}
                  · {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </span>
              ) : null}
            </p>
            <h3 className="mt-2 font-serif text-2xl leading-snug text-ink">{title}</h3>
            {description ? (
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{description}</p>
            ) : (
              <p className="mt-4 text-sm italic text-ink-muted/80">No description added yet.</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-ink-muted">Use arrow keys to browse</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/30 hover:text-brand"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GalleryCompactCard({ item, globalIndex, onOpen, className = '' }) {
  const title = getItemTitle(item)
  const description = getItemDescription(item)
  const previewText =
    description || 'A moment from clinical practice, training, or professional events.'

  return (
    <article className={`group h-full ${className}`.trim()}>
      <button
        type="button"
        onClick={() => onOpen(globalIndex)}
        className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left shadow-sm transition-all duration-300 hover:border-brand/25 hover:shadow-md"
        aria-label={`Open ${title}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <GalleryMediaPreview item={item} />

          <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-brand shadow-lg">
              {item.type === 'video' ? (
                <svg className="ml-0.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9 7.5v9l7.5-4.5L9 7.5z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </span>
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 font-serif text-base leading-snug text-ink">{title}</h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-muted">{previewText}</p>
        </div>
      </button>
    </article>
  )
}

function GalleryPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const goToPage = (page) => {
    onPageChange(page)
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
    const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

    const result = []
    sorted.forEach((page, index) => {
      if (index > 0 && page - sorted[index - 1] > 1) {
        result.push('ellipsis')
      }
      result.push(page)
    })

    return result
  }, [currentPage, totalPages])

  return (
    <nav className="mt-10 flex flex-col items-center gap-4" aria-label="Gallery pagination">
      <p className="text-xs font-medium tracking-wide text-ink-muted">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex h-9 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/30 hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          aria-label="Previous page"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
          Prev
        </button>

        {pageNumbers.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-ink-muted" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`flex h-9 min-w-9 items-center justify-center rounded-full border px-2.5 text-xs font-semibold tabular-nums transition-all ${
                page === currentPage
                  ? 'border-brand bg-brand text-white shadow-sm'
                  : 'border-slate-200 bg-white text-ink-muted hover:border-brand/30 hover:text-brand'
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex h-9 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/30 hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          aria-label="Next page"
        >
          Next
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default function GalleryGrid() {
  const { isReady, mediaGallery } = useGalleryContent()
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeIndex, setActiveIndex] = useState(null)

  const items = mediaGallery?.items ?? []

  const sortedItems = useMemo(() => sortGalleryItems(items), [items])

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return sortedItems
    return sortedItems.filter((item) => item.type === activeFilter)
  }, [activeFilter, sortedItems])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredItems.slice(start, start + PAGE_SIZE)
  }, [filteredItems, currentPage])

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId)
    setCurrentPage(1)
  }

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const closeLightbox = useCallback(() => setActiveIndex(null), [])
  const openAt = useCallback((index) => setActiveIndex(index), [])

  if (!isReady || !mediaGallery) return null

  const { label, title, description } = mediaGallery

  if (sortedItems.length === 0) return null

  return (
    <section id="gallery" className="border-t border-slate-200 bg-surface-alt py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{label}</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-4 text-sm leading-relaxed text-ink-muted md:text-base">{description}</p>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-ink-muted md:text-base">
              Browse photos and clips from sessions, conferences, and everyday practice — open any moment for the full view.
            </p>
          )}
        </header>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id
            const count =
              filter.id === 'all'
                ? sortedItems.length
                : sortedItems.filter((item) => item.type === filter.id).length

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => handleFilterChange(filter.id)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-200 ${
                  isActive
                    ? 'border-brand bg-brand text-white shadow-sm'
                    : 'border-slate-200 bg-white text-ink-muted hover:border-brand/30 hover:text-brand'
                }`}
              >
                {filter.label}
                <span className={`ml-1.5 tabular-nums ${isActive ? 'text-white/80' : 'text-ink-muted/70'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {filteredItems.length === 0 ? (
          <p className="mt-12 rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-ink-muted">
            No {activeFilter === 'image' ? 'photos' : 'videos'} in the gallery yet.
          </p>
        ) : (
          <>
            <div className="mt-8 mobile-card-scroll mobile-card-scroll--gap-lg lg:grid lg:grid-cols-3 lg:gap-5">
              {pageItems.map((item, index) => {
                const globalIndex = (currentPage - 1) * PAGE_SIZE + index
                return (
                  <GalleryCompactCard
                    key={item.id}
                    item={item}
                    globalIndex={globalIndex}
                    onOpen={openAt}
                    className="mobile-card-scroll__item lg:w-auto"
                  />
                )
              })}
            </div>

            <GalleryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {activeIndex !== null && filteredItems[activeIndex] ? (
        <GalleryLightbox
          items={filteredItems}
          activeIndex={activeIndex}
          onClose={closeLightbox}
          onNavigate={setActiveIndex}
        />
      ) : null}
    </section>
  )
}
