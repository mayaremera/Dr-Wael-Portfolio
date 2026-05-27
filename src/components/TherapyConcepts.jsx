import { therapyConcepts } from '../data/content'
import {
  IconScreening,
  IconCounseling,
  IconAssessment,
  IconTreatment,
} from './Icons'

const iconMap = {
  screening: IconScreening,
  counseling: IconCounseling,
  assessment: IconAssessment,
  treatment: IconTreatment,
}

export default function TherapyConcepts() {
  return (
    <section id="approach" className="border-t border-slate-200 bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] text-brand uppercase">
            Your Child&apos;s Journey
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium text-ink md:text-4xl">
            How speech-language therapy works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-muted">
            A clear path from your first question to meaningful progress — four
            connected steps designed around your family.
          </p>
        </div>

        {/* Journey timeline — desktop */}
        <div className="relative mt-16 hidden lg:block">
          <div className="absolute top-[52px] right-[12%] left-[12%] h-px bg-gradient-to-r from-brand/20 via-brand to-brand/20" />
          <div className="grid grid-cols-4 gap-6">
            {therapyConcepts.map((concept, index) => {
              const Icon = iconMap[concept.icon]
              return (
                <div key={concept.id} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full border-2 border-brand bg-white shadow-md shadow-brand/10">
                    <Icon className="h-7 w-7 text-brand" />
                    <span className="mt-1 font-serif text-sm text-brand">
                      {concept.step}
                    </span>
                  </div>
                  {index < therapyConcepts.length - 1 && (
                    <div className="absolute top-[52px] -right-3 z-0 text-brand/40">
                      →
                    </div>
                  )}
                  <h3 className="mt-6 font-serif text-xl text-ink">{concept.title}</h3>
                  <p className="mt-1 text-xs font-medium tracking-wide text-brand uppercase">
                    {concept.subtitle}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detail cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-20">
          {therapyConcepts.map((concept) => {
            const Icon = iconMap[concept.icon]
            return (
              <article
                key={concept.id}
                className="group relative overflow-hidden rounded-sm border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-brand/30 hover:shadow-md"
              >
                <div className="absolute top-0 left-0 h-1 w-full origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />

                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-muted text-brand">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-lg text-brand/60">
                        {concept.step}
                      </span>
                      <h3 className="font-serif text-2xl text-ink">{concept.title}</h3>
                    </div>
                    <p className="mt-1 text-sm font-medium text-brand">
                      {concept.subtitle}
                    </p>
                  </div>
                </div>

                <p className="mt-5 leading-relaxed text-ink">{concept.summary}</p>

                <ul className="mt-5 space-y-2.5">
                  {concept.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 rounded-sm border border-slate-200/80 bg-surface-alt px-3 py-2.5 text-sm text-ink-muted"
                    >
                      <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
