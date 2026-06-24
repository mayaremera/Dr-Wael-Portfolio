import { useEffect, useState } from 'react'
import { useAboutContent } from '../hooks/useAboutContent'

const MONTH_INDEX = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
}

function parseMonthToken(token = '') {
  return MONTH_INDEX[token.trim().toLowerCase()] ?? -1
}

export function isOngoingAcademicPeriod(period) {
  if (!period || typeof period !== 'string') return false

  const text = period.trim()
  const lower = text.toLowerCase()

  if (/\bongoing\b/.test(lower)) return true
  if (/\bpresent\b/.test(lower)) return true
  if (/^since\s+/i.test(text)) return true

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const yearRange = lower.match(/(\d{4})\s*[–—-]\s*(\d{4}|present|ongoing)/)
  if (yearRange) {
    const end = yearRange[2]
    if (end === 'present' || end === 'ongoing') return true
    return parseInt(end, 10) >= currentYear
  }

  const monthRange = lower.match(/([a-z]+)\s+(\d{4})\s*[–—-]\s*([a-z]+|present|ongoing)(?:\s+(\d{4}))?/)
  if (monthRange) {
    const endToken = monthRange[3]
    if (endToken === 'present' || endToken === 'ongoing') return true

    const endYear = parseInt(monthRange[4] ?? monthRange[2], 10)
    const endMonth = parseMonthToken(endToken)
    if (Number.isNaN(endYear) || endMonth < 0) return false

    if (endYear > currentYear) return true
    if (endYear === currentYear) return endMonth >= currentMonth
    return false
  }

  return false
}

function ServiceItem({ item }) {
  const isOngoing = isOngoingAcademicPeriod(item.period)

  return (
    <article
      className={`relative overflow-hidden rounded-sm border p-5 shadow-sm transition-all duration-300 ${
        isOngoing
          ? 'border-brand/35 bg-gradient-to-br from-brand-muted/50 via-white to-accent/5 shadow-brand/10 hover:border-brand/45 hover:shadow-md'
          : 'border-slate-200/80 bg-white hover:border-brand/20 hover:shadow-md'
      }`}
    >
      {isOngoing ? (
        <span
          className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-r-full bg-accent"
          aria-hidden="true"
        />
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className={`font-serif text-lg leading-snug ${isOngoing ? 'text-brand' : 'text-ink'}`}>{item.title}</h3>
        {item.period ? (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.1em] uppercase ${
              isOngoing ? 'bg-brand text-white shadow-sm shadow-brand/20' : 'bg-surface-tint text-ink-muted'
            }`}
          >
            {item.period}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm font-medium text-brand">{item.org}</p>

      {item.description ? (
        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{item.description}</p>
      ) : null}

      {item.journals?.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {item.journals.map((journal) => (
            <li
              key={journal}
              className="rounded-full border border-brand/15 bg-brand-muted/40 px-3 py-1 text-xs font-medium text-brand"
            >
              {journal}
            </li>
          ))}
        </ul>
      ) : null}

      {item.workshops?.length ? (
        <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          {item.workshops.map((workshop) => (
            <li key={workshop.year} className="flex gap-3 text-sm">
              <span className="shrink-0 font-serif text-xs tabular-nums text-brand/70">{workshop.year}</span>
              <span className="text-ink-muted">{workshop.title}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {item.link ? (
        <a
          href={item.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:text-brand-light"
        >
          {item.link.label}
          <span aria-hidden="true">→</span>
        </a>
      ) : null}
    </article>
  )
}

export default function AcademicServices({ embedded = false }) {
  const { isReady, academicServices } = useAboutContent()
  const categories = academicServices?.categories ?? []
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!categories.length) return
    if (!categories.some((category) => category.id === activeId)) {
      setActiveId(categories[0]?.id ?? '')
    }
  }, [categories, activeId])

  if (!isReady || !academicServices || !categories.length) return null

  const { label, title, intro } = academicServices

  const activeCategory = categories.find((category) => category.id === activeId) ?? categories[0]

  const content = (
    <>
      {!embedded ? (
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{label}</p>
          <h3 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted md:text-base">{intro}</p>
        </header>
      ) : null}

      <div className={embedded ? '' : 'mt-8 lg:mt-10'}>
        <div
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Academic service categories"
        >
          {categories.map((category) => {
            const isActive = category.id === activeId
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(category.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-200 ${
                  isActive
                    ? 'border-brand bg-brand text-white shadow-sm'
                    : 'border-slate-200 bg-white text-ink-muted hover:border-brand/30 hover:text-brand'
                }`}
              >
                {category.label}
              </button>
            )
          })}
        </div>

        <div key={activeCategory.id} role="tabpanel" className="mt-6 animate-fade-up space-y-3">
          {activeCategory.items.map((item) => (
            <ServiceItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  )

  if (embedded) {
    return <div id="academic-services">{content}</div>
  }

  return (
    <section id="academic-services" className="border-t border-slate-200 bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">{content}</div>
    </section>
  )
}
