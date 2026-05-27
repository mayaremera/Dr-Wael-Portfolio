const roles = [
  {
    year: '2025',
    title: 'ASHA Fellow',
    org: 'American Speech-Language-Hearing Association',
    note: 'Highest honor — significant international impact',
  },
  {
    year: '2026–28',
    title: 'Chief Editor',
    org: 'ASHA SIG17 Perspectives',
    note: 'Editorial leadership in communication sciences',
  },
  {
    year: 'Present',
    title: 'International Ambassador',
    org: 'American Speech-Language-Hearing Association',
    note: 'Global advocacy and professional collaboration',
  },
  {
    year: 'Present',
    title: 'Associate Professor',
    org: 'Alfaisal University',
    note: 'Academic leadership in speech-language pathology',
  },
]

const focusAreas = [
  'Pediatric language disorders',
  'ADHD & communication',
  'Autism spectrum & language',
  'Evidence-based intervention',
  'Clinical education & mentorship',
]

export default function Leadership() {
  return (
    <section id="leadership" className="border-t border-slate-200 bg-surface-tint py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-brand uppercase">
              Leadership & Research
            </p>
            <h2 className="mt-4 font-serif text-3xl font-medium text-ink md:text-4xl">
              Advancing the field through clinical and academic excellence
            </h2>
            <p className="mt-6 leading-relaxed text-ink-muted">
              Dr. Wael&apos;s work spans direct patient care, university teaching,
              and international professional leadership — ensuring families benefit
              from both cutting-edge research and decades of hands-on clinical wisdom.
            </p>

            <div className="mt-10">
              <p className="text-sm font-medium tracking-wide text-brand uppercase">
                Clinical Focus
              </p>
              <ul className="mt-4 space-y-3">
                {focusAreas.map((area) => (
                  <li
                    key={area}
                    className="flex items-center gap-3 text-ink-muted"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-brand" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            {roles.map((role) => (
              <div
                key={role.title}
                className="border-l border-brand/30 bg-white py-6 pl-8"
              >
                <p className="text-xs font-medium tracking-widest text-brand uppercase">
                  {role.year}
                </p>
                <h3 className="mt-2 font-serif text-xl text-ink">{role.title}</h3>
                <p className="mt-1 text-sm font-medium text-ink">{role.org}</p>
                <p className="mt-2 text-sm text-ink-muted">{role.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
