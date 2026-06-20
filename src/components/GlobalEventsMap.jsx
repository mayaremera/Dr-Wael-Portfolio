import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
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

function EventTypeBadge({ event }) {
  const typeTone = event.isMilestone ? 'milestone' : 'default'

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className={`globe-event-tag globe-event-tag--${typeTone}`}>{event.type}</span>
      {event.isUpcoming ? <span className="globe-event-tag globe-event-tag--live">Upcoming</span> : null}
      {event.isMilestone ? <span className="globe-event-tag globe-event-tag--milestone">Milestone</span> : null}
    </div>
  )
}

function EventTimelineCard({ event, index, total }) {
  const tone = event.isUpcoming ? 'upcoming' : event.isMilestone ? 'milestone' : 'default'

  return (
    <article
      className={`globe-event-card globe-event-card--${tone} animate-globe-event-in`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="globe-event-card__rail" aria-hidden="true">
        <span className={`globe-event-card__node globe-event-card__node--${tone}`} />
        {index < total - 1 ? <span className="globe-event-card__line" /> : null}
      </div>

      <div className="globe-event-card__body">
        <EventTypeBadge event={event} />

        <div className="mt-3 flex items-end gap-2.5">
          <p className="font-serif text-[1.35rem] leading-none text-white tabular-nums">{event.date}</p>
          <p className="pb-0.5 text-[0.62rem] font-semibold tracking-[0.14em] text-white/35 uppercase">
            {event.period}
          </p>
        </div>

        <h4 className="mt-2.5 font-serif text-[1.05rem] leading-snug text-white/92">{event.title}</h4>
        <p className="mt-1.5 text-xs font-medium tracking-wide text-brand-light/90">{event.location}</p>

        {event.note ? (
          <p className="mt-3 border-t border-white/[0.06] pt-3 text-sm leading-relaxed text-white/48">{event.note}</p>
        ) : null}
      </div>
    </article>
  )
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function EventsPanel({ location, isPinned, onClose, anchor }) {
  const panelRef = useRef(null)
  const [desktopPosition, setDesktopPosition] = useState(null)

  useLayoutEffect(() => {
    if (!location || !anchor || !panelRef.current) {
      setDesktopPosition(null)
      return
    }

    if (!window.matchMedia('(min-width: 1024px)').matches) {
      setDesktopPosition(null)
      return
    }

    const panel = panelRef.current
    const parent = panel.offsetParent
    if (!parent) return

    const panelWidth = panel.offsetWidth
    const panelHeight = panel.offsetHeight
    const parentWidth = parent.clientWidth
    const parentHeight = parent.clientHeight
    const gap = 14

    let left = anchor.x + gap
    if (left + panelWidth > parentWidth - 12) {
      left = anchor.x - panelWidth - gap
    }
    left = clamp(left, 12, parentWidth - panelWidth - 12)
    const top = clamp(anchor.y, panelHeight / 2 + 12, parentHeight - panelHeight / 2 - 12)

    setDesktopPosition({ left, top })
  }, [location, anchor, location?.id])

  if (!location) return null

  const anchoredDesktopStyle = desktopPosition
    ? {
        left: desktopPosition.left,
        top: desktopPosition.top,
        right: 'auto',
        bottom: 'auto',
        transform: 'translateY(-50%)',
      }
    : undefined

  return (
    <div
      ref={panelRef}
      className={`globe-events-panel animate-globe-panel-in pointer-events-auto absolute inset-x-4 bottom-4 z-30 mx-auto max-h-[58vh] max-w-md overflow-hidden lg:inset-x-auto lg:bottom-auto lg:w-[400px] lg:max-h-[min(74vh,660px)] ${isPinned ? 'globe-events-panel--pinned' : 'globe-events-panel--preview'} ${desktopPosition ? 'globe-panel-anchored' : ''}`}
      style={anchoredDesktopStyle}
    >
      <div className="globe-events-panel__header">
        <div className="globe-events-panel__header-glow" aria-hidden="true" />

        {isPinned ? (
          <button
            type="button"
            onClick={onClose}
            className="globe-events-panel__close"
            aria-label="Close events panel"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}

        <div className="relative flex items-start gap-3.5 pr-8">
          <div className="globe-events-panel__flag" aria-hidden="true">
            <span>{location.flag}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[0.62rem] font-semibold tracking-[0.22em] text-accent uppercase">
                {isPinned ? 'Selected region' : 'Previewing region'}
              </p>
              {!isPinned ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.58rem] font-medium tracking-wide text-white/45 uppercase">
                  <span className="h-1 w-1 rounded-full bg-accent animate-globe-pulse" />
                  Hover preview
                </span>
              ) : null}
            </div>

            <h3 className="mt-2 font-serif text-[1.65rem] leading-tight text-white">{location.country}</h3>
            <p className="mt-1 text-sm font-medium text-brand-light/95">{location.city}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/42">{location.role}</p>
          </div>
        </div>

        <div className="relative mt-5 flex items-center justify-between gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-accent/50 via-white/10 to-transparent" aria-hidden="true" />
          <span className="globe-events-panel__count">
            {location.eventCount} event{location.eventCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="globe-panel-scroll globe-events-panel__scroll">
        <div className="space-y-3" key={location.id}>
          {location.events.map((event, index) => (
            <EventTimelineCard key={event.id} event={event} index={index} total={location.events.length} />
          ))}
        </div>
      </div>

      {!isPinned ? (
        <div className="globe-events-panel__hint">
          Click a marker to keep this panel open
        </div>
      ) : null}
    </div>
  )
}

export default function GlobalEventsMap() {
  const activity = useDrWaelActivity()
  const mapAreaRef = useRef(null)
  const [selectedId, setSelectedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [anchor, setAnchor] = useState(null)

  const globeMeta = activity.globe ?? globalPresenceMap
  const locations = useMemo(() => buildMapLocationsWithEvents(activity), [activity])

  const selectedLocation = locations.find((loc) => loc.id === selectedId) ?? null
  const hoveredLocation = locations.find((loc) => loc.id === hoveredId) ?? null
  const activeLocation = selectedLocation ?? hoveredLocation
  const totalEvents = locations.reduce((sum, loc) => sum + loc.eventCount, 0)
  const countryCount = locations.length

  const handleSelect = useCallback((id) => {
    setSelectedId((current) => (current === id ? null : id))
    setHoveredId(null)
  }, [])

  const handleActiveAnchorChange = useCallback((clientPoint) => {
    if (!clientPoint || !mapAreaRef.current) {
      setAnchor(null)
      return
    }

    const rect = mapAreaRef.current.getBoundingClientRect()
    const next = {
      x: clientPoint.x - rect.left,
      y: clientPoint.y - rect.top,
    }

    setAnchor((current) => {
      if (!current) return next
      if (Math.hypot(current.x - next.x, current.y - next.y) < 0.75) return current
      return next
    })
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
        className="pointer-events-none absolute top-[42%] left-1/2 h-[min(80vw,640px)] w-[min(80vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/5 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 right-0 h-96 w-96 rounded-full bg-accent/6 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen flex-col px-4 pt-24 pb-8 sm:px-6 sm:pt-28 lg:px-8 lg:pt-36 xl:pt-40">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">{globeMeta.label}</p>
          <h2 id="global-presence-heading" className="mt-4 font-serif text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            {globeMeta.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/55 md:text-lg">{globeMeta.description}</p>

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

        <div ref={mapAreaRef} className="relative mx-auto mt-6 w-full max-w-[1716px] shrink-0 pb-8 lg:mt-2">
          <EarthGlobe
            locations={locations}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onMarkerClick={handleSelect}
            onMarkerHover={setHoveredId}
            onActiveAnchorChange={handleActiveAnchorChange}
            className="w-full"
          />

          <EventsPanel
            location={activeLocation}
            isPinned={Boolean(selectedLocation)}
            onClose={() => {
              setSelectedId(null)
              setHoveredId(null)
            }}
            anchor={anchor}
          />
        </div>
      </div>
    </section>
  )
}
