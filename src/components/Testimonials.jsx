import { useState } from 'react'
import { testimonials, testimonialsSection } from '../data/content'

const sectionLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

const showcaseLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-accent uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out hover:text-white hover:after:scale-x-100'

function excerpt(quote, max = 88) {
  if (quote.length <= max) return quote
  const slice = quote.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  return `${(lastSpace > 40 ? slice.slice(0, lastSpace) : slice).trim()}…`
}

const VOICES_PAGE_SIZE = 3

function VoiceSliderNav({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null

  return (
    <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="Previous voices"
        className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-semibold tracking-wide text-white/70 uppercase transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
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
        aria-label="Next voices"
        className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-semibold tracking-wide text-white/70 uppercase transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
      >
        Next
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  )
}

function VoiceSelector({ item, index, isActive, onSelect, inert = false }) {
  return (
    <button
      type="button"
      onClick={() => !inert && onSelect(index)}
      tabIndex={inert ? -1 : undefined}
      aria-hidden={inert ? true : undefined}
      aria-current={isActive ? 'true' : undefined}
      className={`group relative flex w-full items-center gap-3 rounded-sm border px-3 py-3 text-left transition-all duration-300 sm:gap-4 sm:px-4 sm:py-3.5 ${
        isActive
          ? 'border-accent/50 bg-white/12 shadow-lg shadow-black/10'
          : 'border-transparent bg-white/5 hover:border-white/20 hover:bg-white/8'
      }`}
    >
      <span
        className={`absolute top-1/2 -left-px h-8 w-0.5 -translate-y-1/2 rounded-full bg-accent transition-opacity ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      <div
        className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 transition-all duration-300 sm:h-12 sm:w-12 ${
          isActive ? 'ring-accent scale-105' : 'ring-white/25 group-hover:ring-white/40'
        }`}
      >
        <img src={item.image} alt="" className="h-full w-full object-cover object-top" />
      </div>

      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-sm font-semibold transition-colors ${
            isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
          }`}
        >
          {item.name}
        </span>
        {item.location ? (
          <span className="mt-0.5 block truncate text-xs text-white/50">{item.location}</span>
        ) : (
          <span className="mt-0.5 block truncate text-xs text-white/40">{excerpt(item.quote, 42)}</span>
        )}
      </span>

      <span
        className={`shrink-0 font-serif text-lg tabular-nums transition-colors ${
          isActive ? 'text-accent' : 'text-white/25'
        }`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
    </button>
  )
}

function VoicesNavSizer() {
  const sizerItems = testimonials.slice(0, VOICES_PAGE_SIZE)

  return (
    <>
      <p className="mb-3 text-xs font-semibold tracking-wide text-white/45 uppercase">Choose a voice</p>
      <div className="flex flex-col gap-2">
        {sizerItems.map((item, index) => (
          <VoiceSelector
            key={`sizer-${item.id}`}
            item={item}
            index={index}
            isActive={false}
            onSelect={() => {}}
            inert
          />
        ))}
      </div>
      <div
        className="mt-3 flex h-10 items-center justify-between border-t border-white/15 pt-3"
        aria-hidden="true"
      >
        <span className="text-xs opacity-0">Prev</span>
        <span className="text-xs opacity-0">1 / 2</span>
        <span className="text-xs opacity-0">Next</span>
      </div>
    </>
  )
}

function TestimonialsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [voicesPage, setVoicesPage] = useState(0)
  const active = testimonials[activeIndex]

  const voicesPageCount = Math.max(1, Math.ceil(testimonials.length / VOICES_PAGE_SIZE))
  const safeVoicesPage = Math.min(voicesPage, voicesPageCount - 1)
  const voicesPageStart = safeVoicesPage * VOICES_PAGE_SIZE
  const voicesPageItems = testimonials.slice(voicesPageStart, voicesPageStart + VOICES_PAGE_SIZE)
  const placeholderCount = Math.max(0, VOICES_PAGE_SIZE - voicesPageItems.length)
  const placeholderItems = testimonials.slice(0, placeholderCount)

  const handleSelectVoice = (index) => {
    setActiveIndex(index)
    setVoicesPage(Math.floor(index / VOICES_PAGE_SIZE))
  }

  const handleVoicesPageChange = (nextPage) => {
    const clamped = Math.max(0, Math.min(nextPage, voicesPageCount - 1))
    setVoicesPage(clamped)
    const pageStart = clamped * VOICES_PAGE_SIZE
    if (activeIndex < pageStart || activeIndex >= pageStart + VOICES_PAGE_SIZE) {
      setActiveIndex(pageStart)
    }
  }

  return (
    <section id="testimonials" className="relative overflow-hidden border-t border-brand/15">
      <div className="bg-gradient-to-br from-brand via-[#1e5566] to-brand-light">
        <div
          className="pointer-events-none absolute -left-20 top-1/4 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-white/8 blur-3xl"
          aria-hidden="true"
        />
        <p
          className="pointer-events-none absolute top-6 right-6 font-serif text-[5rem] leading-none text-white/[0.04] select-none sm:text-[6rem] lg:right-10"
          aria-hidden="true"
        >
          &ldquo;
        </p>

        <div className="relative mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-14">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              {testimonialsSection.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-white md:text-3xl">
              {testimonialsSection.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70 line-clamp-2 md:line-clamp-none">
              {testimonialsSection.description}
            </p>
          </header>

          <div className="mt-8 mb-4 flex justify-end">
            <a href="/testimonials" className={showcaseLinkClassName}>
              Read all family stories
            </a>
          </div>

          <div className="lg:grid lg:grid-cols-[minmax(0,280px)_1fr] lg:items-stretch lg:gap-8 xl:grid-cols-[minmax(0,300px)_1fr] xl:gap-10">
            <div className="grid min-w-0 grid-cols-1">
              <div
                className="pointer-events-none invisible col-start-1 row-start-1 hidden min-w-0 lg:block"
                aria-hidden="true"
              >
                <VoicesNavSizer />
              </div>

              <div className="col-start-1 row-start-1 min-w-0 lg:col-start-1 lg:row-start-1">
                <p className="text-xs font-semibold tracking-wide text-white/45 uppercase lg:hidden">
                  Choose a voice
                </p>
                <p className="mb-3 hidden text-xs font-semibold tracking-wide text-white/45 uppercase lg:block">
                  Choose a voice
                </p>

                <nav className="flex flex-col gap-2 lg:mt-0" aria-label="Select a testimonial">
                  {voicesPageItems.map((item, localIndex) => {
                    const globalIndex = voicesPageStart + localIndex
                    return (
                      <VoiceSelector
                        key={item.id}
                        item={item}
                        index={globalIndex}
                        isActive={globalIndex === activeIndex}
                        onSelect={handleSelectVoice}
                      />
                    )
                  })}
                  {placeholderItems.map((item, localIndex) => (
                    <div
                      key={`pad-${item.id}`}
                      className="hidden pointer-events-none invisible lg:block"
                      aria-hidden="true"
                    >
                      <VoiceSelector
                        item={item}
                        index={voicesPageStart + voicesPageItems.length + localIndex}
                        isActive={false}
                        onSelect={() => {}}
                        inert
                      />
                    </div>
                  ))}
                </nav>

                <VoiceSliderNav
                  page={safeVoicesPage}
                  pageCount={voicesPageCount}
                  onPageChange={handleVoicesPageChange}
                />
              </div>
            </div>

            <div className="mt-8 flex min-h-0 min-w-0 flex-col lg:mt-0">
              <article
                key={active.id}
                className="animate-testimonial-spotlight relative flex h-full min-h-0 flex-col overflow-hidden rounded-sm bg-white shadow-xl shadow-black/20"
              >
                <div
                  className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-accent/15 to-transparent"
                  aria-hidden="true"
                />

                <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
                  <div className="flex shrink-0 items-center border-b border-slate-100 pb-3">
                    <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-brand uppercase">
                      {String(activeIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                    </p>
                  </div>

                  <div className="mt-3 flex shrink-0 flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 pr-2">
                      <h3 className="font-serif text-xl text-ink sm:text-2xl">{active.name}</h3>
                      {active.location ? (
                        <p className="mt-0.5 text-sm text-ink-muted">{active.location}</p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 gap-0.5" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-accent" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <blockquote className="relative mt-4 flex min-h-0 flex-1 flex-col">
                    <span
                      className="absolute -top-1 -left-0.5 font-serif text-5xl leading-none text-brand/12 select-none"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </span>
                    <p className="relative min-h-0 flex-1 overflow-y-auto pr-1 text-sm leading-relaxed text-ink-muted sm:text-[0.9375rem]">
                      {active.quote}
                    </p>
                  </blockquote>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function GalleryCard({ item, index }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="group flex h-full min-h-[32rem] flex-col overflow-hidden rounded-sm border border-slate-100 bg-white shadow-sm transition-shadow duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/10 sm:min-h-[34rem]">
      <div className="relative h-52 shrink-0 overflow-hidden sm:h-56">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-top" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand/75 via-brand/20 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="font-serif text-2xl text-white">{item.name}</p>
          {item.location ? (
            <p className="mt-1 text-sm text-white/85">{item.location}</p>
          ) : null}
        </div>
        <span className="absolute top-4 right-4 font-serif text-4xl text-white/30">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-7">
        <p
          className={`min-h-0 flex-1 text-base leading-relaxed text-ink-muted ${
            expanded ? 'overflow-y-auto' : 'line-clamp-[10]'
          }`}
        >
          {item.quote}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 shrink-0 w-fit text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:text-brand-light"
        >
          {expanded ? 'Show less' : 'Read full story'}
        </button>
      </div>
    </article>
  )
}

function TestimonialsGallery() {
  return (
    <section id="testimonials" className="border-t border-slate-200 bg-surface-alt py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            {testimonialsSection.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">
            Every story, in full
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            {testimonialsSection.description}
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:gap-8">
          {testimonials.map((item, index) => (
            <GalleryCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Testimonials({ variant = 'showcase' }) {
  if (variant === 'gallery') {
    return <TestimonialsGallery />
  }

  return <TestimonialsShowcase />
}
