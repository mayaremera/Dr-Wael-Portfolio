import { useMemo, useRef, useState, useEffect } from 'react'
import { useAboutContent } from '../hooks/useAboutContent'
import { getCertificateDisplayImage } from '../data/aboutContentStore'
import { scrollPaginationSectionIntoView } from '../lib/scrollPaginationSection'
import LazySection from './LazySection'

const PAGE_SIZE = 9
const MAX_VISIBLE_PAGES = 5
const SEAM = '2px'

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

/** Place items into columns in order; ties go left so the first row fills L→R. */
function distributeToColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => [])
  const heights = Array.from({ length: columnCount }, () => 0)

  for (const item of items) {
    let shortest = 0
    for (let index = 1; index < columnCount; index += 1) {
      if (heights[index] < heights[shortest]) shortest = index
    }
    columns[shortest].push(item)
    heights[shortest] += 1
  }

  return columns
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

function CertificateTile({ certificate, isActive, onToggle }) {
  const imageSrc = getCertificateDisplayImage(certificate)

  return (
    <article
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      onClick={() => onToggle(certificate.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onToggle(certificate.id)
        }
      }}
      className="group relative cursor-pointer overflow-hidden bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-alt lg:cursor-default"
    >
      <div className="relative overflow-hidden bg-surface-alt">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={certificate.title}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex aspect-4/3 w-full items-center justify-center px-4 text-center text-xs font-medium tracking-wide text-ink-muted uppercase">
            Certificate image
          </div>
        )}

        <div
          className={`absolute inset-x-0 bottom-0 border-t border-white/25 bg-brand p-4 transition-transform duration-300 ease-out ${
            isActive ? 'max-lg:translate-y-0' : 'max-lg:translate-y-full'
          } lg:translate-y-full lg:group-hover:translate-y-0`}
        >
          <p className="text-xs font-semibold tracking-[0.14em] text-white uppercase">{certificate.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/85">{certificate.description}</p>
        </div>
      </div>
    </article>
  )
}

export default function CertificationGallery() {
  const { isReady, certificates, certificatesSection } = useAboutContent()
  const [page, setPage] = useState(0)
  const [activeCertId, setActiveCertId] = useState(null)
  const sectionRef = useRef(null)
  const [columnCount, setColumnCount] = useState(1)
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const tabletMq = window.matchMedia('(min-width: 640px)')
    const desktopMq = window.matchMedia('(min-width: 1024px)')

    const sync = () => {
      if (desktopMq.matches) setColumnCount(3)
      else if (tabletMq.matches) setColumnCount(2)
      else setColumnCount(1)
      setIsCompact(!desktopMq.matches)
    }

    requestAnimationFrame(sync)
    tabletMq.addEventListener('change', sync)
    desktopMq.addEventListener('change', sync)
    return () => {
      tabletMq.removeEventListener('change', sync)
      desktopMq.removeEventListener('change', sync)
    }
  }, [])

  const pageCount = Math.ceil((certificates?.length ?? 0) / PAGE_SIZE)
  const safePage = Math.min(page, Math.max(pageCount - 1, 0))
  const start = safePage * PAGE_SIZE
  const pageItems = (certificates ?? []).slice(start, start + PAGE_SIZE)
  const columns = useMemo(() => distributeToColumns(pageItems, columnCount), [pageItems, columnCount])

  const handlePageChange = (nextPage) => {
    setActiveCertId(null)
    setPage(Math.max(0, Math.min(nextPage, pageCount - 1)))

    if (!isCompact) {
      scrollPaginationSectionIntoView(sectionRef)
    }
  }

  const toggleCertificate = (certificateId) => {
    setActiveCertId((current) => (current === certificateId ? null : certificateId))
  }

  if (!isReady || !certificatesSection) return null

  const { label, title } = certificatesSection

  return (
    <section ref={sectionRef} id="certifications" className="scroll-mt-28 border-t border-slate-200 bg-surface-alt py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{label}</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{title}</h2>
          <div className="mx-auto mt-5 inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white px-4 py-2 shadow-sm">
            <span className="text-xs font-semibold tracking-[0.16em] text-ink-muted uppercase">Featured Collection</span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs tracking-wide text-ink-muted lg:hidden">
          Tap a certificate to view details
        </p>

        <LazySection minHeight="20rem">
          <div
            key={`${safePage}-${columnCount}`}
            className="mt-10 grid"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              gap: SEAM,
            }}
          >
            {columns.map((columnItems, columnIndex) => (
              <div key={columnIndex} className="flex min-w-0 flex-col" style={{ gap: SEAM }}>
                {columnItems.map((certificate) => (
                  <CertificateTile
                    key={certificate.id}
                    certificate={certificate}
                    isActive={activeCertId === certificate.id}
                    onToggle={toggleCertificate}
                  />
                ))}
              </div>
            ))}
          </div>

          <Pagination page={safePage} pageCount={pageCount} onChange={handlePageChange} />
        </LazySection>
      </div>
    </section>
  )
}
