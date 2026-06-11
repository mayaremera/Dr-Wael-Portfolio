import { useEffect, useRef, useState } from 'react'

const COMPASS_ITEMS = [
  'Ph.D.',
  'CCC-SLP',
  'ASHA Fellow',
  '30+ Years',
  'English & Arabic',
  'Global Leadership',
]

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
  const rootRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const lastStepRef = useRef(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const updateFromScroll = () => {
      const rect = root.getBoundingClientRect()
      const viewport = window.innerHeight
      const sectionTop = rect.top
      const sectionHeight = rect.height

      const scrollStart = viewport * 0.85
      const scrollEnd = -sectionHeight * 0.35
      const range = scrollStart - scrollEnd
      const progress = Math.min(1, Math.max(0, (scrollStart - sectionTop) / range))
      const step = Math.min(
        COMPASS_ITEMS.length - 1,
        Math.floor(progress * COMPASS_ITEMS.length),
      )

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
  }, [])

  const ringRotation = -(activeIndex * (360 / COMPASS_ITEMS.length))

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex w-full max-w-[280px] flex-col items-center justify-center lg:mx-0 lg:max-w-none"
      aria-label="Credentials compass"
    >
      <p className="mb-4 text-center text-[0.65rem] font-semibold tracking-[0.2em] text-brand uppercase lg:text-left">
        Credentials
      </p>

      <div className="relative aspect-square w-full max-w-[260px]">
        <div className="absolute inset-0 text-brand/80">
          <CompassRose />
        </div>

        <div
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `rotate(${ringRotation}deg)` }}
        >
          {COMPASS_ITEMS.map((label, index) => {
            const angle = (index / COMPASS_ITEMS.length) * 360 - 90
            const isActive = index === activeIndex

            return (
              <div
                key={label}
                className="absolute left-1/2 top-1/2 w-0 h-0"
                style={{ transform: `rotate(${angle}deg) translateY(-108px)` }}
              >
                <span
                  className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold tracking-wide uppercase transition-all duration-500 sm:px-3 sm:text-[0.68rem] ${
                    isActive
                      ? 'border-brand bg-brand text-white shadow-md shadow-brand/25 scale-110'
                      : 'border-brand/20 bg-white/90 text-brand/70 scale-95'
                  }`}
                  style={{ transform: `rotate(${-angle - ringRotation}deg)` }}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-brand/20 bg-white/95 text-center shadow-inner shadow-brand/10 backdrop-blur-sm sm:h-28 sm:w-28">
            <span className="text-[0.55rem] font-semibold tracking-[0.18em] text-brand/60 uppercase">Focus</span>
            <span className="mt-1 px-2 font-serif text-sm leading-tight text-brand sm:text-base">
              {COMPASS_ITEMS[activeIndex]}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1.5">
        {COMPASS_ITEMS.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-label={`Show ${label}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => {
              lastStepRef.current = index
              setActiveIndex(index)
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'w-5 bg-brand' : 'w-1.5 bg-brand/20 hover:bg-brand/40'
            }`}
          />
        ))}
      </div>

      <p className="mt-3 text-center text-[0.65rem] leading-relaxed text-ink-muted lg:text-left">
        Scroll the page to step through credentials
      </p>
    </div>
  )
}
