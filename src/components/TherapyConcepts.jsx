import { useRef } from 'react'
import { useServicesContent } from '../hooks/useServicesContent'
import { useState } from 'react'
import ClinicalSpecializations from './ClinicalSpecializations'
import ContactButton from './ContactButton'
import { hasMediaSrc } from '../lib/mediaUrl'

const cardLinkClassName =
  'relative mt-4 inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

const sectionLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

function truncatePreviewText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  const slice = text.slice(0, maxLength)
  const lastSpace = slice.lastIndexOf(' ')
  const trimmed = (lastSpace > maxLength * 0.55 ? slice.slice(0, lastSpace) : slice).trim()
  return `${trimmed}...`
}

const serviceAccents = [
  {
    badge: 'border-brand/15 bg-brand/8 text-brand',
    glow: 'from-brand/20 via-brand/5',
    imageOverlay: 'from-brand/85 via-brand/25 to-brand/5',
    bullet: 'bg-brand/10 text-brand',
  },
  {
    badge: 'border-brand-light/15 bg-brand-light/8 text-brand-light',
    glow: 'from-brand-light/20 via-brand/5',
    imageOverlay: 'from-brand-light/80 via-brand/20 to-transparent',
    bullet: 'bg-brand-light/10 text-brand-light',
  },
  {
    badge: 'border-accent/20 bg-accent/10 text-accent-hover',
    glow: 'from-accent/15 via-brand/5',
    imageOverlay: 'from-brand/80 via-accent/25 to-transparent',
    bullet: 'bg-accent/10 text-accent-hover',
  },
  {
    badge: 'border-brand/15 bg-brand/8 text-brand',
    glow: 'from-brand/20 via-brand/5',
    imageOverlay: 'from-brand/85 via-brand/25 to-brand/5',
    bullet: 'bg-brand/10 text-brand',
  },
]

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 8.5l3 3 6-7" />
    </svg>
  )
}

