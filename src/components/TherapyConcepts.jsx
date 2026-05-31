import { therapyConcepts } from '../data/content'

const cardLinkClassName =
  'relative mt-4 inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

const sectionLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

function ServiceCardImage({ src, alt }) {
  return (
    <div className="relative h-36 w-full shrink-0 sm:h-auto sm:min-h-full sm:w-[34%] sm:max-w-[150px] sm:self-stretch lg:max-w-[165px]">
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-white"
        aria-hidden="true"
      />
    </div>
  )
}

export default function TherapyConcepts() {
  return (
    <section id="approach" className="border-t border-slate-200 bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Services</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">
            Speech-Language Pathology Services
          </h2>
          <div
            className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-brand via-brand-light to-accent"
            aria-hidden="true"
          />
        </div>

        <div className="mt-10">
          <div className="mb-4 flex justify-end">
            <a href="#contact" className={sectionLinkClassName}>
              View all services
            </a>
          </div>

          <div className="grid items-stretch gap-4 md:grid-cols-2">
          {therapyConcepts.map((concept) => (
            <article
              key={concept.id}
              className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-100 bg-white shadow-sm transition-all hover:border-brand/25 hover:shadow-md sm:flex-row"
            >
              <ServiceCardImage
                src={concept.image}
                alt={`${concept.title} — ${concept.subtitle}`}
              />

              <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-5">
                <h3 className="font-sans text-lg font-bold leading-snug tracking-tight text-brand">
                  {concept.title}
                  <span className="font-normal text-ink-muted"> — </span>
                  <span className="font-semibold text-brand/90">{concept.subtitle}</span>
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {concept.summary}
                </p>

                <a href="#contact" className={cardLinkClassName}>
                  More Details
                </a>
              </div>
            </article>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
