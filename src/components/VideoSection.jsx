import { useState } from 'react'
import { useGalleryContent } from '../hooks/useGalleryContent'
import { parseYoutubeId } from '../data/galleryContentStore'

export default function VideoSection({ variant = 'default' }) {
  const { watchSection } = useGalleryContent()
  const [playing, setPlaying] = useState(false)
  const youtubeId = parseYoutubeId(watchSection.youtubeId || watchSection.youtubeUrl || '')
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=1`
  const isLight = variant === 'light'

  if (!youtubeId && !watchSection.title) return null

  return (
    <section
      id="video"
      className={`relative overflow-hidden py-20 lg:py-28 ${
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

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12 xl:gap-14">
          <div className="order-2 flex flex-col justify-center lg:order-1">
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Watch</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-[2.75rem] xl:text-[3.1rem]">
              {watchSection.title}
            </h2>

            <div className="mt-8 space-y-4">
              {(watchSection.paragraphs ?? []).map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-ink-muted md:text-lg md:leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="order-1 w-full lg:order-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-slate-900 shadow-lg">
              {playing && youtubeId ? (
                <iframe
                  src={embedUrl}
                  title={watchSection.title}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="group/poster absolute inset-0">
                  {watchSection.poster ? (
                    <img
                      src={watchSection.poster}
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
                      onClick={() => setPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center"
                      aria-label={`Play video: ${watchSection.title}`}
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
      </div>
    </section>
  )
}
