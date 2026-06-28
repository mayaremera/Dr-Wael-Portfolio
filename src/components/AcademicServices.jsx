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

function ServiceItem({ item, compact = false }) {
  const isOngoing = isOngoingAcademicPeriod(item.period)

  return (
    <article
      className={`relative overflow-hidden rounded-sm border p-5 shadow-sm transition-all duration-300 ${
        compact ? 'rounded-lg border-slate-200/70 bg-surface p-4 shadow-none' : ''
      } ${
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

function MobileServiceDetails({ item }) {
  const [expanded, setExpanded] = useState(false)
  const hasExtra =
    Boolean(item.description) ||
    (item.journals?.length ?? 0) > 0 ||
    (item.workshops?.length ?? 0) > 0 ||
    Boolean(item.link)

  return (
    <>
      {item.description ? (
        <p className={`mt-2 text-xs leading-relaxed text-ink-muted ${expanded ? '' : 'line-clamp-2'}`}>
          {item.description}
        </p>
      ) : null}

      {expanded ? (
        <>
          {item.journals?.length ? (
            <ul className="mt-2 flex flex-wrap gap-1">
              {item.journals.map((journal) => (
                <li
                  key={journal}
                  className="rounded-full border border-brand/15 bg-brand-muted/40 px-2 py-0.5 text-[0.65rem] font-medium text-brand"
                >
                  {journal}
                </li>
              ))}
            </ul>
          ) : null}

          {item.workshops?.length ? (
            <ul className="mt-2 space-y-1.5 border-t border-slate-100 pt-2">
              {item.workshops.map((workshop) => (
                <li key={workshop.year} className="flex gap-2 text-xs">
                  <span className="shrink-0 rounded bg-brand/8 px-1.5 py-0.5 font-serif text-[0.6rem] tabular-nums text-brand">
                    {workshop.year}
                  </span>
                  <span className="leading-snug text-ink-muted">{workshop.title}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {item.link ? (
            <a
              href={item.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[0.62rem] font-semibold tracking-wide text-brand uppercase"
            >
              {item.link.label}
              <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </>
      ) : null}

      {hasExtra ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-1.5 text-[0.62rem] font-semibold tracking-wide text-brand uppercase"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      ) : null}
    </>
  )
}

function MobileLeadershipStepCard({ item, stepNumber, isLast }) {
  const isOngoing = isOngoingAcademicPeriod(item.period)

  return (
    <div className="relative flex gap-2.5">
      <div className="flex shrink-0 flex-col items-center">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[0.6rem] font-bold shadow-sm ${
            isOngoing ? 'bg-brand text-white' : 'bg-surface-tint text-brand'
          }`}
        >
          {stepNumber}
        </span>
        {!isLast ? (
          <span
            className="mt-1 w-0.5 flex-1 min-h-[0.75rem] rounded-full bg-linear-to-b from-brand/40 to-brand/10"
            aria-hidden="true"
          />
        ) : null}
      </div>

      <article
        className={`relative mb-2 min-w-0 flex-1 overflow-hidden rounded-lg border bg-white shadow-sm ${
          isOngoing ? 'border-brand/30 shadow-brand/10' : 'border-slate-200/80'
        }`}
      >
        <span
          className={`absolute inset-y-0 left-0 w-1 ${isOngoing ? 'bg-accent' : 'bg-brand/35'}`}
          aria-hidden="true"
        />

        <div className="py-2.5 pr-3 pl-4">
          <h3 className={`font-serif text-sm leading-snug ${isOngoing ? 'text-brand' : 'text-ink'}`}>
            {item.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-xs font-medium text-brand">{item.org}</p>
            {item.period ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[0.55rem] font-semibold tracking-[0.08em] uppercase ${
                  isOngoing ? 'bg-brand text-white' : 'bg-surface-tint text-ink-muted'
                }`}
              >
                {item.period}
              </span>
            ) : null}
          </div>

          <MobileServiceDetails item={item} />
        </div>
      </article>
    </div>
  )
}

function MobileScholarlyCard({ item }) {
  const isOngoing = isOngoingAcademicPeriod(item.period)

  return (
    <article
      className={`relative overflow-hidden rounded-xl border bg-white shadow-sm ${
        isOngoing ? 'border-brand/30 shadow-brand/10' : 'border-slate-200/80'
      }`}
    >
      {isOngoing ? (
        <div
          className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand via-accent to-brand-light"
          aria-hidden="true"
        />
      ) : null}

      <div className="p-3">
        <h3 className={`font-serif text-sm leading-snug ${isOngoing ? 'text-brand' : 'text-ink'}`}>
          {item.title}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-xs font-medium text-brand">{item.org}</p>
          {item.period ? (
            <span
              className={`rounded-full px-2 py-0.5 text-[0.55rem] font-semibold tracking-[0.08em] uppercase ${
                isOngoing ? 'bg-brand text-white' : 'bg-surface-tint text-ink-muted'
              }`}
            >
              {item.period}
            </span>
          ) : null}
        </div>

        <MobileServiceDetails item={item} />
      </div>
    </article>
  )
}

function MobileScholarlyWork({ categories, embedded = false }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')

  useEffect(() => {
    if (!categories.length) return
    if (!categories.some((category) => category.id === activeId)) {
      setActiveId(categories[0]?.id ?? '')
    }
  }, [categories, activeId])

  const activeCategory = categories.find((category) => category.id === activeId) ?? categories[0]

  if (!activeCategory) return null

  return (
    <div className="lg:hidden">
      <div
        className="mobile-icon-scroll mobile-icon-scroll--inset -mx-1 flex gap-2 px-1 pb-0.5"
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
              className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.65rem] font-semibold tracking-[0.08em] uppercase transition-all duration-200 ${
                isActive
                  ? 'border-brand bg-brand text-white shadow-sm shadow-brand/20'
                  : 'border-slate-200 bg-white text-ink-muted'
              }`}
            >
              {category.label}
            </button>
          )
        })}
      </div>

      <div
        key={activeCategory.id}
        role="tabpanel"
        className="mt-4 animate-fade-up overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-surface-alt/60 px-4 py-3">
          <p className="text-sm font-semibold text-ink">{activeCategory.label}</p>
          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[0.62rem] font-semibold tracking-wide text-brand uppercase">
            {activeCategory.items.length} {activeCategory.items.length === 1 ? 'role' : 'roles'}
          </span>
        </div>

        <div className={embedded ? 'space-y-0 p-3' : 'space-y-2 p-3'}>
          {activeCategory.items.map((item, index) =>
            embedded ? (
              <MobileLeadershipStepCard
                key={item.id}
                item={item}
                stepNumber={index + 1}
                isLast={index === activeCategory.items.length - 1}
              />
            ) : (
              <MobileScholarlyCard key={item.id} item={item} />
            ),
          )}
        </div>
      </div>
    </div>
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
        <MobileScholarlyWork categories={categories} embedded={embedded} />

        <div className="hidden lg:block">
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
