import { useState } from 'react'
import { clinicalSpecializations } from '../data/content'

const filters = ['All', 'Autism', 'ADHD', 'Language', 'Speech', 'Apraxia', 'Fluency']
const NAV_PAGE_SIZE = 4

const sectionLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out hover:text-accent hover:after:scale-x-100'

function CaseNavItem({ item, index, isActive, onSelect }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-current={isActive ? 'true' : undefined}
      className={`group relative flex w-full items-start gap-3 border-l-2 py-2.5 pl-4 text-left transition-all duration-300 sm:pl-5 ${
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
          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide uppercase transition-colors ${
            isActive ? 'bg-accent/25 text-accent' : 'bg-white/10 text-white/50 group-hover:text-white/65'
          }`}
        >
          {item.category}
        </span>
      </span>
    </button>
  )
}

function NavPagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null

  return (
    <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="Previous cases"
        className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-semibold tracking-wide text-white/70 uppercase transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Prev
      </button>

      <span className="text-xs tabular-nums text-white/50">
        {page + 1}
        <span className="text-white/30"> / </span>
        {pageCount}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount - 1}
        aria-label="Next cases"
        className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-semibold tracking-wide text-white/70 uppercase transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
      >
        Next
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  )
}

function CaseSpotlight({ item }) {
  return (
    <article className="animate-fade-up flex h-full min-h-[380px] flex-col overflow-hidden rounded-sm bg-white shadow-xl shadow-brand/20 lg:min-h-0 lg:flex-row">
      <div className="relative min-h-[220px] flex-1 sm:min-h-[260px] lg:min-h-full lg:max-w-[52%]">
        <img
          src={item.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/80 via-brand/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-brand/10 lg:to-brand/40"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:hidden">
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
            {item.category}
          </span>
          <h3 className="mt-3 font-serif text-2xl leading-tight text-white">{item.title}</h3>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-10">
        <div className="hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-muted px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-brand uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {item.category}
          </span>
          <h3 className="mt-4 font-serif text-3xl leading-tight text-ink xl:text-4xl">{item.title}</h3>
        </div>

        <p className="mt-4 text-base leading-relaxed text-ink-muted lg:mt-6 lg:text-[1.05rem] lg:leading-relaxed">
          {item.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6 lg:mt-8">
          <div>
            <p className="text-xs font-semibold tracking-wide text-brand uppercase">Focus area</p>
            <p className="text-sm font-medium text-ink">{item.category}</p>
          </div>

          <a
            href="#contact"
            className="ml-auto inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-accent-hover"
          >
            Consult
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

        <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-3 sm:px-4">
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
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeIndex, setActiveIndex] = useState(0)
  const [navPage, setNavPage] = useState(0)

  const filtered =
    activeFilter === 'All'
      ? clinicalSpecializations
      : clinicalSpecializations.filter((item) => item.category === activeFilter)

  const safeIndex = Math.min(activeIndex, Math.max(filtered.length - 1, 0))
  const activeCase = filtered[safeIndex]

  const navPageCount = Math.max(1, Math.ceil(filtered.length / NAV_PAGE_SIZE))
  const safeNavPage = Math.min(navPage, navPageCount - 1)
  const navPageStart = safeNavPage * NAV_PAGE_SIZE
  const navPageItems = filtered.slice(navPageStart, navPageStart + NAV_PAGE_SIZE)

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setActiveIndex(0)
    setNavPage(0)
  }

  const handleSelectCase = (globalIndex) => {
    setActiveIndex(globalIndex)
    setNavPage(Math.floor(globalIndex / NAV_PAGE_SIZE))
  }

  const handleNavPageChange = (nextPage) => {
    const clamped = Math.max(0, Math.min(nextPage, navPageCount - 1))
    setNavPage(clamped)

    const pageStart = clamped * NAV_PAGE_SIZE
    if (safeIndex < pageStart || safeIndex >= pageStart + NAV_PAGE_SIZE) {
      setActiveIndex(pageStart)
    }
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
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">Clinical Cases</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl">
              Conditions we specialize in
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
              Evidence-based intervention across a wide range of speech, language, and communication disorders.
            </p>
            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
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
            <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-[minmax(0,320px)_1fr] lg:items-stretch lg:gap-8 xl:gap-10">
              <aside className="hidden lg:flex lg:flex-col">
                <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">
                  Browse cases
                </p>
                <nav className="flex flex-1 flex-col space-y-0.5" aria-label="Clinical cases">
                  {navPageItems.map((item, localIndex) => {
                    const globalIndex = navPageStart + localIndex
                    return (
                      <CaseNavItem
                        key={item.id}
                        item={item}
                        index={globalIndex}
                        isActive={globalIndex === safeIndex}
                        onSelect={handleSelectCase}
                      />
                    )
                  })}
                </nav>
                <NavPagination
                  page={safeNavPage}
                  pageCount={navPageCount}
                  onPageChange={handleNavPageChange}
                />
              </aside>

              <div className="lg:hidden">
                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-2">
                  {navPageItems.map((item, localIndex) => {
                    const globalIndex = navPageStart + localIndex
                    return (
                      <CompactCaseTile
                        key={item.id}
                        item={item}
                        isActive={globalIndex === safeIndex}
                        onSelect={() => handleSelectCase(globalIndex)}
                      />
                    )
                  })}
                </div>
                <NavPagination
                  page={safeNavPage}
                  pageCount={navPageCount}
                  onPageChange={handleNavPageChange}
                />
              </div>

              <div className="min-w-0 lg:flex lg:flex-col" key={activeCase.id}>
                <CaseSpotlight item={activeCase} />
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