function ServiceCardImage({ src, alt }) {
  return (
    <div className="relative aspect-square w-full shrink-0 overflow-hidden lg:w-[42%] lg:max-w-[11.5rem] lg:self-center">
      {hasMediaSrc(src) ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-100" aria-hidden="true" />
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-brand/20 via-transparent to-transparent"
        aria-hidden="true"
      />
    </div>
  )
}

function MobileServiceDetailCard({ concept, index }) {
  const accent = serviceAccents[index % serviceAccents.length]
  const [expanded, setExpanded] = useState(false)
  const hasExtra = (concept.paragraphs?.length ?? 0) > 0 || (concept.bullets?.length ?? 0) > 0

  return (
    <article
      className="animate-fade-up overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm lg:hidden"
      style={{ animationDelay: `${Math.min(index * 0.08, 0.4)}s` }}
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        {hasMediaSrc(concept.image) ? (
          <img
            src={concept.image}
            alt={`${concept.title}, ${concept.subtitle}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-100" aria-hidden="true" />
        )}
        <div className={`pointer-events-none absolute inset-0 bg-linear-to-t ${accent.imageOverlay}`} />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-serif text-lg leading-snug text-white">{concept.title}</h3>
          <p className="mt-0.5 text-xs font-medium text-white/85">{concept.subtitle}</p>
        </div>
      </div>

      <div className="p-4">
        <blockquote className="relative border-l-2 border-accent/40 py-0.5 pl-3">
          <p className={`font-serif text-sm leading-relaxed text-ink/90 italic ${expanded ? '' : 'line-clamp-3'}`}>
            {concept.summary}
          </p>
        </blockquote>

        {expanded ? (
          <>
            {concept.paragraphs?.length > 0 ? (
              <div className="mt-3 space-y-2">
                {concept.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-ink-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {concept.bullets?.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {concept.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm leading-snug text-ink-muted">
                    <span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${accent.bullet}`}>
                      <CheckIcon />
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}

        {hasExtra ? (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="mt-2 text-[0.62rem] font-semibold tracking-wide text-brand uppercase"
            aria-expanded={expanded}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        ) : null}

        <div className="mt-4 border-t border-slate-100 pt-4">
          <ContactButton href="/contact" className="w-full justify-center text-center">
            {concept.ctaLabel || 'Contact Us Now'}
          </ContactButton>
        </div>
      </div>
    </article>
  )
}

function ServiceDetailCard({ concept, index }) {
  const accent = serviceAccents[index % serviceAccents.length]
  const reversed = index % 2 === 1

  const imageWrapClass = reversed
    ? 'relative m-5 aspect-[5/4] overflow-hidden rounded-xl sm:m-6 lg:my-6 lg:ml-0 lg:mr-6'
    : 'relative m-5 aspect-[5/4] overflow-hidden rounded-xl sm:m-6 lg:my-6 lg:mr-0 lg:ml-6'

  return (
    <>
      <MobileServiceDetailCard concept={concept} index={index} />

      <article
      className="animate-fade-up group relative hidden overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_-12px_rgba(26,77,92,0.18)] ring-1 ring-slate-200/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-16px_rgba(26,77,92,0.22)] hover:ring-brand/20 lg:block"
      style={{ animationDelay: `${Math.min(index * 0.08, 0.4)}s` }}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${accent.glow} to-transparent opacity-60`}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-muted/30 blur-3xl transition-transform duration-700 group-hover:scale-110"
        aria-hidden="true"
      />

      <div className={`relative flex flex-col lg:items-stretch ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
        <div className="relative lg:w-[44%] xl:w-[42%]">
          <div className={imageWrapClass}>
            {hasMediaSrc(concept.image) ? (
              <img
                src={concept.image}
                alt={`${concept.title}, ${concept.subtitle}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-100" aria-hidden="true" />
            )}
            <div className={`pointer-events-none absolute inset-0 bg-linear-to-t ${accent.imageOverlay}`} />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]"
              aria-hidden="true"
            />

            <div className="absolute inset-x-0 bottom-0 hidden p-5 sm:p-6 lg:hidden">
              <h3 className="font-serif text-2xl leading-tight text-white">{concept.title}</h3>
              <p className="mt-1 text-sm font-medium text-white/85">{concept.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col px-5 pb-6 sm:px-7 sm:pb-8 lg:py-8 lg:pr-8 lg:pl-6 xl:py-10 xl:pr-10">
          <div className="hidden lg:block">
            <h3 className="font-serif text-3xl leading-tight text-ink xl:text-[2rem]">{concept.title}</h3>
            <p className="mt-1.5 text-base font-medium text-brand">{concept.subtitle}</p>
          </div>

          {concept.paragraphs?.length > 0 ? (
            <div className="mt-6 space-y-3.5">
              {concept.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-ink-muted sm:text-[0.9375rem]">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          {concept.bullets?.length > 0 ? (
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {concept.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-surface-alt/80 px-3.5 py-3 transition-colors duration-300 group-hover:border-brand/10 group-hover:bg-brand-muted/30"
                >
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${accent.bullet}`}>
                    <CheckIcon />
                  </span>
                  <span className="text-sm leading-snug text-ink-muted">{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-auto flex items-center gap-4 border-t border-slate-100 pt-6">
            <ContactButton href="/contact" className="group/btn shadow-sm shadow-brand/15">
              {concept.ctaLabel || 'Contact Us Now'}
              <svg
                viewBox="0 0 20 20"
                className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10h10m0 0l-3-3m3 3l-3 3" />
              </svg>
            </ContactButton>
          </div>
        </div>
      </div>
    </article>
    </>
  )
}

function CasesPreviewGrid({ cases }) {
  const scrollRef = useRef(null)
  const isDown = useRef(false)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftStart = useRef(0)

  const snapToCard = () => {
    const container = scrollRef.current
    if (!container) return
    const item = container.querySelector('.mobile-card-scroll__item')
    if (!item) return
    const itemWidth = item.getBoundingClientRect().width
    const style = getComputedStyle(container)
    const gap = parseFloat(style.gap || '0')
    const cardAndGap = itemWidth + gap
    
    const scrollLeft = container.scrollLeft
    const currentIndex = Math.round(scrollLeft / cardAndGap)
    
    container.scrollTo({
      left: currentIndex * cardAndGap,
      behavior: 'smooth'
    })
  }

  const scrollSlider = (direction) => {
    const container = scrollRef.current
    if (!container) return
    const item = container.querySelector('.mobile-card-scroll__item')
    if (!item) return
    const itemWidth = item.getBoundingClientRect().width
    const style = getComputedStyle(container)
    const gap = parseFloat(style.gap || '0')
    const cardAndGap = itemWidth + gap

    const scrollLeft = container.scrollLeft
    const currentIndex = Math.round(scrollLeft / cardAndGap)
    const targetIndex = currentIndex + direction

    container.scrollTo({
      left: targetIndex * cardAndGap,
      behavior: 'smooth'
    })
  }

  const handleMouseDown = (e) => {
    if (e.button !== 0) return // Only left-click drags
    const container = scrollRef.current
    if (!container) return
    isDown.current = true
    isDragging.current = false
    container.style.scrollSnapType = 'none'
    container.style.scrollBehavior = 'auto'
    startX.current = e.pageX - container.offsetLeft
    scrollLeftStart.current = container.scrollLeft
  }

  const handleMouseLeave = () => {
    if (!isDown.current) return
    isDown.current = false
    const container = scrollRef.current
    if (!container) return
    container.style.scrollSnapType = ''
    container.style.scrollBehavior = ''
    snapToCard()
  }

  const handleMouseUp = () => {
    if (!isDown.current) return
    isDown.current = false
    const container = scrollRef.current
    if (!container) return
    container.style.scrollSnapType = ''
    container.style.scrollBehavior = ''
    snapToCard()
  }

  const handleMouseMove = (e) => {
    if (!isDown.current) return
    isDragging.current = true
    e.preventDefault()
    const container = scrollRef.current
    if (!container) return
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX.current) * 1.5
    container.scrollLeft = scrollLeftStart.current - walk
  }

  const handleCardClick = () => {
    if (isDragging.current) {
        isDragging.current = false
        return
    }
    window.location.href = '/services'
  }

  return (
    <div className="cases-slider relative">
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="home-cases-grid mobile-card-scroll cursor-grab active:cursor-grabbing select-none"
      >
        {cases.map((item) => (
          <article
            key={item.id}
            onClick={handleCardClick}
            className="mobile-card-scroll__item group flex h-full max-lg:h-[20rem] flex-col overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-md hover:shadow-brand/10 lg:h-auto lg:w-auto cursor-pointer"
          >
            <div className="relative h-36 w-full shrink-0 overflow-hidden">
              {hasMediaSrc(item.image) ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 lg:object-center"
                  draggable="false"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-100" aria-hidden="true" />
              )}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/50 via-transparent to-transparent"
                aria-hidden="true"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[0.6rem] font-bold tracking-[0.12em] text-brand uppercase shadow-sm">
                {item.category}
              </span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
              <h4 className="line-clamp-2 min-h-[2.75rem] shrink-0 font-serif text-lg leading-snug text-ink">
                {item.title}
              </h4>
              <p className="mt-1 line-clamp-1 min-h-[0.875rem] shrink-0 text-[0.65rem] font-semibold tracking-[0.12em] text-brand uppercase">
                {item.abbr || '\u00A0'}
              </p>
              <p className="mt-2 shrink-0 text-sm leading-relaxed text-ink-muted lg:hidden">
                {truncatePreviewText(item.homepageExcerpt || item.excerpt, 100)}
              </p>
              <p className="mt-2 hidden text-sm leading-relaxed text-ink-muted lg:block line-clamp-3">
                {item.homepageExcerpt || item.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollSlider(-1)}
        aria-label="Previous cases"
        className="cases-slider-arrow cases-slider-arrow--prev"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => scrollSlider(1)}
        aria-label="Next cases"
        className="cases-slider-arrow cases-slider-arrow--next"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  )
}

export default function TherapyConcepts({ showCasesPreview = false, fullDetail = false }) {
  const {
    isReady,
    speechLanguageServices,
    therapyConcepts,
    casesWeServe,
    clinicalSpecializations,
  } = useServicesContent()

  if (!isReady || !speechLanguageServices) return null

  const displayConcepts = therapyConcepts
  const ctaHref = showCasesPreview ? '/services' : '#contact'

  return (
    <>
    <section id="approach" className="border-t border-slate-200 bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Services</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">
            {speechLanguageServices.title}
          </h2>
          {fullDetail ? (
            <>
              <p className="mt-3 text-lg font-medium text-brand">{speechLanguageServices.tagline}</p>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                {speechLanguageServices.intro}
              </p>
            </>
          ) : null}
        </header>

        <div className="mt-10">
          {showCasesPreview ? (
            <div className="mb-4 flex justify-end">
              <a href="/services" className={sectionLinkClassName}>
                View all services
              </a>
            </div>
          ) : fullDetail ? null : (
            <div className="mb-4 flex justify-end">
              <a href="#contact" className={sectionLinkClassName}>
                View all services
              </a>
            </div>
          )}

          {fullDetail ? (
            <div className="relative flex flex-col gap-4 lg:gap-8">
              {therapyConcepts.map((concept, index) => (
                <ServiceDetailCard key={concept.id} concept={concept} index={index} />
              ))}
            </div>
          ) : (
            <div className="mobile-card-scroll lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-4">
              {displayConcepts.map((concept) => (
                <article
                  key={concept.id}
                  className="mobile-card-scroll__item mobile-card-scroll__item--service group flex max-lg:h-[20rem] h-full flex-col overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-md lg:h-auto lg:w-auto lg:flex-row"
                >
                  <ServiceCardImage
                    src={concept.homepageImage || concept.image}
                    alt={`${concept.title}, ${concept.subtitle}`}
                  />

                  <div className="flex min-h-0 min-w-0 flex-1 flex-col p-4 sm:p-5 lg:justify-center lg:p-6">
                    <h3 className="line-clamp-2 shrink-0 font-serif text-lg leading-snug text-ink sm:text-xl">
                      {concept.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 shrink-0 text-sm font-medium text-brand">{concept.subtitle}</p>
                    <p className="mt-2 shrink-0 text-sm leading-relaxed text-ink-muted lg:hidden">
                      {truncatePreviewText(concept.summary)}
                    </p>
                    <p className="mt-2 hidden text-sm leading-relaxed text-ink-muted lg:block">
                      {concept.summary}
                    </p>
                    <a href={ctaHref} className={`${cardLinkClassName} mt-auto shrink-0 pt-3`}>
                      More Details
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          {showCasesPreview ? (
            <div className="mt-12 border-t border-slate-100 pt-10 max-lg:mt-14 max-lg:border-slate-300 max-lg:border-t-2 lg:mt-12 lg:border-t lg:border-slate-100">
              <header className="mx-auto max-w-3xl text-center">
                <p className="whitespace-nowrap text-xs font-semibold tracking-[0.18em] text-brand uppercase sm:tracking-[0.22em]">
                  Clinical Expertise
                </p>
                <h3 className="mt-3 text-balance font-serif text-2xl leading-tight text-ink md:text-3xl">
                  {casesWeServe.title}
                </h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-muted">
                  {casesWeServe.intro?.replace(/\s+([^\s]+)\s*$/, '\u00A0$1')}
                </p>
              </header>

              <div className="mt-8 mb-4 flex justify-end">
                <a href="/services#cases" className={sectionLinkClassName}>
                  View all cases
                </a>
              </div>

              <CasesPreviewGrid cases={clinicalSpecializations.slice(0, 10)} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
    {fullDetail ? <ClinicalSpecializations /> : null}
    </>
  )
}
