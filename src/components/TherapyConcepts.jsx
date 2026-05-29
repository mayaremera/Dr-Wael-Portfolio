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
          <p className="text-md font-medium tracking-[0.2em] text-brand uppercase">
          Speech Language Pathologist Service You Can Choose
          </p>


        </div>

        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2">
          {therapyConcepts.map((concept) => {
            const Icon = iconMap[concept.icon]

            return (
              <article
                key={concept.id}
                className="group flex h-full gap-5 rounded-sm border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-brand/25 hover:shadow-md lg:p-8"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-muted transition-colors duration-300 group-hover:bg-brand lg:h-[5.5rem] lg:w-[5.5rem]">
                  <Icon
                    className="h-10 w-10 text-brand transition-colors duration-300 group-hover:text-white lg:h-12 lg:w-12"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="min-h-[3.5rem]">
                    <h3 className="font-sans text-xl font-bold leading-snug tracking-tight text-brand md:text-2xl">
                      {concept.title} — {concept.subtitle}
                    </h3>
                  </div>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted md:text-base">
                    {concept.summary}
                  </p>

                  <a
                    href="#contact"
                    className="mt-6 inline-block w-fit rounded-sm bg-brand px-5 py-2.5 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-light"
                  >
                    More Details
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
