import { useDrWaelActivity } from '../hooks/useDrWaelActivity'

const scopeStyles = {
  International: {
    badge: 'bg-brand/10 text-brand border-brand/20',
    ring: 'from-brand/25 via-brand/5 to-transparent',
    seal: 'bg-brand text-white shadow-brand/25',
  },
  National: {
    badge: 'bg-accent/10 text-accent-hover border-accent/20',
    ring: 'from-accent/25 via-accent/5 to-transparent',
    seal: 'bg-accent text-white shadow-accent/25',
  },
  Regional: {
    badge: 'bg-brand-light/12 text-brand-light border-brand-light/25',
    ring: 'from-brand-light/25 via-brand-light/5 to-transparent',
    seal: 'bg-brand-light text-white shadow-brand-light/20',
  },
}

function MembershipSeal({ abbr, sealClass }) {
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center" aria-hidden="true">
      <span className="absolute inset-0 rounded-full border border-dashed border-brand/20" />
      <span className="absolute inset-1 rounded-full border border-brand/10" />
      <span
        className={`relative flex h-11 w-11 items-center justify-center rounded-full font-serif text-xs font-semibold tracking-wide sm:text-sm ${sealClass}`}
      >
        {abbr}
      </span>
    </div>
  )
}

function MembershipCard({ org }) {
  const style = scopeStyles[org.scope] ?? scopeStyles.International

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/10">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${style.ring}`}
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-4">
        <MembershipSeal abbr={org.abbr} sealClass={style.seal} />

        <div className="min-w-0 flex-1 pt-1">
          <span
            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.62rem] font-semibold tracking-[0.12em] uppercase ${style.badge}`}
          >
            {org.scope}
          </span>
          <h3 className="mt-3 font-serif text-lg leading-snug text-ink transition-colors group-hover:text-brand">
            {org.name}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            Active professional member
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </article>
  )
}

export default function ProfessionalMembership() {
  const { activity, isReady } = useDrWaelActivity()

  if (!isReady || !activity?.professionalMembership) return null

  const { label, title, intro, organizations } = activity.professionalMembership

  return (
    <section
      id="professional-membership"
      className="relative overflow-hidden border-t border-slate-200 bg-surface-alt py-16 lg:py-24"
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgb(26 77 92 / 0.07) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{label}</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted md:text-base">{intro}</p>
        </header>

        <div className="relative mt-12 rounded-[1.75rem] bg-gradient-to-br from-brand/20 via-accent/10 to-brand-light/20 p-px shadow-lg shadow-brand/10">
          <div className="rounded-[calc(1.75rem-1px)] bg-gradient-to-br from-white via-white to-brand-muted/20 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-center gap-3 border-b border-slate-200/70 pb-8">
              <span className="rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold text-brand">
                {organizations.length} active memberships
              </span>
              <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">
                International · National · Regional
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {organizations.map((org) => (
                <MembershipCard key={org.id} org={org} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
