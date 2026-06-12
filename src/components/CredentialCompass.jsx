import { useEffect, useRef, useState } from 'react'

const COMPASS_TAGLINE = 'A Career Dedicated to Communication, Education, and Impact'

const COMPASS_ITEMS = [
  {
    short: '30+ Years',
    title: '30+ Years',
    detail: 'Over three decades of dedicated experience in Speech-Language Pathology.',
  },
  {
    short: 'ASHA Fellow',
    title: 'F-ASHA',
    detail:
      'ASHA Fellow — one of the highest honors awarded by the American Speech-Language-Hearing Association.',
  },
  {
    short: '40K+ Sessions',
    title: '40,000+ Sessions',
    detail: 'Speech and language therapy sessions delivered across diverse clinical settings.',
  },
  {
    short: '3K+ Evals',
    title: '3,000+ Evaluations',
    detail: 'Comprehensive diagnostic evaluations completed for children and families.',
  },
  {
    short: '50+ Nations',
    title: '50+ Nationalities',
    detail: 'Served children and families representing more than fifty nationalities worldwide.',
  },
  {
    short: 'Professor',
    title: 'Clinical Educator',
    detail:
      'Associate Professor and clinical educator in graduate Speech-Language Pathology programs.',
  },
  {
    short: 'SIG Editor',
    title: 'SIG 17 Editor',
    detail: 'Editor of Perspectives of the ASHA Special Interest Groups (SIG 17).',
  },
  {
    short: 'Ambassador',
    title: 'ASHA Ambassador',
    detail: 'ASHA International Ambassador advancing global communication sciences.',
  },
  {
    short: 'Global Mentor',
    title: 'Speaker & Mentor',
    detail: 'International speaker, consultant, and professional mentor to clinicians worldwide.',
  },
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
  const [previewIndex, setPreviewIndex] = useState(null)
  const lastStepRef = useRef(0)

  const displayIndex = previewIndex ?? activeIndex
  const displayItem = COMPASS_ITEMS[displayIndex]

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

  const selectItem = (index) => {
    lastStepRef.current = index
    setActiveIndex(index)
  }

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex w-full max-w-[300px] flex-col items-center justify-center lg:mx-0 lg:max-w-none"
      aria-label="Credentials compass"
    >
      <p className="mb-1 text-center text-[0.65rem] font-semibold tracking-[0.2em] text-brand uppercase lg:text-left">
        Credentials
      </p>
      <p className="mb-4 max-w-[260px] text-center text-[0.58rem] leading-snug text-ink-muted lg:max-w-none lg:text-left">
        {COMPASS_TAGLINE}
      </p>

      <div className="relative aspect-square w-full max-w-[280px]">
        <div className="absolute inset-0 text-brand/80">
          <CompassRose />
        </div>

        <div
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `rotate(${ringRotation}deg)` }}
        >
          {COMPASS_ITEMS.map((item, index) => {
            const angle = (index / COMPASS_ITEMS.length) * 360 - 90
            const isActive = index === activeIndex
            const isPreview = index === previewIndex
            const isHighlighted = isActive || isPreview

            return (
              <div
                key={item.short}
                className="absolute left-1/2 top-1/2 h-0 w-0"
                style={{ transform: `rotate(${angle}deg) translateY(-118px)` }}
              >
                <button
                  type="button"
                  aria-label={`${item.short}: ${item.detail}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => selectItem(index)}
                  onMouseEnter={() => setPreviewIndex(index)}
                  onMouseLeave={() => setPreviewIndex(null)}
                  onFocus={() => setPreviewIndex(index)}
                  onBlur={() => setPreviewIndex(null)}
                  className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-pointer whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.56rem] font-semibold tracking-wide uppercase transition-all duration-500 sm:px-2.5 sm:py-1 sm:text-[0.62rem] ${
                    isHighlighted
                      ? 'border-brand bg-brand text-white shadow-md shadow-brand/25 scale-110 z-10'
                      : 'border-brand/20 bg-white/90 text-brand/70 scale-95 hover:border-brand/40 hover:bg-white hover:text-brand hover:scale-100'
                  }`}
                  style={{ transform: `rotate(${-angle - ringRotation}deg)` }}
                >
                  {item.short}
                </button>
              </div>
            )
          })}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            key={displayIndex}
            className="flex h-[8.5rem] w-[8.5rem] flex-col items-center justify-center rounded-full border border-brand/20 bg-white/95 px-3 text-center shadow-inner shadow-brand/10 backdrop-blur-sm transition-opacity duration-300 sm:h-36 sm:w-36"
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
        {COMPASS_ITEMS.map((item, index) => (
          <button
            key={item.short}
            type="button"
            aria-label={`Show ${item.short}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => selectItem(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'w-4 bg-brand' : 'w-1.5 bg-brand/20 hover:bg-brand/40'
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
