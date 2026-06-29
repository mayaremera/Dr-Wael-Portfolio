import { useState } from 'react'
import { useGalleryContent } from '../hooks/useGalleryContent'
import { parseYoutubeId } from '../data/galleryContentStore'
import { hasMediaSrc } from '../lib/mediaUrl'

function WatchVideoBlock({ sectionData, reverse, sectionLabel, playing, onPlay }) {
  const youtubeId = parseYoutubeId(sectionData.youtubeId || sectionData.youtubeUrl || '')
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=1`

  if (!youtubeId && !sectionData.title) return null

  const textOrderClass = reverse ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
  const videoOrderClass = reverse ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
  const gridColsClass = reverse
    ? 'lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]'
    : 'lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]'

  return (
    <div className={`grid items-center gap-6 ${gridColsClass} lg:gap-10 xl:gap-14`}>
      <div className={`${textOrderClass} flex flex-col justify-center`}>
        {sectionLabel ? (
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{sectionLabel}</p>
        ) : null}
        <h2
          className={`font-serif text-2xl leading-tight text-ink sm:text-3xl lg:text-[2.75rem] xl:text-[3.1rem] ${
            sectionLabel ? 'mt-2 lg:mt-3' : ''
          }`}
        >
          {sectionData.title}
        </h2>

        <div className="mt-5 space-y-3 lg:mt-8 lg:space-y-4">
          {(sectionData.paragraphs ?? []).map((paragraph) => (
            <p
              key={paragraph}
              className="text-sm leading-relaxed text-ink-muted sm:text-base lg:text-lg lg:leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className={`${videoOrderClass} flex w-full items-center`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 shadow-lg lg:rounded-sm">
          {playing && youtubeId ? (
            <iframe
              src={embedUrl}
              title={sectionData.title}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="group/poster absolute inset-0">
              {hasMediaSrc(sectionData.poster) ? (
                <img
                  src={sectionData.poster}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/poster:scale-[1.03]"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand to-slate-900" />
              )}
              <div
                className="absolute inset-0 bg-gradient-to-t from-brand/45 via-brand/10 to-transparent transition-opacity duration-300 group-hover/poster:opacity-90"
                aria-hidden="true"
              />

              {youtubeId ? (
                <button
                  type="button"
                  onClick={onPlay}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label={`Play video: ${sectionData.title}`}
                >
                  <span className="relative grid h-12 w-12 place-items-center md:h-14 md:w-14">
                    <span
                      className="absolute inset-0 rounded-full border-2 border-white/70 opacity-0 transition-opacity duration-300 group-hover/poster:opacity-100 group-hover/poster:animate-play-ring"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute inset-0 rounded-full border-2 border-white/50 opacity-0 transition-opacity duration-300 group-hover/poster:opacity-100 group-hover/poster:animate-play-ring group-hover/poster:[animation-delay:0.35s]"
                      aria-hidden="true"
                    />

                    <span className="relative grid h-full w-full place-items-center rounded-full bg-white/95 text-brand shadow-lg ring-2 ring-white/60 transition-[transform,box-shadow] duration-300 ease-out group-hover/poster:scale-110 group-hover/poster:shadow-xl">
                      <svg
                        className="h-5 w-5 md:h-6 md:w-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9 7.5v9l7.5-4.5L9 7.5z" />
                      </svg>
                    </span>
                  </span>
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function hasWatchBlockContent(sectionData) {
  if (!sectionData) return false
  const youtubeId = parseYoutubeId(sectionData.youtubeId || sectionData.youtubeUrl || '')
  return Boolean(youtubeId || sectionData.title)
}

export default function VideoSection({ variant = 'default', tone = 'white' }) {
  const { isReady, watchSection, featuredVideo2 } = useGalleryContent()
  const [playingFirst, setPlayingFirst] = useState(false)
  const [playingSecond, setPlayingSecond] = useState(false)

  if (!isReady) return null

  const showFirst = hasWatchBlockContent(watchSection)
  const showSecond = hasWatchBlockContent(featuredVideo2)

  if (!showFirst && !showSecond) return null

  const isLight = variant === 'light'

  return (
    <section
      id="video"
      className={`relative overflow-hidden py-12 lg:py-28 ${
        isLight ? 'border-b border-slate-200 bg-white' : 'border-t border-slate-200 bg-surface-alt'
      }`}
    >
      {!isLight ? (
        <>
          <div
            className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-20 bottom-8 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
            aria-hidden="true"
          />
        </>
      ) : null}

      <div className="relative mx-auto max-w-7xl space-y-16 px-6 lg:space-y-28 lg:px-8">
        {showFirst ? (
          <WatchVideoBlock
            sectionData={watchSection}
            reverse={false}
            sectionLabel="Watch"
            playing={playingFirst}
            onPlay={() => setPlayingFirst(true)}
          />
        ) : null}

        {showSecond ? (
          <WatchVideoBlock
            sectionData={featuredVideo2}
            reverse
            playing={playingSecond}
            onPlay={() => setPlayingSecond(true)}
          />
        ) : null}
      </div>
    </section>
  )
}
