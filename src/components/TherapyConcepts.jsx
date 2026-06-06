import {
  casesWeServe,
  clinicalSpecializations,
  speechLanguageServices,
  therapyConcepts,
} from '../data/content'
import ClinicalSpecializations from './ClinicalSpecializations'
import ContactButton from './ContactButton'

const cardLinkClassName =
  'relative mt-4 inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

const sectionLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

const serviceAccents = [
  {
    bar: 'bg-brand',
    overlay: 'from-brand/80 via-brand/25 to-brand/5',
    cta: 'bg-brand hover:bg-brand-light',
  },
  {
    bar: 'bg-brand-light',
    overlay: 'from-brand/80 via-brand/25 to-brand/5',
    cta: 'bg-brand hover:bg-brand-light',
  },
  {
    bar: 'bg-accent',
    overlay: 'from-brand/80 via-brand/25 to-brand/5',
    cta: 'bg-accent hover:bg-accent-hover',
  },
  {
    bar: 'bg-accent',
    overlay: 'from-brand/80 via-brand/25 to-brand/5',
    cta: 'bg-accent hover:bg-accent-hover',
  },
]

function ServiceCardImage({ src, alt }) {
  return (
    <div className="relative h-36 w-full shrink-0 sm:h-auto sm:min-h-full sm:w-[38%] sm:max-w-[180px] sm:self-stretch">
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-brand/20 via-transparent to-transparent"
        aria-hidden="true"
      />
    </div>
  )
}

function ServiceDetailCard({ concept, index }) {
  const accent = serviceAccents[index % serviceAccents.length]

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/10">
      <div className={`h-1 shrink-0 ${accent.bar}`} aria-hidden="true" />

      <div className="relative aspect-[5/2] overflow-hidden sm:aspect-[2/1]">
        <img
          src={concept.image}
          alt={`${concept.title}, ${concept.subtitle}`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className={`pointer-events-none absolute inset-0 bg-linear-to-t ${accent.overlay}`} />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <h3 className="font-serif text-2xl leading-tight text-white sm:text-[1.65rem]">{concept.title}</h3>
          <p className="mt-1 text-sm font-medium text-white/85">{concept.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-ink md:text-[0.9375rem]">{concept.summary}</p>

        {concept.paragraphs?.length > 0 ? (
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            {concept.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}

        {concept.bullets?.length > 0 ? (
          <ul className="mt-4 space-y-2 rounded-sm bg-surface-alt px-4 py-3.5">
            {concept.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-ink-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-5">
          <ContactButton href="#contact">Contact Us Now</ContactButton>
        </div>
      </div>
    </article>
  )
}

function CasesPreviewRail({ cases }) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-brand/10 bg-gradient-to-br from-brand-muted/70 via-white to-surface-alt p-5 sm:p-8 lg:p-10">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/8 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-8 left-1/4 h-32 w-32 rounded-full bg-accent/15 blur-2xl"
        aria-hidden="true"
      />

      <ol className="relative space-y-5 sm:space-y-6">
        {cases.map((item, index) => (
          <li key={item.id} className="group relative flex gap-4 sm:gap-5">
            {index < cases.length - 1 ? (
              <span
                className="absolute left-[1.125rem] top-11 bottom-[-1.25rem] w-px bg-gradient-to-b from-brand/35 to-brand/10 sm:left-5 sm:top-12"
                aria-hidden="true"
              />
            ) : null}

            <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-white font-serif text-base text-brand shadow-sm transition-colors duration-300 group-hover:border-accent group-hover:text-accent sm:h-10 sm:w-10 sm:text-lg">
              {String(index + 1).padStart(2, '0')}
            </div>

            <article className="flex min-w-0 flex-1 overflow-hidden rounded-sm border border-slate-100/90 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-brand/25 group-hover:shadow-lg group-hover:shadow-brand/10 sm:flex-row">
              <div className="relative h-28 w-full shrink-0 sm:h-auto sm:w-[38%] sm:max-w-[200px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/50 via-transparent to-transparent sm:bg-gradient-to-r sm:from-brand/40"
                  aria-hidden="true"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[0.6rem] font-bold tracking-[0.12em] text-brand uppercase shadow-sm">
                  {item.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-center px-4 py-4 sm:px-5 sm:py-5">
                <h4 className="font-serif text-lg leading-snug text-ink sm:text-xl">{item.title}</h4>
                {item.abbr ? (
                  <p className="mt-1 text-[0.65rem] font-semibold tracking-[0.12em] text-brand uppercase">
                    {item.abbr}
                  </p>
                ) : null}
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{item.excerpt}</p>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function TherapyConcepts({ showCasesPreview = false, fullDetail = false }) {
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

          <div className={`grid items-stretch gap-6 ${fullDetail ? 'md:grid-cols-2' : 'gap-4 md:grid-cols-2'}`}>
            {therapyConcepts.map((concept, index) =>
              fullDetail ? (
                <ServiceDetailCard key={concept.id} concept={concept} index={index} />
              ) : (
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
              ),
            )}
          </div>

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

              <CasesPreviewRail cases={clinicalSpecializations.slice(0, 3)} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
    {fullDetail ? <ClinicalSpecializations /> : null}
    </>
  )
}
