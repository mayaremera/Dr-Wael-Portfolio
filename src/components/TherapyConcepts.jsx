import { useServicesContent } from '../hooks/useServicesContent'
import ClinicalSpecializations from './ClinicalSpecializations'
import ContactButton from './ContactButton'
import { hasMediaSrc } from '../lib/mediaUrl'

const cardLinkClassName =
  'relative mt-4 inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

const sectionLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

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
    <div className="relative h-36 w-full shrink-0 sm:h-auto sm:min-h-full sm:w-[38%] sm:max-w-[180px] sm:self-stretch">
      {hasMediaSrc(src) ? (
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
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

function ServiceDetailCard({ concept, index }) {
  const accent = serviceAccents[index % serviceAccents.length]
  const step = String(index + 1).padStart(2, '0')
  const reversed = index % 2 === 1
  const hasBullets = (concept.bullets?.length ?? 0) > 0

  const imageWrapClass = hasBullets
    ? reversed
      ? 'relative m-5 min-h-[200px] overflow-hidden rounded-xl sm:m-6 lg:my-6 lg:ml-0 lg:mr-6 lg:min-h-0 lg:flex-1'
      : 'relative m-5 min-h-[200px] overflow-hidden rounded-xl sm:m-6 lg:my-6 lg:mr-0 lg:ml-6 lg:min-h-0 lg:flex-1'
    : 'relative m-5 min-h-[200px] overflow-hidden rounded-xl sm:m-6 lg:mb-6 lg:aspect-5/4 lg:min-h-[300px]'

  return (
    <article
      className="animate-fade-up group relative overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_-12px_rgba(26,77,92,0.18)] ring-1 ring-slate-200/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-16px_rgba(26,77,92,0.22)] hover:ring-brand/20"
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
        <div className={`relative lg:w-[44%] xl:w-[42%] ${hasBullets ? 'lg:flex lg:flex-col' : ''}`}>
          <div className={imageWrapClass}>
            {hasMediaSrc(concept.image) ? (
              <img
                src={concept.image}
                alt={`${concept.title}, ${concept.subtitle}`}
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-100" aria-hidden="true" />
            )}
            <div className={`pointer-events-none absolute inset-0 bg-linear-to-t ${accent.imageOverlay}`} />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]"
              aria-hidden="true"
            />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:hidden">
              <span className={`inline-flex rounded-full border px-3 py-1 text-[0.65rem] font-semibold tracking-[0.14em] uppercase ${accent.badge}`}>
                Step {step}
              </span>
              <h3 className="mt-2 font-serif text-2xl leading-tight text-white">{concept.title}</h3>
              <p className="mt-1 text-sm font-medium text-white/85">{concept.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col px-5 pb-6 sm:px-7 sm:pb-8 lg:py-8 lg:pr-8 lg:pl-6 xl:py-10 xl:pr-10">
          <div>
            <span className={`inline-flex rounded-full border px-3 py-1 text-[0.65rem] font-semibold tracking-[0.16em] uppercase ${accent.badge}`}>
              Step {step}
            </span>
          </div>

          <div className="mt-4 hidden lg:block">
            <h3 className="font-serif text-3xl leading-tight text-ink xl:text-[2rem]">{concept.title}</h3>
            <p className="mt-1.5 text-base font-medium text-brand">{concept.subtitle}</p>
          </div>

          <blockquote className="relative mt-5 border-l-[3px] border-accent/50 py-1 pl-5 sm:pl-6">
            <span
              className="pointer-events-none absolute -top-3 left-3 font-serif text-4xl leading-none text-accent/25 select-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="font-serif text-lg leading-relaxed text-ink/90 italic sm:text-xl">{concept.summary}</p>
          </blockquote>

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
  )
}

function CasesPreviewGrid({ cases }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map((item) => (
        <article
          key={item.id}
          className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-md hover:shadow-brand/10"
        >
          <div className="relative h-36 w-full shrink-0 overflow-hidden">
            {hasMediaSrc(item.image) ? (
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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

          <div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
            <h4 className="font-serif text-lg leading-snug text-ink">{item.title}</h4>
            {item.abbr ? (
              <p className="mt-1 text-[0.65rem] font-semibold tracking-[0.12em] text-brand uppercase">
                {item.abbr}
              </p>
            ) : null}
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{item.excerpt}</p>
          </div>
        </article>
      ))}
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

  const displayConcepts = fullDetail
    ? therapyConcepts
    : therapyConcepts.filter((concept) => !concept.pageOnly)
  const ctaHref = showCasesPreview ? '/services' : '#contact'

  return (
    <>
    <section id="approach" className="border-t border-slate-200 bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Services</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">
            {fullDetail ? speechLanguageServices.title : 'Speech-Language Pathology Services'}
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
            <div className="relative flex flex-col gap-6 lg:gap-8">
              {therapyConcepts.map((concept, index) => (
                <ServiceDetailCard key={concept.id} concept={concept} index={index} />
              ))}
            </div>
          ) : (
            <div className="grid items-stretch gap-4 md:grid-cols-2">
              {displayConcepts.map((concept) => (
                <article
                  key={concept.id}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-md sm:flex-row"
                >
                  <ServiceCardImage
                    src={concept.image}
                    alt={`${concept.title}, ${concept.subtitle}`}
                  />

                  <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-5 lg:p-6">
                    <h3 className="font-serif text-lg leading-snug text-ink sm:text-xl">
                      {concept.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-brand">{concept.subtitle}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{concept.summary}</p>
                    <a href={ctaHref} className={cardLinkClassName}>
                      More Details
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          {showCasesPreview ? (
            <div className="mt-12 border-t border-slate-100 pt-10">
              <header className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Clinical cases</p>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-ink md:text-3xl">
                  {casesWeServe.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{casesWeServe.intro}</p>
              </header>

              <div className="mt-8 mb-4 flex justify-end">
                <a href="/services#cases" className={sectionLinkClassName}>
                  View all cases
                </a>
              </div>

              <CasesPreviewGrid cases={clinicalSpecializations} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
    {fullDetail ? <ClinicalSpecializations /> : null}
    </>
  )
}
