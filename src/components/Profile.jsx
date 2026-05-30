import { images, profileDetails } from '../data/content'

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
      </div>
    </section>
  )
}
