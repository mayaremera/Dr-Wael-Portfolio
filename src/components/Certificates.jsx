import { certificates } from '../data/content'
import { IconAward } from './Icons'

export default function Certificates() {
  const featured = certificates.find((c) => c.featured)
  const others = certificates.filter((c) => !c.featured)

  return (
    <section id="certificates" className="border-t border-slate-200 bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-brand uppercase">
              Honors & Distinctions
            </p>
            <h2 className="mt-4 font-serif text-3xl font-medium text-ink md:text-4xl">
              Global credentials that speak for themselves
            </h2>
          </div>
        </div>

        {/* Featured honor — medallion style */}
        {featured && (
          <div className="mt-14 flex flex-col items-center lg:flex-row lg:items-stretch lg:gap-0">
            <div className="flex shrink-0 flex-col items-center justify-center rounded-t-sm border border-slate-200 border-b-0 bg-gradient-to-b from-brand-muted to-white px-10 py-12 lg:rounded-l-sm lg:rounded-tr-none lg:border-r-0 lg:border-b lg:py-16">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-brand/20" />
                <div className="absolute inset-2 rounded-full border border-dashed border-brand/30" />
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-brand text-center shadow-lg shadow-brand/20">
                  <IconAward className="h-10 w-10 text-white" />
                  <span className="mt-1 text-[10px] font-bold tracking-widest text-white/90 uppercase">
                    Fellow
                  </span>
                </div>
              </div>
              <p className="mt-6 text-center text-xs font-bold tracking-[0.2em] text-brand uppercase">
                Highest Honor · {featured.year}
              </p>
            </div>

            <div className="flex flex-1 flex-col justify-center rounded-b-sm border border-slate-200 bg-white p-8 lg:rounded-r-sm lg:rounded-bl-none lg:p-12">
              <h3 className="font-serif text-3xl text-ink md:text-4xl">{featured.title}</h3>
              <p className="mt-2 text-lg font-medium text-brand">{featured.issuer}</p>
              <p className="mt-6 max-w-2xl leading-relaxed text-ink-muted">
                {featured.description}
              </p>
              <p className="mt-8 text-sm text-ink-muted">
                Awarded to a select group of members worldwide who have advanced
                the field through outstanding contributions to communication sciences.
              </p>
            </div>
          </div>
        )}

        {/* Timeline of other honors */}
        <div className="mt-12">
          <p className="mb-8 text-center text-xs font-semibold tracking-[0.2em] text-ink-muted uppercase">
            Additional International Recognition
          </p>
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-4 w-px bg-brand/20 md:left-1/2 md:-translate-x-px" />

            <div className="space-y-8">
              {others.map((cert, index) => (
                <div
                  key={cert.id}
                  className={`relative flex flex-col md:flex-row ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="hidden w-1/2 md:block" />
                  <div
                    className={`absolute top-6 left-4 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-brand md:left-1/2`}
                  />

                  <div
                    className={`w-full pl-12 md:w-1/2 md:pl-0 ${
                      index % 2 === 0
                        ? 'md:pr-12 md:text-right'
                        : 'md:pl-12 md:text-left'
                    }`}
                  >
                    <article className="rounded-sm border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                      <span className="inline-block rounded-full bg-brand-muted px-3 py-0.5 text-xs font-semibold text-brand">
                        {cert.year}
                      </span>
                      <h4 className="mt-3 font-serif text-xl text-ink">{cert.title}</h4>
                      <p className="mt-1 text-sm font-medium text-brand">{cert.issuer}</p>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {cert.description}
                      </p>
                    </article>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
