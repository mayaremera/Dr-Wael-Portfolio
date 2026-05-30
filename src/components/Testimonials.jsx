import { useCallback, useEffect, useRef, useState } from 'react'
import { testimonials } from '../data/content'

const DRAG_THRESHOLD = 72
const CARD_HEIGHT_BUFFER = 16

function PaginationNumber({ index, active, onSelect }) {
  const label = String(index + 1).padStart(2, '0')

  return (
    <button
      type="button"
      aria-label={`Go to testimonial ${index + 1}`}
      aria-current={active ? 'true' : undefined}
      onClick={() => onSelect(index)}
      className={`relative pb-1 text-sm font-medium tracking-wide tabular-nums transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:transition-transform after:duration-300 after:ease-out ${
        active
          ? 'text-accent after:origin-left after:scale-x-100 after:bg-accent'
          : 'text-ink-muted after:origin-left after:scale-x-0 after:bg-brand hover:text-brand hover:after:scale-x-100'
      }`}
    >
      {label}
    </button>
  )
}

function TestimonialCornerIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-1 top-[20%] z-0 h-[62%] max-h-48 w-auto text-brand/[0.09] sm:right-2 sm:max-h-52 md:max-h-56"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      preserveAspectRatio="xMaxYMid meet"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 8.25h9a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0116.5 17.25H14l-2.25 2.25V17.25H7.5a2.25 2.25 0 01-2.25-2.25v-4.5A2.25 2.25 0 017.5 8.25z"
      />
    </svg>
  )
}

