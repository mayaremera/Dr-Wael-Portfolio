import { clinicalExpertise } from '../data/content'

export default function ClinicalExpertiseSection() {
  return (
    <section id="clinical-expertise" className="border-t border-slate-200 bg-surface-alt py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{clinicalExpertise.label}</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{clinicalExpertise.title}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted md:text-base">{clinicalExpertise.intro}</p>
          </div>

          <div className="rounded-sm border border-brand/15 bg-white p-6 shadow-sm lg:p-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Areas of Expertise</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {clinicalExpertise.areas.map((area) => (
                <li
                  key={area.name}
                  className="flex items-start gap-3 rounded-lg border border-slate-200/80 bg-surface-alt/60 px-4 py-3 transition-colors hover:border-brand/20 hover:bg-brand-muted/30"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>
                    <span className="block text-sm font-medium text-ink">{area.name}</span>
                    {area.abbr ? (
                      <span className="mt-0.5 block text-[0.65rem] font-semibold tracking-wide text-brand uppercase">
                        {area.abbr}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
