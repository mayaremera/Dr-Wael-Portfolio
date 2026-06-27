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
  const { backgroundImage, subtitle, name, description, primaryCta, secondaryCta } = hero

  return (
    <section className="relative overflow-hidden max-lg:min-h-[92vh] max-md:min-h-[88svh] sm:max-lg:min-h-[94vh] lg:min-h-[95vh]">
      <img
        src={images.heroMobileVertical}
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
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/70 to-ink/35 max-md:from-ink/95 max-md:via-ink/55 max-md:to-ink/15 sm:bg-gradient-to-r sm:from-ink/85 sm:via-ink/60 sm:to-ink/30" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/70 to-transparent max-md:from-ink/60 max-lg:block lg:hidden"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col max-lg:min-h-[92vh] max-lg:justify-end max-lg:px-5 max-lg:pb-12 max-lg:pt-[calc(3.75rem+env(safe-area-inset-top))] max-md:min-h-[88svh] max-md:justify-end max-md:px-4 max-md:pb-[calc(5.25rem+env(safe-area-inset-bottom))] max-md:pt-[calc(4rem+env(safe-area-inset-top))] sm:max-lg:px-6 sm:max-lg:pb-14 lg:min-h-[85vh] lg:justify-end lg:px-8 lg:pt-48 lg:pb-24">
        <div className="flex max-w-xl flex-col max-lg:space-y-4 max-md:w-full max-md:max-w-none max-md:translate-y-4 max-md:space-y-0 max-md:rounded-2xl max-md:bg-gradient-to-t max-md:from-ink/90 max-md:via-ink/70 max-md:to-ink/30 max-md:px-4 max-md:py-6 lg:max-w-none lg:translate-y-0 lg:space-y-0 lg:p-0 lg:rounded-none lg:bg-none">
          <h1 className="order-1 max-lg:max-w-none font-serif text-[2.375rem] leading-[1.08] font-semibold text-white drop-shadow-lg max-md:max-w-none max-md:text-[1.375rem] max-md:leading-[1.25] sm:text-[2.75rem] md:order-2 md:max-lg:max-w-2xl md:text-5xl lg:order-none lg:mt-4 lg:max-w-3xl lg:text-6xl lg:leading-[1.12] lg:font-medium lg:drop-shadow-md">
            <HeroName name={name} />
          </h1>
          <p className="order-2 max-lg:max-w-none text-[0.6875rem] leading-relaxed font-medium tracking-wide text-white/75 max-md:mt-4 max-md:max-w-none max-md:text-[0.625rem] max-md:leading-[1.6] max-md:text-white/75 md:order-1 sm:max-lg:max-w-2xl sm:text-sm sm:text-white/90 md:text-base lg:order-none lg:max-w-4xl lg:text-sm lg:tracking-[0.12em] lg:text-white lg:drop-shadow-md">
            {subtitle}
          </p>
          <p className="order-3 max-lg:max-w-none text-sm leading-relaxed text-white/90 max-md:mt-4 max-md:max-w-none max-md:line-clamp-3 max-md:text-[0.6875rem] max-md:leading-[1.7] max-md:text-white/75 md:order-3 sm:max-lg:max-w-xl sm:text-base lg:order-none lg:mt-6 lg:max-w-xl lg:line-clamp-none lg:text-lg lg:text-white lg:drop-shadow-md">
            {description}
          </p>

          <MobileSocialLinks
            variant="hero"
            className="order-4 max-md:hidden max-lg:pt-1 lg:hidden"
          />

          <div className="order-5 flex max-lg:w-full max-lg:flex-col max-lg:gap-2.5 max-md:mt-6 max-md:gap-2.5 max-lg:pt-2 flex-wrap gap-3 md:order-4 lg:order-none lg:mt-10 lg:flex-row lg:gap-4">
            <ContactButton
              href={primaryCta.href}
              headerState={{ active: false, scrolled: false }}
              className={`${heroButtonClassName} max-md:!min-h-10 max-md:!w-full max-md:!justify-center max-md:!rounded-lg max-md:!py-2.5 max-md:!text-xs max-lg:w-full max-lg:justify-center`}
            >
              {primaryCta.label}
            </ContactButton>
            <a
              href={secondaryCta.href}
              className={`inline-flex items-center justify-center rounded-sm border border-white/40 bg-black/20 font-medium tracking-wide text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-black/30 max-md:!min-h-10 max-md:!w-full max-md:!justify-center max-md:!rounded-lg max-md:!py-2.5 max-md:!text-xs max-lg:w-full lg:!px-7 lg:!py-3 lg:!text-sm ${heroButtonClassName}`}
            >
              {secondaryCta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
