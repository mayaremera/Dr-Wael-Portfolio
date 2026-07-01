import { useEffect, useRef } from 'react'
import { useDrWaelActivity } from '../hooks/useDrWaelActivity'
import { resolveHomepageFeaturedEvents } from '../data/contentStore'
import { hasMediaSrc } from '../lib/mediaUrl'

const sectionLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

const soundWaveHeights = [5, 8, 6, 10, 7, 9, 5, 8, 6, 11, 7, 9, 5, 8, 6, 10, 7, 8, 5, 9, 6, 7, 5, 8]

function VideoSoundWaves() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center gap-[5px] bg-gradient-to-t from-black/10 via-black/10 to-transparent px-4 pb-0.5 pt-10"
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

function ActivityCardMedia({ item }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playVideo = () => {
      video.play().catch(() => {})
    }

    playVideo()
    video.addEventListener('loadeddata', playVideo)

    return () => video.removeEventListener('loadeddata', playVideo)
  }, [item.video])

  if (!item.video && !item.image) return null

  return (
    <div className="relative aspect-[16/7] w-full overflow-hidden bg-slate-900">
      {hasMediaSrc(item.video) ? (
        <>
          <video
            ref={videoRef}
            className="h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label={item.imageAlt || item.title}
          >
            <source src={item.video} type="video/mp4" />
          </video>

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5"
            aria-hidden="true"
          />

          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase backdrop-">
            Event clip
          </span>

          <VideoSoundWaves />
        </>
      ) : hasMediaSrc(item.image) ? (
        <>
          <img
            src={item.image}
            alt={item.imageAlt || item.title}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent"
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs font-medium tracking-wide text-white/50 uppercase">
          No media
        </div>
      )}
    </div>
  )
}

function ActivityCard({ item, isUpcoming = false }) {
  return (
    <article
      tabIndex={0}
      className="group/card relative w-full self-start overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm outline-none transition-shadow duration-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      {isUpcoming ? (
        <div className="h-1 bg-accent" aria-hidden="true" />
      ) : (
        <div className="h-1 bg-brand" aria-hidden="true" />
      )}

      <ActivityCardMedia item={item} />

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-h-7 flex-wrap items-start gap-2">
          <span className="rounded-full bg-brand-muted px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-brand uppercase">
            {item.type}
          </span>
          {isUpcoming ? (
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
              Upcoming
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <p className="font-serif text-xl leading-none text-brand tabular-nums sm:text-2xl">{item.date}</p>
          <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">{item.period}</p>
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] font-serif text-base leading-snug text-ink sm:mt-3 sm:min-h-[3.25rem] sm:text-lg">
          {item.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-brand">{item.location}</p>

        <div className="mt-3 grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover/card:grid-rows-[1fr] group-focus-within/card:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="border-t border-slate-200/80 pt-3 text-sm leading-relaxed text-ink-muted opacity-0 transition-opacity duration-500 delay-75 group-hover/card:opacity-100 group-focus-within/card:opacity-100 sm:pt-4">
              {item.note}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function DrWaelActivity({ variant = 'preview' }) {
  const { activity, isReady } = useDrWaelActivity()
  const isFullPage = variant === 'full'

  if (!isReady || !activity) return null

  const { label, title, description, upcoming, recent } = activity

  const featuredEvents = resolveHomepageFeaturedEvents(activity)

  const allEvents = [
    ...upcoming.map((item) => ({ ...item, isUpcoming: true })),
    ...recent.map((item) => ({ ...item, isUpcoming: false })),
  ]

  return (
    <section
      id="activity"
      aria-labelledby="activity-heading"
      className="relative overflow-hidden border-t border-slate-200 bg-surface py-20 lg:py-28"
    >
      <div
        className="pointer-events-none absolute -left-16 top-20 h-56 w-56 rounded-full bg-brand/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-12 bottom-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{label}</p>
          <h2 id="activity-heading" className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">{description}</p>
        </header>

        {isFullPage ? (
          <div className="mt-12 mobile-card-scroll mobile-card-scroll--gap-lg lg:grid lg:grid-cols-3 lg:items-start lg:gap-6">
            {allEvents.map((item) => (
              <div key={item.id} className="mobile-card-scroll__item lg:w-auto">
                <ActivityCard item={item} isUpcoming={item.isUpcoming} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-10 mb-4 flex justify-end">
              <a href="/in-the-field" className={sectionLinkClassName}>
                View all events
              </a>
            </div>

            <div className="mobile-card-scroll mobile-card-scroll--gap-lg lg:grid lg:grid-cols-3 lg:items-start lg:gap-6">
              {featuredEvents.map((item) => (
                <div key={item.id} className="mobile-card-scroll__item lg:w-auto">
                  <ActivityCard item={item} isUpcoming={item.isUpcoming} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
