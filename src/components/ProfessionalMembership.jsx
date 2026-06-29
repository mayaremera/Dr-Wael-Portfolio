import { useMemo, useState } from 'react'
import { useDrWaelActivity } from '../hooks/useDrWaelActivity'

const SCOPE_FILTERS = ['All', 'International', 'National', 'Regional']

const scopeStyles = {
  International: {
    badge: 'bg-brand/10 text-brand border-brand/20',
    ring: 'from-brand/25 via-brand/5 to-transparent',
    accent: 'from-brand via-brand/60 to-brand/15',
    seal: 'bg-brand text-white shadow-brand/25',
  },
  National: {
    badge: 'bg-accent/10 text-accent-hover border-accent/20',
    ring: 'from-accent/25 via-accent/5 to-transparent',
    accent: 'from-accent via-accent/60 to-accent/15',
    seal: 'bg-accent text-white shadow-accent/25',
  },
  Regional: {
    badge: 'bg-brand-light/12 text-brand-light border-brand-light/25',
    ring: 'from-brand-light/25 via-brand-light/5 to-transparent',
    accent: 'from-brand-light via-brand-light/60 to-brand-light/15',
    seal: 'bg-brand-light text-white shadow-brand-light/20',
  },
}

function MembershipSeal({ abbr, sealClass, compact = false }) {
  if (compact) {
    return (
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border border-dashed border-brand/20" />
        <span
          className={`relative flex h-8 w-8 items-center justify-center rounded-full font-serif text-[0.62rem] font-semibold tracking-wide ${sealClass}`}
        >
          {abbr}
        </span>
      </div>
    )
  }

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

function MobileMembershipCard({ org }) {
  const style = scopeStyles[org.scope] ?? scopeStyles.International

  return (
    <article className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-sm">
      <span
        className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${style.accent}`}
        aria-hidden="true"
      />
      <div className="flex items-start gap-3 py-3 pr-3.5 pl-4">
        <MembershipSeal abbr={org.abbr} sealClass={style.seal} compact />

        <div className="min-w-0 flex-1">
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-[0.58rem] font-semibold tracking-[0.1em] uppercase ${style.badge}`}
          >
            {org.scope}
          </span>
          <h3 className="mt-1.5 font-serif text-sm leading-snug text-ink">{org.name}</h3>
          <p className="mt-1 text-[0.68rem] leading-relaxed text-ink-muted">Active professional member</p>
        </div>
      </div>
    </article>
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
  const [activeScope, setActiveScope] = useState('All')

  const organizations = activity?.professionalMembership?.organizations ?? []

  const filteredOrganizations = useMemo(() => {
    if (activeScope === 'All') return organizations
    return organizations.filter((org) => org.scope === activeScope)
  }, [activeScope, organizations])

  if (!isReady || !activity?.professionalMembership) return null

  const { label, title, intro } = activity.professionalMembership

  return (
    <section
      id="professional-membership"
      className="relative overflow-hidden border-t border-slate-200 bg-surface-alt py-12 lg:py-24"
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
          <h2 className="mt-2 font-serif text-2xl text-ink sm:mt-3 sm:text-3xl md:text-4xl">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:mt-4 md:text-base">{intro}</p>
        </header>

        {/* Mobile — scope filters + compact vertical cards */}
        <div className="mt-8 lg:hidden">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-[0.68rem] font-semibold text-brand">
              {organizations.length} active memberships
            </span>
          </div>

          <div
            className="mt-4 -mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Filter memberships by scope"
          >
            {SCOPE_FILTERS.map((scope) => {
              const isActive = activeScope === scope
              const count =
                scope === 'All'
                  ? organizations.length
                  : organizations.filter((org) => org.scope === scope).length

              if (scope !== 'All' && count === 0) return null

              return (
                <button
                  key={scope}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveScope(scope)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[0.68rem] font-semibold tracking-wide transition-colors ${
                    isActive
                      ? 'border-brand bg-brand text-white shadow-sm shadow-brand/20'
                      : 'border-slate-200/80 bg-white text-ink-muted'
                  }`}
                >
                  {scope}
                  <span className={`ml-1.5 tabular-nums ${isActive ? 'text-white/80' : 'text-ink-muted/70'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-4 space-y-3">
            {filteredOrganizations.map((org) => (
              <MobileMembershipCard key={org.id} org={org} />
            ))}
          </div>
        </div>

        {/* Desktop — original gradient panel + grid */}
        <div className="relative mt-12 hidden rounded-[1.75rem] bg-gradient-to-br from-brand/20 via-accent/10 to-brand-light/20 p-px shadow-lg shadow-brand/10 lg:block">
          <div className="rounded-[calc(1.75rem-1px)] bg-gradient-to-br from-white via-white to-brand-muted/20 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-center gap-3 border-b border-slate-200/70 pb-8">
              <span className="rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold text-brand">
                {organizations.length} active memberships
              </span>
              <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">
                International · National · Regional
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-5">
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
