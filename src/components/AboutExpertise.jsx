import { academicLeadership, clinicalExpertise } from '../data/content'

export default function AboutExpertise() {
  return (
    <section id="expertise-overview" className="border-t border-slate-200 bg-surface-alt py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{clinicalExpertise.label}</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{clinicalExpertise.title}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted md:text-base">{clinicalExpertise.intro}</p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {clinicalExpertise.areas.map((area) => (
                <li
                  key={area.name}
                  className="flex items-start gap-2 rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-ink-muted"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{area.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{academicLeadership.label}</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{academicLeadership.title}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted md:text-base">{academicLeadership.intro}</p>

            <div className="mt-6 rounded-sm border border-brand/15 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Teaching & Scholarly Interests
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {academicLeadership.interests.map((interest) => (
                  <li
                    key={interest}
                    className="rounded-full border border-brand/15 bg-brand-muted/40 px-3 py-1.5 text-sm font-medium text-brand"
                  >
                    {interest}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
