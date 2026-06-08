import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useServicesContent } from '../hooks/useServicesContent'

const sectionLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out hover:text-accent hover:after:scale-x-100'

function CaseNavItem({ item, index, isActive, onSelect, inert = false }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <button
      type="button"
      onClick={() => !inert && onSelect(item.id)}
      tabIndex={inert ? -1 : undefined}
      aria-hidden={inert ? true : undefined}
      aria-current={isActive ? 'true' : undefined}
      className={`group relative flex w-full items-start gap-3 border-l-2 py-2 pl-4 text-left transition-all duration-300 sm:pl-5 ${
        isActive
          ? 'border-accent bg-white/10'
          : 'border-white/15 hover:border-white/40 hover:bg-white/5'
      }`}
    >
      <span
        className={`mt-0.5 shrink-0 font-serif text-base tabular-nums transition-colors sm:text-lg ${
          isActive ? 'text-accent' : 'text-white/35 group-hover:text-white/55'
        }`}
      >
        {number}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-semibold leading-snug transition-colors ${
            isActive ? 'text-white' : 'text-white/70 group-hover:text-white/90'
          }`}
        >
          {item.title}
        </span>
        <span
          className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide uppercase transition-colors ${
            isActive ? 'bg-accent/25 text-accent' : 'bg-white/10 text-white/50 group-hover:text-white/65'
          }`}
        >
          {item.category}
        </span>
      </span>
    </button>
  )
}

