import { useHomeContent } from '../hooks/useHomeContent'
import { images } from '../data/content'
import ContactButton from './ContactButton'
import MobileSocialLinks from './MobileSocialLinks'
import { hasMediaSrc } from '../lib/mediaUrl'

const heroButtonClassName =
  '!px-4 !py-2 !text-xs sm:!px-[1.125rem] sm:!py-[0.5625rem] sm:!text-[0.8125rem] lg:!px-5 lg:!py-2.5 lg:!text-sm'

function HeroName({ name }) {
  const surnameMatch = name.match(/^(.+?)\s+(Al-.+)$/)

  if (surnameMatch) {
    const [, givenNames, surname] = surnameMatch
    return (
      <>
        <span className="max-md:block md:contents">{givenNames}</span>
        <span className="max-md:block md:contents">{surname}</span>
      </>
    )
  }

  return name
}

export default function HeroBanner() {
  const { content, isReady } = useHomeContent()
  if (!isReady || !content) return null

  const { hero } = content
  const { backgroundImage, backgroundImageMobile, subtitle, name, description, primaryCta, secondaryCta } = hero
  const mobileBackground = hasMediaSrc(backgroundImageMobile)
    ? backgroundImageMobile
    : images.heroMobileVertical

  return (
    <section className="relative overflow-hidden max-lg:min-h-[92vh] max-md:min-h-[92svh] sm:max-lg:min-h-[94vh] lg:min-h-[95vh]">
      <img
        src={mobileBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center lg:hidden"
      />
      {hasMediaSrc(backgroundImage) ? (
        <img
          src={backgroundImage}
          alt="Dr. Wael A. Al-Dakroury, speech and language pathology"
          className="absolute inset-0 hidden h-full w-full object-cover object-center lg:block"
        />
      ) : null}

      {/* Hero overlay — same gradient as desktop */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/30" />

      {/* Tablet / desktop top fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/70 to-transparent max-md:hidden max-lg:block lg:hidden"
        aria-hidden="true"
      />

      {/* Mobile: editorial bottom layout — no box, content floats on the hero */}
      <div className="max-md:absolute max-md:inset-x-0 max-md:bottom-5 max-md:z-10 max-md:px-5 md:hidden">
        <div className="pb-4">
          <div className="mb-3 h-0.5 w-12 rounded-full bg-brand-light" aria-hidden="true" />
          <h1 className="font-serif text-[1.375rem] leading-[1.25] font-semibold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            <HeroName name={name} />
          </h1>
          <p className="mt-2 line-clamp-2 text-[0.625rem] leading-[1.55] font-medium tracking-wide text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
            {subtitle}
          </p>
          <p className="mt-2 line-clamp-2 text-[0.6875rem] leading-[1.6] text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]">
            {description}
          </p>
          <div className="mt-5 flex w-full flex-col gap-2.5">
            <ContactButton
              href={primaryCta.href}
              headerState={{ active: false, scrolled: false }}
              className={`${heroButtonClassName} !min-h-10 !w-full !max-w-full !justify-center !rounded-lg !py-2.5 !text-xs !shadow-lg !shadow-black/20`}
            >
              {primaryCta.label}
            </ContactButton>
            <a
              href={secondaryCta.href}
              className="inline-flex min-h-10 w-full max-w-full items-center justify-center rounded-lg border border-white/50 bg-transparent px-4 py-2.5 text-xs font-medium tracking-wide text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)] transition-colors hover:border-white hover:bg-white/10"
            >
              {secondaryCta.label}
            </a>
          </div>
        </div>
      </div>

      {/* Tablet / desktop content */}
      <div className="relative mx-auto hidden max-w-6xl flex-col max-lg:min-h-[92vh] max-lg:justify-end max-lg:px-5 max-lg:pb-12 max-lg:pt-[calc(3.75rem+env(safe-area-inset-top))] sm:max-lg:px-6 sm:max-lg:pb-14 md:flex lg:min-h-[85vh] lg:justify-end lg:px-8 lg:pt-48 lg:pb-24">
        <div className="flex max-w-xl flex-col max-lg:space-y-4 lg:max-w-none lg:space-y-0 lg:p-0">
          <h1 className="order-1 max-lg:max-w-none font-serif text-[2.375rem] leading-[1.08] font-semibold text-white drop-shadow-lg sm:text-[2.75rem] md:order-2 md:max-lg:max-w-2xl md:text-5xl lg:order-none lg:mt-4 lg:max-w-3xl lg:text-6xl lg:leading-[1.12] lg:font-medium lg:drop-shadow-md">
            <HeroName name={name} />
          </h1>
          <p className="order-2 max-lg:max-w-none text-[0.6875rem] leading-relaxed font-medium tracking-wide text-white/75 sm:max-lg:max-w-2xl sm:text-sm sm:text-white/90 md:order-1 md:text-base lg:order-none lg:max-w-4xl lg:text-sm lg:tracking-[0.12em] lg:text-white lg:drop-shadow-md">
            {subtitle}
          </p>
          <p className="order-3 max-lg:max-w-none text-sm leading-relaxed text-white/90 sm:max-lg:max-w-xl sm:text-base md:order-3 lg:order-none lg:mt-6 lg:max-w-xl lg:text-lg lg:text-white lg:drop-shadow-md">
            {description}
          </p>

          <MobileSocialLinks variant="hero" className="order-4 max-lg:pt-1 lg:hidden" />

          <div className="order-5 flex max-lg:w-full max-lg:flex-col max-lg:gap-2.5 max-lg:pt-2 flex-wrap gap-3 md:order-4 lg:order-none lg:mt-10 lg:flex-row lg:gap-4">
            <ContactButton
              href={primaryCta.href}
              headerState={{ active: false, scrolled: false }}
              className={`${heroButtonClassName} max-lg:w-full max-lg:justify-center`}
            >
              {primaryCta.label}
            </ContactButton>
            <a
              href={secondaryCta.href}
              className={`inline-flex items-center justify-center rounded-sm border border-white/40 bg-black/20 font-medium tracking-wide text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-black/30 max-lg:w-full lg:!px-7 lg:!py-3 lg:!text-sm ${heroButtonClassName}`}
            >
              {secondaryCta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
