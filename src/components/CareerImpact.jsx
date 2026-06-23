import { useAboutContent } from '../hooks/useAboutContent'

const statAccents = [
  'border-brand/20 bg-brand-muted/40',
  'border-accent/20 bg-accent/5',
  'border-brand-light/20 bg-brand/5',
  'border-slate-200 bg-white',
]

export default function CareerImpact() {
  const { careerImpact } = useAboutContent()

  return (
    <section id="career-impact" className="border-t border-slate-200 bg-surface-alt py-14 lg:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{careerImpact.label}</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{careerImpact.title}</h2>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {careerImpact.stats.map((stat, index) => (
            <article
              key={stat.label}
              className={`rounded-sm border p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${statAccents[index % statAccents.length]}`}
            >
              <p className="font-serif text-3xl tabular-nums text-brand md:text-4xl">{stat.value}</p>
              <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-ink uppercase">{stat.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{stat.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
