import { useEffect, useState } from 'react'
import { testimonials } from '../data/content'

const PAGE_SIZE = 2

function NavPagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null

  return (
    <div className="mx-auto mt-10 flex max-w-sm items-center justify-between rounded-full border border-slate-200 bg-surface-alt px-5 py-2.5">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="Previous testimonials"
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold tracking-wide text-brand/70 uppercase transition-colors hover:text-brand disabled:pointer-events-none disabled:opacity-30"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Prev
      </button>

      <span className="text-xs font-medium tabular-nums text-ink-muted">
        {page + 1}
        <span className="text-ink-muted/40"> / </span>
        {pageCount}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount - 1}
        aria-label="Next testimonials"
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold tracking-wide text-brand/70 uppercase transition-colors hover:text-brand disabled:pointer-events-none disabled:opacity-30"
      >
        Next
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  )
}

function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className="h-4 w-4 fill-accent text-accent"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ item }) {
  const [revealed, setRevealed] = useState(false)
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(hover: hover)')
    const update = () => setCanHover(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const isRevealed = revealed

  const handleClick = () => {
    if (!canHover) setRevealed((current) => !current)
  }

  return (
    <blockquote
      tabIndex={canHover ? undefined : 0}
      role={canHover ? undefined : 'button'}
      aria-expanded={canHover ? undefined : isRevealed}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (!canHover && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          setRevealed((current) => !current)
        }
      }}
      className={`group/card relative flex h-[22rem] flex-col overflow-hidden rounded-sm border bg-white p-6 shadow-sm transition-[box-shadow,border-color] duration-300 sm:h-[23rem] sm:p-7 ${
        isRevealed
          ? 'border-brand/20 shadow-md shadow-brand/5'
          : 'border-slate-100 hover:border-brand/15 hover:shadow-md'
      } ${canHover ? '' : 'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand/40'}`}
    >
      <div
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand via-brand-light to-accent transition-transform duration-300 ease-out group-hover/card:scale-x-100"
        aria-hidden="true"
      />

      <span
        className="shrink-0 font-serif text-5xl leading-none text-brand/20 transition-colors duration-300 select-none group-hover/card:text-brand/25"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <div className="relative mt-2 min-h-0 flex-1">
        <p
          className={`text-sm leading-relaxed text-ink-muted transition-opacity duration-300 ease-out md:text-[0.9375rem] ${
            isRevealed
              ? 'pointer-events-none opacity-0'
              : 'line-clamp-4 opacity-100 group-hover/card:pointer-events-none group-hover/card:opacity-0'
          }`}
        >
          {item.quote}
        </p>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/90 to-transparent transition-opacity duration-300 ${
            isRevealed ? 'opacity-0' : 'opacity-100 group-hover/card:opacity-0'
          }`}
          aria-hidden="true"
        />

        <div
          className={`absolute inset-0 overflow-y-auto overscroll-contain transition-opacity duration-300 ease-out ${
            isRevealed ? 'opacity-100' : 'pointer-events-none opacity-0 group-hover/card:pointer-events-auto group-hover/card:opacity-100'
          }`}
        >
          <p className="pr-1 text-sm leading-relaxed text-ink-muted md:text-[0.9375rem]">{item.quote}</p>
        </div>

        <p
          className={`pointer-events-none absolute right-0 bottom-0 text-[0.6rem] font-semibold tracking-[0.16em] text-brand/45 uppercase transition-opacity duration-300 ${
            isRevealed ? 'opacity-0' : canHover ? 'opacity-100 group-hover/card:opacity-0' : 'opacity-100'
          }`}
        >
          {canHover ? 'Hover to read' : isRevealed ? '' : 'Tap to read'}
        </p>
      </div>

      <footer className="mt-4 flex shrink-0 items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-brand/15 transition-[box-shadow] duration-300 group-hover/card:ring-brand/30">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
            {item.location ? (
              <p className="truncate text-xs text-ink-muted">{item.location}</p>
            ) : null}
          </div>
        </div>
        <StarRating />
      </footer>
    </blockquote>
  )
}

export default function Testimonials() {
  const [page, setPage] = useState(0)

  const pageCount = Math.max(1, Math.ceil(testimonials.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageStart = safePage * PAGE_SIZE
  const pageItems = testimonials.slice(pageStart, pageStart + PAGE_SIZE)

  const handlePageChange = (nextPage) => {
    setPage(Math.max(0, Math.min(nextPage, pageCount - 1)))
  }

  return (
    <section id="testimonials" className="border-t border-slate-200 bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Testimonials</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">
            Voices of Trust from Families
          </h2>
          <div
            className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-brand via-brand-light to-accent"
            aria-hidden="true"
          />
        </header>

        <div key={safePage} className="animate-fade-up mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
          {pageItems.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>

        <NavPagination page={safePage} pageCount={pageCount} onPageChange={handlePageChange} />
      </div>
    </section>
  )
}
