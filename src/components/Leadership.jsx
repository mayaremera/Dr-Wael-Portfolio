import { clinicalSpecializations } from '../data/content'
import { useAboutContent } from '../hooks/useAboutContent'

const roleAccents = [
  {
    gradient: 'from-brand/12 via-brand/6 to-transparent',
    border: 'border-brand/20',
    year: 'text-brand',
    glow: 'bg-brand/8',
  },
  {
    gradient: 'from-accent/12 via-accent/6 to-transparent',
    border: 'border-accent/20',
    year: 'text-accent-hover',
    glow: 'bg-accent/8',
  },
  {
    gradient: 'from-brand-light/12 via-brand-light/6 to-transparent',
    border: 'border-brand-light/20',
    year: 'text-brand-light',
    glow: 'bg-brand-light/8',
  },
  {
    gradient: 'from-ink/8 via-ink/4 to-transparent',
    border: 'border-slate-200',
    year: 'text-ink-muted',
    glow: 'bg-ink/5',
  },
  {
    gradient: 'from-accent/10 via-brand/6 to-transparent',
    border: 'border-accent/15',
    year: 'text-accent-hover',
    glow: 'bg-accent/6',
  },
]

const specDots = ['bg-brand', 'bg-accent', 'bg-brand-light', 'bg-ink-muted']

export default function Leadership() {
  const { leadershipRoles } = useAboutContent()

  return (
    <section id="leadership" className="relative overflow-hidden border-t border-slate-200 bg-surface-alt py-16 lg:py-20">
      <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-48 w-48 rounded-full bg-accent/12 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">
              Leadership & Research
            </p>
            <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
              Advancing the field through clinical and academic excellence
            </h2>
            <p className="mt-5 leading-relaxed text-ink-muted">
              Dr. Wael&apos;s work spans direct patient care at Psych Care Complex,
              university teaching at Alfaisal University, and international
              professional leadership — ensuring families benefit from both
              cutting-edge research and decades of hands-on clinical wisdom.
            </p>

            <div className="mt-10 rounded-sm border border-brand/15 bg-white/70 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Clinical Specializations
              </p>
              <ul className="mt-4 space-y-3">
                {clinicalSpecializations.map((area, index) => (
                  <li
                    key={area.id}
                    className="group flex items-start gap-3 text-ink-muted transition-colors duration-300 hover:text-ink"
                  >
                    <span
                      className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125 ${specDots[index % specDots.length]}`}
                    />
                    <span>
                      <span className="font-medium text-ink">{area.title}</span>
                      {' — '}
                      {area.excerpt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            {leadershipRoles.map((role, index) => {
              const accent = roleAccents[index % roleAccents.length]

              return (
                <div
                  key={`${role.title}-${role.year}`}
                  className={`animate-fade-up relative overflow-hidden rounded-sm border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${accent.border}`}
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-linear-to-r ${accent.gradient}`}
                    aria-hidden="true"
                  />
                  <div
                    className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full ${accent.glow} blur-xl`}
                    aria-hidden="true"
                  />

                  <p className={`relative text-xs font-semibold tracking-[0.18em] uppercase ${accent.year}`}>
                    {role.year}
                  </p>
                  <h3 className="relative mt-2 font-serif text-xl text-ink">{role.title}</h3>
                  <p className="relative mt-1 text-sm font-medium text-brand">{role.org}</p>
                  <p className="relative mt-2 text-sm leading-relaxed text-ink-muted">{role.note}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
