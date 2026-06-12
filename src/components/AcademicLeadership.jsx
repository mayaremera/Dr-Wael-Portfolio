import { academicLeadership } from '../data/content'

export default function AcademicLeadership() {
  return (
    <section id="academic-leadership" className="border-t border-slate-200 bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{academicLeadership.label}</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{academicLeadership.title}</h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-muted md:text-base">{academicLeadership.intro}</p>
        </div>

        <div className="mt-10 rounded-sm border border-brand/15 bg-white p-6 shadow-sm lg:p-8">
          <p className="text-center text-xs font-semibold tracking-[0.18em] text-accent uppercase">
            Teaching & Scholarly Interests
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
            {academicLeadership.interests.map((interest) => (
              <li
                key={interest}
                className="rounded-full border border-brand/20 bg-brand-muted/50 px-4 py-2 text-sm font-medium text-brand"
              >
                {interest}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
