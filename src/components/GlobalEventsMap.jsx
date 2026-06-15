import { useCallback, useMemo, useState } from 'react'
import { useDrWaelActivity } from '../hooks/useDrWaelActivity'
import { buildMapLocationsWithEvents, globalPresenceMap } from '../data/globalEventMap'
import EarthGlobe from './EarthGlobe'

function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        top: `${(i * 23 + 11) % 100}%`,
        size: (i % 3) + 1,
        delay: `${(i % 12) * 0.35}s`,
        duration: `${2.5 + (i % 5) * 0.6}s`,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="animate-globe-star absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: 0.15 + (star.size - 1) * 0.2,
          }}
        />
      ))}
    </div>
  )
}

function EventTimelineCard({ event, index, total }) {
  return (
    <article
      className="animate-globe-event-in relative pl-8"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="absolute top-0 left-3 h-full w-px bg-linear-to-b from-brand/40 via-accent/30 to-transparent" aria-hidden="true" />
      <div
        className={`absolute top-5 left-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0a1520] ${
          event.isUpcoming ? 'bg-accent' : event.isMilestone ? 'bg-brand-light' : 'bg-brand'
        }`}
        aria-hidden="true"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </div>

      {index < total - 1 ? (
        <div className="absolute top-11 left-3 h-[calc(100%-2rem)] w-px bg-brand/15" aria-hidden="true" />
      ) : null}

      <div
        className="rounded-sm border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-muted px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide text-brand uppercase">
            {event.type}
          </span>
          {event.isUpcoming ? (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide text-white uppercase">
              Upcoming
            </span>
          ) : null}
          {event.isMilestone ? (
            <span className="rounded-full bg-surface-tint px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide text-ink-muted uppercase">
              Milestone
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <p className="font-serif text-xl leading-none text-brand tabular-nums">{event.date}</p>
          <p className="text-[0.65rem] font-medium tracking-wide text-ink-muted uppercase">{event.period}</p>
        </div>

        <h4 className="mt-2 font-serif text-base leading-snug text-ink">{event.title}</h4>
        <p className="mt-1 text-xs font-medium text-brand">{event.location}</p>
        {event.note ? (
          <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-ink-muted">{event.note}</p>
        ) : null}
      </div>
    </article>
  )
}

function EventsPanel({ location, isPinned, onClose }) {
  if (!location) return null

  return (
    <div className="animate-globe-panel-in pointer-events-auto absolute inset-x-4 bottom-4 z-30 mx-auto max-h-[55vh] max-w-lg overflow-hidden rounded-sm border border-white/10 bg-[#0a1520]/90 shadow-2xl backdrop-blur-xl lg:inset-x-auto lg:top-1/2 lg:right-8 lg:bottom-auto lg:w-[380px] lg:max-h-[min(72vh,640px)]">
      <div className="relative border-b border-white/10 bg-linear-to-r from-brand/20 to-transparent px-5 py-5">
        {isPinned ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-white/25 hover:text-white"
            aria-label="Close events panel"
          >
            ×
          </button>
        ) : null}

        <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-accent uppercase">
          {isPinned ? 'Selected region' : 'Previewing region'}
        </p>
        <div className="mt-2 flex items-start gap-3">
          <span className="text-3xl" aria-hidden="true">
            {location.flag}
          </span>
          <div>
            <h3 className="font-serif text-2xl text-white">{location.country}</h3>
            <p className="text-sm font-medium text-brand-light">{location.city}</p>
            <p className="mt-1 text-xs text-white/50">{location.role}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-accent/60 to-transparent" aria-hidden="true" />
          <span className="text-xs font-semibold tracking-wide text-white/60 uppercase tabular-nums">
            {location.eventCount} event{location.eventCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="globe-panel-scroll max-h-[calc(55vh-140px)] overflow-y-auto px-5 py-5 lg:max-h-[calc(min(72vh,640px)-140px)]">
        <div className="space-y-5" key={location.id}>
          {location.events.map((event, index) => (
            <EventTimelineCard key={event.id} event={event} index={index} total={location.events.length} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function GlobalEventsMap() {
  const activity = useDrWaelActivity()
  const [selectedId, setSelectedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  const locations = useMemo(() => buildMapLocationsWithEvents(activity), [activity])

  const selectedLocation = locations.find((loc) => loc.id === selectedId) ?? null
  const hoveredLocation = locations.find((loc) => loc.id === hoveredId) ?? null
  const activeLocation = hoveredLocation ?? selectedLocation
  const totalEvents = locations.reduce((sum, loc) => sum + loc.eventCount, 0)
  const countryCount = locations.length

  const handleSelect = useCallback((id) => {
    setSelectedId((current) => (current === id ? null : id))
  }, [])

  return (
    <section
      id="global-presence"
      aria-labelledby="global-presence-heading"
      className="global-presence-section relative min-h-screen overflow-x-clip"
    >
      <Starfield />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#050c12] via-[#0a1520] to-[#0f2830]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[min(120vw,900px)] w-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/8 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 right-0 h-96 w-96 rounded-full bg-accent/6 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen flex-col px-4 pt-36 pb-8 sm:px-6 sm:pt-40 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">{globalPresenceMap.label}</p>
          <h2 id="global-presence-heading" className="mt-4 font-serif text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            {globalPresenceMap.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/55 md:text-lg">{globalPresenceMap.description}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-globe-pulse rounded-full bg-accent/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-xs font-medium text-white/70">
                <span className="font-semibold text-white tabular-nums">{countryCount}</span> countries
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <span className="text-xs font-medium text-white/70">
                <span className="font-semibold text-white tabular-nums">{totalEvents}</span> engagements worldwide
              </span>
            </div>
          </div>
        </header>

        <div className="relative mx-auto mt-6 w-full max-w-[1716px] shrink-0 pb-8 lg:mt-2">
          <EarthGlobe
            locations={locations}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onMarkerClick={handleSelect}
            onMarkerHover={setHoveredId}
            className="w-full"
          />

          <EventsPanel
            location={activeLocation}
            isPinned={Boolean(selectedLocation)}
            onClose={() => setSelectedId(null)}
          />
        </div>
      </div>
    </section>
  )
}