function TestimonialCard({ item, className = '' }) {
  return (
    <blockquote
      className={`relative isolate flex h-full w-full flex-col overflow-hidden rounded-sm border border-brand/20 bg-gradient-to-br from-brand-muted/80 via-white to-accent/5 shadow-md shadow-brand/5 ${className}`}
    >
      <div
        className="absolute inset-x-0 top-0 z-20 h-1 bg-gradient-to-r from-brand via-brand-light to-accent"
        aria-hidden="true"
      />
      <TestimonialCornerIcon />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col p-3 sm:p-3.5 md:p-3.5">
        <span
          className="relative font-serif text-2xl leading-none text-brand/20 select-none sm:text-3xl"
          aria-hidden="true"
        >
          &ldquo;
        </span>

        <p className="relative -mt-1 flex-1 bg-transparent pb-2 text-sm leading-snug text-ink md:text-base md:leading-normal">
          {item.quote}
        </p>

        <footer className="relative z-10 flex shrink-0 items-center gap-2.5 border-t border-brand/15 bg-white/60 pt-2 backdrop-blur-[1px]">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-brand/30">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-brand">{item.name}</p>
            {item.location ? (
              <p className="mt-0.5 w-fit truncate rounded-full bg-accent/12 px-1.5 py-0.5 text-xs text-accent">
                {item.location}
              </p>
            ) : null}
          </div>
        </footer>
      </div>
    </blockquote>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)
  const dragAxis = useRef(null)
  const isDraggingRef = useRef(false)
  const measureRef = useRef(null)
  const [viewportHeight, setViewportHeight] = useState(null)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  const measureCards = useCallback(() => {
    if (!measureRef.current) return

    const cards = measureRef.current.querySelectorAll('[data-testimonial-measure]')
    let maxHeight = 0

    cards.forEach((wrapper) => {
      const card = wrapper.firstElementChild
      if (card) {
        maxHeight = Math.max(maxHeight, card.getBoundingClientRect().height)
      }
    })

    if (maxHeight > 0) {
      setViewportHeight(Math.ceil(maxHeight) + CARD_HEIGHT_BUFFER)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const updateScreen = () => setIsLargeScreen(mediaQuery.matches)

    updateScreen()
    mediaQuery.addEventListener('change', updateScreen)

    return () => mediaQuery.removeEventListener('change', updateScreen)
  }, [])

  useEffect(() => {
    measureCards()

    const observer = new ResizeObserver(measureCards)
    if (measureRef.current) observer.observe(measureRef.current)

    window.addEventListener('resize', measureCards)
    document.fonts?.ready.then(measureCards)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measureCards)
    }
  }, [measureCards])

  const goTo = useCallback((index) => {
    setActive(Math.max(0, Math.min(testimonials.length - 1, index)))
  }, [])

  const goNext = useCallback(() => {
    setActive((current) => Math.min(testimonials.length - 1, current + 1))
  }, [])

  const goPrev = useCallback(() => {
    setActive((current) => Math.max(0, current - 1))
  }, [])

  const handlePointerDown = (event) => {
    dragStartX.current = event.clientX
    dragStartY.current = event.clientY
    dragAxis.current = null
    isDraggingRef.current = true
    setDragOffset(0)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) return

    const deltaX = event.clientX - dragStartX.current
    const deltaY = event.clientY - dragStartY.current

    if (!dragAxis.current) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return
      dragAxis.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y'
    }

    if (dragAxis.current === 'y') {
      setIsDragging(false)
      return
    }

    setIsDragging(true)
    let delta = deltaX
    const atStart = active === 0
    const atEnd = active === testimonials.length - 1

    if (atStart && delta > 0) delta *= 0.3
    if (atEnd && delta < 0) delta *= 0.3

    setDragOffset(delta)
  }

  const finishDrag = (event) => {
    if (!isDraggingRef.current) return

    if (dragAxis.current === 'x') {
      const delta = event.clientX - dragStartX.current
      if (delta < -DRAG_THRESHOLD) goNext()
      else if (delta > DRAG_THRESHOLD) goPrev()
    }

    dragAxis.current = null
    isDraggingRef.current = false
    setIsDragging(false)
    setDragOffset(0)
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handlePointerUp = (event) => finishDrag(event)
  const handlePointerCancel = (event) => finishDrag(event)

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden border-t border-slate-200 bg-surface-alt py-20 lg:py-28"
    >
      <div
        className="pointer-events-none absolute -left-16 top-20 hidden h-56 w-56 rounded-full bg-accent/15 blur-3xl lg:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-12 bottom-16 hidden h-48 w-48 rounded-full bg-brand/10 blur-3xl lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-stretch lg:gap-12 xl:gap-14">
          <div
            className="order-2 flex flex-col lg:order-1"
            style={
              viewportHeight && isLargeScreen
                ? { minHeight: `${viewportHeight}px` }
                : undefined
            }
          >
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Testimonials</p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.12] text-ink md:text-4xl lg:text-[3.25rem] lg:leading-[1.08] xl:text-[3.75rem]">
              Voices of trust from families
              <br />
              who&apos;ve seen the change
            </h2>
            <div className="mt-5 h-1 w-14 rounded-full bg-brand" aria-hidden="true" />

            <p className="mt-8 flex-1 text-base leading-relaxed text-ink-muted md:text-lg md:leading-relaxed">
            Families share their experience with Dr. Wael, highlighting progress, dedication,
             <br />
             and lasting impact.
            </p>
          </div>

          <div className="relative order-1 flex min-w-0 flex-col lg:order-2">
            <div
              ref={measureRef}
              className="pointer-events-none invisible absolute inset-x-0 top-0 -z-10 w-full"
              aria-hidden="true"
            >
              {testimonials.map((item) => (
                <div key={`measure-${item.id}`} data-testimonial-measure className="w-full">
                  <TestimonialCard item={item} />
                </div>
              ))}
            </div>

            <div
              className={`touch-pan-y overflow-hidden rounded-sm select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={viewportHeight ? { height: viewportHeight } : undefined}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              aria-roledescription="carousel"
              aria-label="Testimonials slider — drag or use pagination"
            >
              <div
                className="flex h-full items-stretch will-change-transform"
                style={{
                  transform: `translateX(calc(-${active * 100}% + ${dragOffset}px))`,
                  transition: isDragging ? 'none' : 'transform 0.4s ease-out',
                }}
              >
                {testimonials.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex h-full w-full shrink-0 grow-0 basis-full"
                    aria-hidden={index !== active}
                  >
                    <TestimonialCard item={item} className="h-full" />
                  </div>
                ))}
              </div>
            </div>

            <nav
              className="mt-5 flex flex-wrap items-center justify-center gap-6 sm:gap-8"
              aria-label="Testimonial pagination"
            >
              {testimonials.map((t, index) => (
                <PaginationNumber
                  key={t.id}
                  index={index}
                  active={index === active}
                  onSelect={goTo}
                />
              ))}
            </nav>

            <p className="mt-3 text-center text-xs text-ink-muted">
              Drag the card left or right to read more testimonials
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
