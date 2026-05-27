import { images, profileDetails } from '../data/content'

export default function Profile() {
  const { name, title, credentials, tagline, highlights, bio, roles } =
    profileDetails

  return (
    <section id="profile" className="relative -mt-10 border-t border-slate-200 bg-surface-alt py-12 lg:-mt-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-sm border border-slate-100 bg-white shadow-xl shadow-slate-200/40">
          <div className="grid lg:grid-cols-[minmax(340px,420px)_1fr] lg:items-start">
            <div className="relative overflow-hidden bg-white lg:border-r lg:border-slate-100">
              <div className="aspect-[3/4] w-full">
                <img
                  src={images.drWael}
                  alt={name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="absolute top-5 left-5 rounded-sm bg-brand px-3 py-1.5 text-xs font-semibold tracking-wider text-white uppercase shadow-sm">
                ASHA Fellow 2025
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-14">
              <p className="text-sm font-medium tracking-[0.2em] text-brand uppercase">
                About Dr. Wael
              </p>
              <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{name}</h2>
              <p className="mt-1 text-lg text-brand">{title}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {credentials.map((cred) => (
                  <span
                    key={cred}
                    className="rounded-full border border-brand/20 bg-brand-muted/50 px-3 py-1 text-xs font-medium text-brand"
                  >
                    {cred}
                  </span>
                ))}
              </div>

              <p className="mt-6 font-serif text-xl leading-snug text-ink italic md:text-2xl">
                {tagline}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6 border-y border-slate-100 py-8 sm:grid-cols-4">
                {highlights.map((item) => (
                  <div key={item.label}>
                    <p className="font-serif text-2xl text-brand">{item.value}</p>
                    <p className="mt-1 text-xs tracking-wide text-ink-muted uppercase">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-base leading-relaxed text-ink-muted">
                {bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-xs font-semibold tracking-widest text-brand uppercase">
                  Current Roles & Affiliations
                </p>
                <ul className="mt-4 space-y-2.5">
                  {roles.map((role) => (
                    <li
                      key={role}
                      className="flex items-start gap-3 text-sm text-ink"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {role}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#certificates"
                  className="rounded-sm bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-light"
                >
                  View Credentials
                </a>
                <a
                  href="#video"
                  className="rounded-sm border border-slate-200 px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  Watch Video
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
