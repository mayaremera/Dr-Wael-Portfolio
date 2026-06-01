import { images, profileDetails, certificates } from '../data/content'
import { IconAward } from './Icons'

function AshaFellowCard() {
  const award = certificates.find((c) => c.featured)
  if (!award) return null

  return (
    <div className="mt-14 overflow-hidden rounded-sm shadow-lg ring-1 ring-brand/15">
      <div className="grid lg:grid-cols-[minmax(260px,320px)_1fr]">
        <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-brand via-brand to-brand-light px-8 py-10 lg:py-12">
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/20 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10 blur-xl"
            aria-hidden="true"
          />

          <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-full ring-4 ring-white/25 ring-offset-2 ring-offset-brand">
            <img
              src={images.drWael}
              alt="Dr. Wael A. Al-Dakroury"
              className="h-full w-full object-cover object-top"
            />
          </div>

          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-accent/40" />
            <div className="absolute inset-2 rounded-full border border-dashed border-white/30" />
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30">
              <IconAward className="h-7 w-7" />
            </div>
          </div>

          <p className="relative mt-5 text-center text-[0.65rem] font-bold tracking-[0.22em] text-accent uppercase">
            Highest Honor · {award.year}
          </p>
        </div>

        <div className="flex flex-col justify-center bg-white px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <span className="inline-flex w-fit rounded-full bg-brand-muted px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-brand uppercase">
            Distinguished Recognition
          </span>
          <h3 className="mt-4 font-serif text-2xl leading-tight text-ink md:text-3xl lg:text-4xl">
            {award.title}
          </h3>
          <p className="mt-2 text-base font-medium text-brand">{award.issuer}</p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
            {award.description}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Awarded to a select group of members worldwide who have advanced the field through
            outstanding contributions to communication sciences and disorders.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const { name, title, credentials, tagline, bio } = profileDetails

  return (
    <section
      id="profile"
      className="border-t border-slate-200 bg-surface-alt py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(280px,380px)_1fr] lg:items-stretch lg:gap-12">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm lg:aspect-auto lg:h-full lg:min-h-0">
            <img
              src={images.drWael}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>

          <div className="flex flex-col justify-center lg:justify-start">
            <p className="text-sm font-medium tracking-[0.1em] text-brand uppercase">
              About Dr. Wael
            </p>
            <h2 className="mt-2 font-serif text-2xl text-ink md:text-3xl">{name}</h2>
            <p className="mt-1 text-base text-brand">{title}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {credentials.map((cred) => (
                <span
                  key={cred}
                  className="rounded-full border border-brand/20 bg-brand-muted/50 px-3 py-1 text-xs font-medium text-brand"
                >
                  {cred}
                </span>
              ))}
            </div>

            <blockquote className="mt-5 border-l-4 border-brand pl-4">
              <p className="font-serif text-lg leading-relaxed text-ink italic md:text-xl">
                &ldquo;{tagline}&rdquo;
              </p>
              <footer className="mt-2 text-sm font-medium text-brand">
                — {name}
              </footer>
            </blockquote>

            <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-brand/20 bg-brand-muted/50 px-3 py-1 text-xs font-medium text-brand">
              <span className="font-semibold tabular-nums">30+</span>
              Years of Experience
            </span>

            <div className="mt-6 space-y-3 text-sm leading-relaxed text-ink-muted md:text-base">
              {bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="#promo"
                className="inline-block rounded-sm bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-light"
              >
                More About Me
              </a>
            </div>
          </div>
        </div>

        <AshaFellowCard />
      </div>
    </section>
  )
}
