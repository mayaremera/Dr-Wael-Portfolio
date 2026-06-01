import { useMemo, useState } from 'react'

const CERTIFICATE_COUNT = 50
const PAGE_SIZE = 9
const MAX_VISIBLE_PAGES = 5

function buildCertificates() {
  return Array.from({ length: CERTIFICATE_COUNT }, (_, index) => {
    const id = index + 1
    const certificateLabel = `Certificate ${String(id).padStart(2, '0')}`
    const encodedLabel = encodeURIComponent(certificateLabel)
    return {
      id,
      title: certificateLabel,
      issuer: 'Professional Development',
      description: 'Advanced clinical training and continuing professional education in speech-language pathology.',
      image: `https://dummyimage.com/900x650/f8f4ea/1a4d5c.png&text=${encodedLabel}`,
    }
  })
}

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
    <div className="mt-10 border-t border-white/20 pt-6">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="rounded-full border border-white/35 bg-white/10 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-35"
      >
        Previous
      </button>

      {visiblePages[0] > 0 ? (
        <>
          <button
            type="button"
            onClick={() => onChange(0)}
            className="h-8 w-8 rounded-full border border-white/30 bg-white/10 text-xs font-semibold text-white/90 transition-colors hover:bg-white/20"
          >
            1
          </button>
          {visiblePages[0] > 1 ? <span className="px-1 text-white/50">...</span> : null}
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
              ? 'border-accent bg-accent text-white shadow-md shadow-accent/35'
              : 'border-white/30 bg-white/10 text-white/85 hover:bg-white/20'
          }`}
        >
          {pageNumber + 1}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < pageCount - 1 ? (
        <>
          {visiblePages[visiblePages.length - 1] < pageCount - 2 ? (
            <span className="px-1 text-white/50">...</span>
          ) : null}
          <button
            type="button"
            onClick={() => onChange(pageCount - 1)}
            className="h-8 w-8 rounded-full border border-white/30 bg-white/10 text-xs font-semibold text-white/90 transition-colors hover:bg-white/20"
          >
            {pageCount}
          </button>
        </>
      ) : null}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount - 1}
        className="rounded-full border border-white/35 bg-white/10 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-35"
      >
        Next
      </button>
      </div>

      <p className="mt-4 text-center text-xs tracking-wide text-white/70">
        Showing page <span className="font-semibold text-accent">{page + 1}</span> of {pageCount}
      </p>
    </div>
  )
}

export default function CertificationGallery() {
  const [page, setPage] = useState(0)
  const certificates = useMemo(() => buildCertificates(), [])

  const pageCount = Math.ceil(certificates.length / PAGE_SIZE)
  const safePage = Math.min(page, Math.max(pageCount - 1, 0))
  const start = safePage * PAGE_SIZE
  const pageItems = certificates.slice(start, start + PAGE_SIZE)

  const handlePageChange = (nextPage) => {
    setPage(Math.max(0, Math.min(nextPage, pageCount - 1)))
  }

  return (
    <section id="certifications" className="relative overflow-hidden border-t border-brand/20 bg-surface py-16 lg:py-20">
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-12 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-sm border border-brand/20 bg-linear-to-br from-brand via-brand-light to-brand p-6 shadow-xl shadow-brand/25 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(240,138,93,0.22),transparent_40%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.14),transparent_42%)]" />

          <div className="text-center">
            <p className="relative text-xs font-semibold tracking-[0.22em] text-accent uppercase">Highlighted Collection</p>
            <h2 className="relative mt-3 font-serif text-3xl text-white md:text-4xl">Certificates & Training Archive</h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
              A curated showcase of Dr. Wael&apos;s ongoing professional development and recognized achievements.
            </p>
            <div className="relative mx-auto mt-5 h-1 w-14 rounded-full bg-linear-to-r from-accent to-white/80" />
            <div className="relative mx-auto mt-5 inline-flex items-center gap-3 rounded-full border border-white/35 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="text-xs font-semibold tracking-[0.16em] text-white/80 uppercase">Total Certificates</span>
              <span className="rounded-full bg-accent px-3 py-1 text-lg leading-none font-bold text-white shadow-md shadow-accent/35 sm:text-xl">
                {certificates.length}
              </span>
            </div>
          </div>

          <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((certificate) => (
              <article
                key={certificate.id}
                className="group relative overflow-hidden rounded-sm border border-white/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg hover:shadow-black/15"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent opacity-35 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
                    <p className="text-xs font-semibold tracking-[0.14em] text-white uppercase">{certificate.title}</p>
                    <p className="mt-1 text-xs text-white/85">{certificate.description}</p>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-linear-to-r from-brand via-brand-light to-accent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </article>
            ))}
          </div>

          <Pagination page={safePage} pageCount={pageCount} onChange={handlePageChange} />
        </div>
      </div>
    </section>
  )
}
