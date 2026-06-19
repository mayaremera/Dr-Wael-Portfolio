import { useState } from 'react'
import { careerImpact, images } from '../data/content'
import { useAboutContent } from '../hooks/useAboutContent'
import { useHomeContent } from '../hooks/useHomeContent'
import CredentialCompass from './CredentialCompass'

const statAccents = [
  'border-brand/20 bg-brand-muted/40',
  'border-accent/20 bg-accent/5',
  'border-brand-light/20 bg-brand/5',
  'border-slate-200 bg-white',
]

const sectionLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

function AffiliationHoverOverlay({ company }) {
  return (
    <>
      <div
        className="absolute inset-0 z-[2] translate-y-full bg-brand-muted transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 z-[3] flex translate-y-2 flex-col justify-end p-[0.55rem] opacity-0 transition-all duration-500 delay-75 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 lg:translate-y-3 lg:p-[1.1rem]">
        <span className="mb-[0.41rem] inline-block h-0.5 w-0 origin-left bg-brand/40 transition-all duration-500 delay-150 group-hover:w-[1.65rem] group-focus-within:w-[1.65rem] lg:mb-[0.55rem] lg:group-hover:w-[2.2rem] lg:group-focus-within:w-[2.2rem]" />
        <p className="text-[0.55rem] font-bold tracking-[0.14em] text-brand uppercase lg:text-[0.638rem] lg:tracking-[0.16em]">
          {company.shortName}
        </p>
        <p className="mt-[0.14rem] font-serif text-[0.6875rem] leading-tight text-ink lg:mt-[0.275rem] lg:text-[0.894rem] lg:leading-snug">
          {company.name}
        </p>
        <p className="mt-[0.275rem] line-clamp-4 text-[0.619rem] leading-tight text-ink-muted lg:mt-[0.4125rem] lg:line-clamp-none lg:text-[0.825rem] lg:leading-snug">
          {company.role}
        </p>
      </div>
    </>
  )
}

function AffiliationBadge({ logo, label, compact = false }) {
  const imageClassName = compact
    ? 'h-[2.68rem] w-auto max-w-[4.2rem] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] md:h-[3.06rem] md:max-w-[3.06rem] lg:h-[3.6rem] lg:max-w-[3.6rem]'
    : 'h-[3.15rem] w-auto max-w-[4.95rem] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] lg:h-[3.6rem] lg:max-w-[3.6rem]'

  return (
    <div
      className="pointer-events-none absolute right-2 bottom-2 z-[4] opacity-100 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0 lg:right-3 lg:bottom-1"
      title={label}
    >
      <img src={logo} alt={label} className={imageClassName} />
    </div>
  )
}

function AffiliationTile({ company }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const fullCover = company.logoFit === 'cover'

  return (
    <article
      className="group relative h-32 overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-sm transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-md hover:shadow-brand/10 focus-within:-translate-y-0.5 focus-within:border-brand/20 focus-within:shadow-md focus-within:shadow-brand/10 lg:h-36"
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
                className="h-full w-full object-cover transition-all duration-500 ease-out group-hover:opacity-25 group-focus-within:opacity-25"
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
          <AffiliationBadge
            logo={company.badgeLogo}
            label={company.badgeLabel}
            compact={company.id === 'cambridge'}
          />
        ) : null}

        <AffiliationHoverOverlay company={company} />
      </div>
    </article>
  )
}

function AffiliationGrid({ companies }) {
  const midpoint = Math.ceil(companies.length / 2)
  const rowOne = companies.slice(0, midpoint)
  const rowTwo = companies.slice(midpoint)

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:gap-3.5 lg:hidden">
        {companies.map((company) => (
          <AffiliationTile key={company.id} company={company} />
        ))}
      </div>

      <div className="hidden space-y-4 lg:block">
        <div className={`grid gap-4 ${rowOne.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {rowOne.map((company) => (
            <AffiliationTile key={company.id} company={company} />
          ))}
        </div>

        <div className={`grid gap-4 ${rowTwo.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {rowTwo.map((company) => (
            <AffiliationTile key={company.id} company={company} />
          ))}
        </div>
      </div>
    </>
  )
}

function TrustedCompanies() {
  const { affiliations } = useHomeContent()
  const { title, subtitle, viewAllLabel, viewAllHref, companies } = affiliations
  const visibleCompanies = companies.filter((company) => company.id !== 'asha')

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

      <AffiliationGrid companies={visibleCompanies} />
    </div>
  )
}

export default function Profile({ variant = 'home' }) {
  const { profileDetails, profileImage } = useAboutContent()
  const { name, title, credentials, tagline } = profileDetails
  const photo = profileImage || images.drWael
  const isPage = variant === 'page'
  const displayBio = isPage
    ? (profileDetails.bioExtended ?? profileDetails.bio)
    : profileDetails.bio

  return (
    <section
      id="profile"
      className="border-t border-slate-200 bg-surface py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div
          className={`grid gap-8 lg:items-stretch lg:gap-10 ${
            isPage ? 'lg:grid-cols-[minmax(280px,380px)_1fr]' : 'lg:grid-cols-[minmax(240px,320px)_1fr_minmax(220px,280px)]'
          }`}
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm lg:aspect-auto lg:h-full lg:min-h-0">
            <img
              src={photo}
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

            {isPage ? (
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
            ) : null}

            <blockquote className="mt-5">
              <p className="font-serif text-lg leading-relaxed text-ink italic md:text-xl">
                &ldquo;{tagline}&rdquo;
              </p>
              <footer className="mt-2 text-sm font-medium text-brand">
                {name}
              </footer>
            </blockquote>

            {!isPage ? (
              <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-brand/20 bg-brand-muted/50 px-3 py-1 text-xs font-medium text-brand">
                <span className="font-semibold tabular-nums">30+</span>
                Years of Experience
              </span>
            ) : null}

            {displayBio.length > 0 ? (
              <div className="mt-6 space-y-3 text-sm leading-relaxed text-ink-muted md:text-base">
                {displayBio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : null}

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

          {!isPage ? (
            <div className="flex items-center justify-center lg:justify-end">
              <CredentialCompass />
            </div>
          ) : null}
        </div>

        {isPage ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
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
        ) : null}

        {!isPage ? <TrustedCompanies /> : null}
      </div>
    </section>
  )
}
