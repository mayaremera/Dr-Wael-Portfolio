import { careerTimeline } from '../data/content'

const typeStyles = {
  education: {
    dot: 'bg-brand border-brand/30',
    badge: 'bg-brand/10 text-brand',
    card: 'border-brand/15 hover:border-brand/30',
  },
  clinical: {
    dot: 'bg-accent border-accent/30',
    badge: 'bg-accent/10 text-accent-hover',
    card: 'border-accent/15 hover:border-accent/30',
  },
  academic: {
    dot: 'bg-brand-light border-brand-light/30',
    badge: 'bg-brand-muted text-brand',
    card: 'border-brand-light/15 hover:border-brand-light/30',
  },
  leadership: {
    dot: 'bg-ink border-ink/20',
    badge: 'bg-surface-tint text-ink',
    card: 'border-slate-200 hover:border-slate-300',
  },
  honor: {
    dot: 'bg-accent border-accent/30',
    badge: 'bg-accent/15 text-accent-hover',
    card: 'border-accent/20 hover:border-accent/40',
  },
  research: {
    dot: 'bg-brand border-brand/30',
    badge: 'bg-brand-muted text-brand-light',
    card: 'border-brand/15 hover:border-brand/25',
  },
}

const typeLabels = {
  education: 'Education',
  clinical: 'Clinical',
  academic: 'Academic',
  leadership: 'Leadership',
  honor: 'Honor',
  research: 'Research',
}

export default function CareerTimeline() {
  return (
    <section id="timeline" className="border-t border-slate-200 bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Career Journey</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">A timeline of milestones</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted md:text-base">
            From doctoral training to global leadership — key moments that shaped Dr. Wael&apos;s clinical and academic path.
          </p>
        </header>

        <div className="relative mt-12 lg:mt-14">
          <div className="absolute top-0 bottom-0 left-4 w-px bg-linear-to-b from-brand/30 via-accent/25 to-brand/10 md:left-1/2 md:-translate-x-px" />

          <div className="space-y-8">
            {careerTimeline.map((item, index) => {
              const styles = typeStyles[item.type] ?? typeStyles.leadership
              const isEven = index % 2 === 0

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col md:flex-row ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="hidden w-1/2 md:block" />

                  <div
                    className={`absolute top-6 left-4 z-10 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white shadow-sm ${styles.dot} md:left-1/2`}
                  />

                  <div
                    className={`w-full pl-12 md:w-1/2 md:pl-0 ${
                      isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                    }`}
                  >
                    <article
                      className={`animate-fade-up rounded-sm border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${styles.card}`}
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div
                        className={`inline-flex items-center gap-2 ${isEven ? 'md:flex-row-reverse' : ''}`}
                      >
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.12em] uppercase ${styles.badge}`}
                        >
                          {typeLabels[item.type]}
                        </span>
                        <span className="text-xs font-semibold tracking-wide text-ink-muted">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="mt-3 font-serif text-lg text-ink md:text-xl">{item.title}</h3>
                      <p className="mt-1 text-sm font-medium text-brand">{item.org}</p>
                    </article>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
