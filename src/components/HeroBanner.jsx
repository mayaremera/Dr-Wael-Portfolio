import { useHomeContent } from '../hooks/useHomeContent'
import ContactButton from './ContactButton'
import { hasMediaSrc } from '../lib/mediaUrl'

const heroButtonClassName =
  '!px-4 !py-2 !text-xs sm:!px-[1.125rem] sm:!py-[0.5625rem] sm:!text-[0.8125rem] lg:!px-5 lg:!py-2.5 lg:!text-sm'

export default function HeroBanner() {
  const { content, isReady } = useHomeContent()
  if (!isReady || !content) return null

  const { hero } = content
  const { backgroundImage, subtitle, name, description, primaryCta, secondaryCta } = hero

  return (
    <section className="relative overflow-hidden max-lg:min-h-[56vh] sm:max-lg:min-h-[68vh] md:max-lg:min-h-[64vh] lg:min-h-[95vh]">
      {hasMediaSrc(backgroundImage) ? (
        <img
          src={backgroundImage}
          alt="Dr. Wael A. Al-Dakroury, speech and language pathology"
          className="absolute inset-0 h-full w-full scale-105 object-cover object-[62%_12%] sm:object-[center_20%] lg:scale-100 lg:object-center"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/70 to-ink/35 sm:bg-gradient-to-r sm:from-ink/85 sm:via-ink/60 sm:to-ink/30" />

      <div className="relative mx-auto flex max-w-6xl flex-col px-9 pt-[5rem] pb-[0rem] sm:px-9 sm:pt-[7.02rem] sm:pb-[3.51rem] md:pt-[8.19rem] md:pb-[4.1rem] lg:min-h-[85vh] lg:justify-end lg:px-8 lg:pt-48 lg:pb-24">
        <div className="flex flex-col px-[0.675rem] py-[1.575rem] sm:px-[0.9rem] sm:py-[1.8rem] md:py-[2.025rem] lg:p-0">
        <p className="max-w-xs text-[0.6875rem] leading-snug font-medium tracking-wide text-white/75 sm:max-w-2xl sm:text-sm sm:text-white/90 md:text-base lg:max-w-4xl lg:text-sm lg:tracking-[0.12em] lg:text-white lg:drop-shadow-md">
          {subtitle}
        </p>
        <h1 className="mt-2 max-w-[16rem] font-serif text-[2.625rem] leading-[1.02] font-semibold text-white drop-shadow-lg sm:mt-3 sm:max-w-md sm:text-[2.75rem] md:max-w-2xl md:text-5xl lg:mt-4 lg:max-w-3xl lg:text-6xl lg:leading-[1.12] lg:font-medium lg:drop-shadow-md">
          {name}
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/90 sm:mt-4 sm:max-w-xl sm:text-base lg:mt-6 lg:max-w-xl lg:text-lg lg:text-white lg:drop-shadow-md">
          {description}
        </p>
        <div className="mt-5 flex flex-wrap gap-3 sm:mt-6 lg:mt-10 lg:gap-4">
          <ContactButton
            href={primaryCta.href}
            headerState={{ active: false, scrolled: false }}
            className={heroButtonClassName}
          >
            {primaryCta.label}
          </ContactButton>
          <a
            href={secondaryCta.href}
            className={`inline-flex items-center justify-center rounded-sm border border-white/40 bg-black/20 font-medium tracking-wide text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-black/30 lg:!px-7 lg:!py-3 lg:!text-sm ${heroButtonClassName}`}
          >
            {secondaryCta.label}
          </a>
        </div>
        </div>
      </div>
    </section>
  )
}
