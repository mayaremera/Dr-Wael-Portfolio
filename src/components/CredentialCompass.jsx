import { useEffect, useRef, useState } from 'react'
import { useHomeContent } from '../hooks/useHomeContent'

const WHEEL_SCALE = 1.15
const WHEEL_MAX_PX = Math.round(280 * WHEEL_SCALE)
const LABEL_RADIUS_PX = Math.round(118 * WHEEL_SCALE)
const HUB_SIZE_REM = 8.5 * WHEEL_SCALE

function formatCredentialLabel(short = '') {
  const words = short.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 2) return short.trim()

  return `${words.slice(0, 2).join(' ')}..`
}

function CompassRose() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-brand/15" />
      <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 5" className="text-brand/20" />
      <circle cx="100" cy="100" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand/10" />
      <line x1="100" y1="12" x2="100" y2="34" stroke="currentColor" strokeWidth="2" className="text-brand/50" />
      <line x1="100" y1="166" x2="100" y2="188" stroke="currentColor" strokeWidth="1" className="text-brand/20" />
      <line x1="12" y1="100" x2="34" y2="100" stroke="currentColor" strokeWidth="1" className="text-brand/20" />
      <line x1="166" y1="100" x2="188" y2="100" stroke="currentColor" strokeWidth="1" className="text-brand/20" />
      <polygon points="100,18 94,32 106,32" fill="currentColor" className="text-brand" />
      <text x="100" y="8" textAnchor="middle" className="fill-brand text-[9px] font-semibold tracking-widest">
        N
      </text>
    </svg>
  )
}

export default function CredentialCompass() {
  const { content, isReady } = useHomeContent()
  const items = content?.credentialWheel?.items ?? []
  const tagline = content?.credentialWheel?.tagline ?? ''

  const rootRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [previewIndex, setPreviewIndex] = useState(null)
  const lastStepRef = useRef(0)

  useEffect(() => {
    if (activeIndex >= items.length && items.length > 0) {
      setActiveIndex(items.length - 1)
    }
  }, [activeIndex, items.length])

  useEffect(() => {
    const root = rootRef.current
    if (!root || items.length === 0) return

    const updateFromScroll = () => {
      const rect = root.getBoundingClientRect()
      const viewport = window.innerHeight
      const sectionTop = rect.top
      const sectionHeight = rect.height

      const scrollStart = viewport * 0.85
      const scrollEnd = -sectionHeight * 0.35
      const range = scrollStart - scrollEnd
      const progress = Math.min(1, Math.max(0, (scrollStart - sectionTop) / range))
      const step = Math.min(items.length - 1, Math.floor(progress * items.length))

      if (step !== lastStepRef.current) {
        lastStepRef.current = step
        setActiveIndex(step)
      }
    }

    updateFromScroll()
    window.addEventListener('scroll', updateFromScroll, { passive: true })
    window.addEventListener('resize', updateFromScroll)

    return () => {
      window.removeEventListener('scroll', updateFromScroll)
      window.removeEventListener('resize', updateFromScroll)
    }
  }, [items.length])

  if (!isReady || !content || items.length === 0) return null

  const safeActiveIndex = Math.min(activeIndex, items.length - 1)
  const displayIndex = previewIndex ?? safeActiveIndex
  const displayItem = items[displayIndex] ?? items[0]

  const ringRotation = -(safeActiveIndex * (360 / items.length))
  const angleStep = 360 / items.length

  const selectItem = (index) => {
    lastStepRef.current = index
    setActiveIndex(index)
  }

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex w-full max-w-[345px] flex-col items-center justify-center lg:mx-0 lg:max-w-none"
      aria-label="Credentials compass"
    >
      <p className="mb-1 text-center text-[0.65rem] font-semibold tracking-[0.2em] text-brand uppercase lg:text-left">
        Credentials
      </p>
      {tagline ? (
        <p className="mb-4 max-w-[260px] text-center text-[0.58rem] leading-snug text-ink-muted lg:max-w-none lg:text-left">
          {tagline}
        </p>
      ) : null}

      <div
        className="relative aspect-square w-full"
        style={{ maxWidth: `${WHEEL_MAX_PX}px` }}
      >
        <div className="absolute inset-0 text-brand/80">
          <CompassRose />
        </div>

        <div
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `rotate(${ringRotation}deg)` }}
        >
          {items.map((item, index) => {
            const angle = -90 + index * angleStep
            const isActive = index === safeActiveIndex
            const isPreview = index === previewIndex
            const isHighlighted = isActive || isPreview
            const label = formatCredentialLabel(item.short)

            return (
              <div
                key={item.id || item.short}
                className="absolute left-1/2 top-1/2 h-0 w-0"
                style={{ transform: `rotate(${angle}deg) translateY(-${LABEL_RADIUS_PX}px)` }}
              >
                <button
                  type="button"
                  aria-label={`${item.short}: ${item.detail}`}
                  title={item.short}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => selectItem(index)}
                  onMouseEnter={() => setPreviewIndex(index)}
                  onMouseLeave={() => setPreviewIndex(null)}
                  onFocus={() => setPreviewIndex(index)}
                  onBlur={() => setPreviewIndex(null)}
                  className={`absolute left-1/2 top-0 flex h-[1.65rem] w-[4.85rem] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border px-1 text-[0.56rem] font-semibold tracking-wide uppercase transition-colors duration-500 sm:text-[0.62rem] ${
                    isHighlighted
                      ? 'z-10 border-brand bg-brand text-white shadow-md shadow-brand/25'
                      : 'z-0 border-brand/20 bg-white/90 text-brand/70 hover:border-brand/40 hover:bg-white hover:text-brand'
                  }`}
                  style={{ transform: `rotate(${-angle - ringRotation}deg)` }}
                >
                  <span className="block max-w-full truncate">{label}</span>
                </button>
              </div>
            )
          })}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            key={displayIndex}
            className="flex flex-col items-center justify-center rounded-full border border-brand/20 bg-white/95 px-3 text-center shadow-inner shadow-brand/10 backdrop-blur-sm transition-opacity duration-300"
            style={{ width: `${HUB_SIZE_REM}rem`, height: `${HUB_SIZE_REM}rem` }}
          >
            <span className="text-[0.5rem] font-semibold tracking-[0.18em] text-brand/60 uppercase">Focus</span>
            <span className="mt-0.5 font-serif text-sm leading-tight text-brand sm:text-[0.95rem]">
              {displayItem.title}
            </span>
            <p className="mt-1.5 line-clamp-4 text-[0.58rem] leading-snug text-ink-muted sm:text-[0.6rem]">
              {displayItem.detail}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex max-w-[240px] flex-wrap items-center justify-center gap-1.5 sm:max-w-none">
        {items.map((item, index) => (
          <button
            key={item.id || item.short}
            type="button"
            aria-label={`Show ${item.short}`}
            aria-current={index === safeActiveIndex ? 'true' : undefined}
            onClick={() => selectItem(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === safeActiveIndex ? 'w-4 bg-brand' : 'w-1.5 bg-brand/20 hover:bg-brand/40'
            }`}
          />
        ))}
      </div>

      <p className="mt-3 max-w-[260px] text-center text-[0.65rem] leading-relaxed text-ink-muted lg:max-w-none lg:text-left">
        Scroll, hover, or tap a point to explore each credential
      </p>
    </div>
  )
}
