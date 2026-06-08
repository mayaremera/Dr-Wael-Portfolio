import { useState } from 'react'
import { useAboutContent } from '../hooks/useAboutContent'

const PAGE_SIZE = 9
const MAX_VISIBLE_PAGES = 5

function getVisiblePages(currentPage, pageCount) {
  if (pageCount <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: pageCount }, (_, index) => index)
  }

  const half = Math.floor(MAX_VISIBLE_PAGES / 2)
  let start = Math.max(0, currentPage - half)
  const end = Math.min(pageCount, start + MAX_VISIBLE_PAGES)

  if (end - start < MAX_VISIBLE_PAGES) {
    start = Math.max(0, end - MAX_VISIBLE_PAGES)
  }

  return Array.from({ length: end - start }, (_, index) => start + index)
}

function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null

  const visiblePages = getVisiblePages(page, pageCount)

  return (
    <div className="mt-10 border-t border-slate-200/80 pt-6">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 0}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.12em] text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand disabled:pointer-events-none disabled:opacity-35"
        >
          Previous
        </button>

        {visiblePages[0] > 0 ? (
          <>
            <button
              type="button"
              onClick={() => onChange(0)}
              className="h-8 w-8 rounded-full border border-slate-200 bg-white text-xs font-semibold text-ink-muted transition-colors hover:border-brand/25 hover:text-brand"
            >
              1
            </button>
            {visiblePages[0] > 1 ? <span className="px-1 text-ink-muted/50">...</span> : null}
          </>
        ) : null}

        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onChange(pageNumber)}
            aria-current={pageNumber === page ? 'true' : undefined}
            className={`h-8 w-8 rounded-full border text-xs font-semibold transition-colors ${
              pageNumber === page
                ? 'border-brand bg-brand text-white shadow-sm shadow-brand/20'
                : 'border-slate-200 bg-white text-ink-muted hover:border-brand/25 hover:text-brand'
            }`}
          >
            {pageNumber + 1}
          </button>
        ))}

        {visiblePages[visiblePages.length - 1] < pageCount - 1 ? (
          <>
            {visiblePages[visiblePages.length - 1] < pageCount - 2 ? (
              <span className="px-1 text-ink-muted/50">...</span>
            ) : null}
            <button
              type="button"
              onClick={() => onChange(pageCount - 1)}
              className="h-8 w-8 rounded-full border border-slate-200 bg-white text-xs font-semibold text-ink-muted transition-colors hover:border-brand/25 hover:text-brand"
            >
              {pageCount}
            </button>
          </>
        ) : null}

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= pageCount - 1}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.12em] text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand disabled:pointer-events-none disabled:opacity-35"
        >
          Next
        </button>
      </div>

      <p className="mt-4 text-center text-xs tracking-wide text-ink-muted">
        Showing page <span className="font-semibold text-brand">{page + 1}</span> of {pageCount}
      </p>
    </div>
  )
}

export default function CertificationGallery() {
  const { certificates } = useAboutContent()
  const [page, setPage] = useState(0)

  const pageCount = Math.ceil(certificates.length / PAGE_SIZE)
  const safePage = Math.min(page, Math.max(pageCount - 1, 0))
  const start = safePage * PAGE_SIZE
  const pageItems = certificates.slice(start, start + PAGE_SIZE)

  const handlePageChange = (nextPage) => {
    setPage(Math.max(0, Math.min(nextPage, pageCount - 1)))
  }

  return (
    <section id="certifications" className="border-t border-slate-200 bg-surface-alt py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Highlighted Collection</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">Certificates & Training Archive</h2>
          <div className="mx-auto mt-5 inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white px-4 py-2 shadow-sm">
            <span className="text-xs font-semibold tracking-[0.16em] text-ink-muted uppercase">Total Certificates</span>
            <span className="rounded-full bg-brand px-3 py-1 text-lg leading-none font-bold text-white sm:text-xl">
              {certificates.length}
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((certificate) => (
            <article
              key={certificate.id}
              className="group relative overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md hover:shadow-brand/15"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src={certificate.image}
                  alt={certificate.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 translate-y-full border-t border-white/25 bg-brand p-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
                  <p className="text-xs font-semibold tracking-[0.14em] text-white uppercase">{certificate.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/85">{certificate.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <Pagination page={safePage} pageCount={pageCount} onChange={handlePageChange} />
      </div>
    </section>
  )
}