function CaseSpotlight({ item, height }) {
  return (
    <article
      style={height ? { height: `${height}px` } : undefined}
      className="animate-fade-up flex flex-col overflow-hidden rounded-sm bg-white shadow-xl shadow-brand/20 lg:h-full lg:flex-row"
    >
      <div className="relative h-48 shrink-0 sm:h-52 lg:h-full lg:w-[46%] lg:max-w-[300px] lg:shrink-0 xl:w-[48%] xl:max-w-[320px]">
        <img
          src={item.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/80 via-brand/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-brand/10 lg:to-brand/40"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:hidden">
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
            {item.category}
          </span>
          {item.abbr ? (
            <p className="mt-1.5 text-xs font-semibold tracking-[0.14em] text-white/80 uppercase">{item.abbr}</p>
          ) : null}
          <h3 className="mt-1.5 font-serif text-xl leading-tight text-white">{item.title}</h3>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-6">
        <div className="hidden shrink-0 lg:block">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-muted px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-brand uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {item.category}
          </span>
          {item.abbr ? (
            <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-brand uppercase">{item.abbr}</p>
          ) : null}
          <h3 className="mt-1.5 font-serif text-2xl leading-tight text-ink">{item.title}</h3>
        </div>

        <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-muted lg:mt-4">
          {item.paragraphs?.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        {item.therapyAreas?.length > 0 ? (
          <div className="mt-4 shrink-0 rounded-sm border border-slate-100 bg-surface-alt/80 px-3.5 py-4">
            <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">
              Areas commonly addressed in therapy
            </p>
            <ul className="mt-2 space-y-1.5">
              {item.therapyAreas.map((area) => (
                <li key={area} className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.bilingualNote ? (
          <p className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-muted px-3 py-1 text-[0.65rem] font-medium text-brand">
            <svg className="h-3 w-3 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-8.843 4.582" />
            </svg>
            {item.bilingualNote}
          </p>
        ) : null}

        <div className="mt-4 flex shrink-0 flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">Focus area</p>
            <p className="text-sm font-medium text-ink">{item.filterGroup ?? item.category}</p>
          </div>

          <a
            href="#contact"
            className="ml-auto inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2 text-[0.65rem] font-semibold tracking-wide text-white uppercase transition-colors hover:bg-accent-hover"
          >
            Consult
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}

function CompactCaseTile({ item, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? 'true' : undefined}
      className={`group relative overflow-hidden rounded-sm border text-left transition-all duration-300 ${
        isActive
          ? 'border-accent bg-white shadow-md ring-2 ring-accent/20'
          : 'border-white/20 bg-white/5 hover:border-white/35 hover:bg-white/10'
      }`}
    >
      <div className="flex items-stretch">
        <div className="relative w-16 shrink-0 overflow-hidden sm:w-20">
          <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className={`absolute inset-0 transition-colors ${isActive ? 'bg-accent/30' : 'bg-brand/50'}`}
            aria-hidden="true"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2.5 sm:px-4">
          <span className={`truncate text-xs font-semibold sm:text-sm ${isActive ? 'text-brand' : 'text-white/75'}`}>
            {item.title}
          </span>
          <span className={`mt-0.5 text-[0.6rem] font-semibold tracking-wide uppercase ${isActive ? 'text-accent' : 'text-white/45'}`}>
            {item.category}
          </span>
        </div>
      </div>
    </button>
  )
}

export default function ClinicalSpecializations() {
  const { casesWeServe, clinicalSpecializations } = useServicesContent()
  const filters = useMemo(
    () => ['All', ...new Set(clinicalSpecializations.map((item) => item.filterGroup).filter(Boolean))],
    [clinicalSpecializations],
  )

  const [activeFilter, setActiveFilter] = useState('All')
  const [activeId, setActiveId] = useState(clinicalSpecializations[0]?.id ?? '')
  const [browseHeight, setBrowseHeight] = useState(null)

  const browseRef = useRef(null)

  const filtered =
    activeFilter === 'All'
      ? clinicalSpecializations
      : clinicalSpecializations.filter((item) => item.filterGroup === activeFilter)

  const activeCase =
    clinicalSpecializations.find((item) => item.id === activeId) ?? clinicalSpecializations[0]

  useEffect(() => {
    if (!clinicalSpecializations.length) {
      setActiveId('')
      return
    }

    if (!clinicalSpecializations.some((item) => item.id === activeId)) {
      setActiveId(clinicalSpecializations[0].id)
    }
  }, [activeId, clinicalSpecializations])

  useEffect(() => {
    if (!filtered.some((item) => item.id === activeId)) {
      setActiveId(filtered[0]?.id ?? clinicalSpecializations[0]?.id ?? '')
    }
  }, [activeFilter, activeId, filtered, clinicalSpecializations])

  useLayoutEffect(() => {
    const el = browseRef.current
    if (!el) return undefined

    const update = () => setBrowseHeight(el.offsetHeight)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
  }

  const handleSelectCase = (id) => {
    setActiveId(id)
  }

  return (
    <section id="cases" className="relative overflow-hidden border-t border-brand/20">
      <div className="bg-gradient-to-br from-brand via-brand to-brand-light">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">Clinical Cases</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl">
              {casesWeServe.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
              {casesWeServe.intro}
            </p>
          </header>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all ${
                  activeFilter === filter
                    ? 'bg-accent text-white shadow-md shadow-accent/30'
                    : 'border border-white/25 bg-white/10 text-white/80 hover:border-white/40 hover:bg-white/15 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {filtered.length > 0 && activeCase ? (
            <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-[minmax(0,300px)_1fr] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,320px)_1fr] xl:gap-10">
              <aside className="hidden lg:grid lg:grid-cols-1">
                {/* Invisible sizer: always 6 rows so the detail card height stays fixed */}
                <div
                  ref={browseRef}
                  className="col-start-1 row-start-1 w-full pointer-events-none invisible"
                  aria-hidden="true"
                >
                  <p className="mb-2.5 text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">
                    Browse cases
                  </p>
                  <nav className="space-y-0.5">
                    {clinicalSpecializations.map((item, index) => (
                      <CaseNavItem
                        key={`sizer-${item.id}`}
                        item={item}
                        index={index}
                        isActive={false}
                        onSelect={() => {}}
                        inert
                      />
                    ))}
                  </nav>
                </div>

                <div className="col-start-1 row-start-1 w-full">
                  <p className="mb-2.5 text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">
                    Browse cases
                  </p>
                  <nav className="space-y-0.5" aria-label="Clinical cases">
                    {filtered.map((item, index) => (
                      <CaseNavItem
                        key={item.id}
                        item={item}
                        index={clinicalSpecializations.findIndex((c) => c.id === item.id)}
                        isActive={item.id === activeId}
                        onSelect={handleSelectCase}
                      />
                    ))}
                  </nav>
                </div>
              </aside>

              <div className="lg:hidden">
                <p className="mb-2.5 text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">
                  Browse cases
                </p>
                <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {filtered.map((item) => (
                    <CompactCaseTile
                      key={item.id}
                      item={item}
                      isActive={item.id === activeId}
                      onSelect={() => handleSelectCase(item.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                <CaseSpotlight item={activeCase} height={browseHeight} />
              </div>
            </div>
          ) : (
            <p className="mt-12 text-center text-white/70">No cases match this filter.</p>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-white/15 pt-8 sm:justify-between lg:mt-14">
            <p className="text-sm text-white/60">
              <span className="font-semibold text-accent">{filtered.length}</span>
              {' '}
              specialization{filtered.length !== 1 ? 's' : ''} shown
            </p>
            <a href="#contact" className={sectionLinkClassName}>
              Discuss your case
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
