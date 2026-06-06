import { useState } from 'react'
import { images, profileDetails, trustedCompanies } from '../data/content'

const sectionLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

function AffiliationHoverOverlay({ company }) {
  return (
    <>
      <div
        className="absolute inset-0 z-[2] translate-y-full bg-brand-muted transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 z-[3] flex translate-y-3 flex-col justify-end p-3.5 opacity-0 transition-all duration-500 delay-75 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:p-4">
        <span className="mb-2 inline-block h-0.5 w-0 origin-left bg-brand/40 transition-all duration-500 delay-150 group-hover:w-8 group-focus-within:w-8" />
        <p className="text-[0.58rem] font-bold tracking-[0.16em] text-brand uppercase">{company.shortName}</p>
        <p className="mt-1 font-serif text-xs leading-snug text-ink sm:text-[0.8125rem]">{company.name}</p>
        <p className="mt-1.5 text-[0.6875rem] leading-snug text-ink-muted sm:text-xs">{company.role}</p>
      </div>
    </>
  )
}

function AffiliationBadge({ logo, label }) {
  return (
    <div
      className="pointer-events-none absolute right-1.5 bottom-1.5 z-[4] opacity-100 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0 sm:right-2 sm:bottom-2"
      title={label}
    >
      <img
        src={logo}
        alt=""
        className="h-5 w-5 rounded-full object-cover shadow-sm ring-1 ring-white sm:h-6 sm:w-6"
      />
    </div>
  )
}

function AffiliationTile({ company }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const fullCover = company.logoFit === 'cover'

  return (
    <article
      className="group relative h-32 overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-sm transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-md hover:shadow-brand/10 focus-within:-translate-y-0.5 focus-within:border-brand/20 focus-within:shadow-md focus-within:shadow-brand/10 sm:h-36"
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden">
        {!logoFailed ? (
          fullCover ? (
            <div className="absolute inset-0">
              <img
                src={company.logo}
                alt={company.name}
                onError={() => setLogoFailed(true)}
                className="h-full w-full object-cover scale-[0.97] transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-25 group-focus-within:scale-100 group-focus-within:opacity-25"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <img
                src={company.logo}
                alt={company.name}
                onError={() => setLogoFailed(true)}
                className="max-h-[82%] w-auto max-w-[88%] object-contain transition-all duration-500 ease-out group-hover:scale-[0.88] group-hover:opacity-25 group-focus-within:scale-[0.88] group-focus-within:opacity-25"
              />
            </div>
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-brand/15 bg-brand-muted/50 transition-opacity duration-500 group-hover:opacity-25 group-focus-within:opacity-25">
              <span className="font-serif text-xl font-semibold text-brand">{company.shortName.slice(0, 3)}</span>
            </div>
          </div>
        )}

        {company.badgeLogo ? (
          <AffiliationBadge logo={company.badgeLogo} label={company.badgeLabel} />
        ) : null}

        <AffiliationHoverOverlay company={company} />
      </div>
    </article>
  )
}

function AffiliationGrid({ companies }) {
  const rowOne = companies.slice(0, 4)
  const rowTwo = companies.slice(4, 7)

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {rowOne.map((company) => (
          <AffiliationTile key={company.id} company={company} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {rowTwo.map((company) => (
          <AffiliationTile key={company.id} company={company} />
        ))}
      </div>
    </div>
  )
}

function TrustedCompanies() {
  const { title, subtitle, viewAllLabel, viewAllHref, companies } = trustedCompanies

  return (
    <div className="mt-12 border-t border-slate-200/80 pt-10 lg:mt-14 lg:pt-12">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium tracking-[0.1em] text-brand uppercase">Global collaboration</p>
        <h3 className="mt-2 font-serif text-2xl leading-tight text-ink md:text-3xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">{subtitle}</p>
      </header>

      <div className="mt-8 mb-4 flex justify-end">
        <a href={viewAllHref} className={sectionLinkClassName}>
          {viewAllLabel}
        </a>
      </div>

      <AffiliationGrid companies={companies} />
    </div>
  )
}

export default function Profile({ variant = 'home' }) {
  const { name, title, credentials, tagline, bio } = profileDetails
  const isPage = variant === 'page'

  return (
    <section
      id="profile"
      className="border-t border-slate-200 bg-surface py-16 lg:py-20"
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

            <blockquote className="mt-5">
              <p className="font-serif text-lg leading-relaxed text-ink italic md:text-xl">
                &ldquo;{tagline}&rdquo;
              </p>
              <footer className="mt-2 text-sm font-medium text-brand">
                {name}
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

            {!isPage ? (
              <div className="mt-8">
                <a
                  href="/about-me"
                  className="inline-block rounded-sm bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-light"
                >
                  More About Me
                </a>
              </div>
            ) : null}
          </div>
        </div>

        {!isPage ? <TrustedCompanies /> : null}
      </div>
    </section>
  )
}
