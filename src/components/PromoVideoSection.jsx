import { useEffect, useRef } from 'react'
import { useGalleryContent } from '../hooks/useGalleryContent'

const PROMO_PLAYBACK_RATE = 0.65

function truncatePreviewText(text, maxLength = 140) {
  if (!text || text.length <= maxLength) return text
  const slice = text.slice(0, maxLength)
  const lastSpace = slice.lastIndexOf(' ')
  return `${(lastSpace > maxLength * 0.5 ? slice.slice(0, lastSpace) : slice).trim()}…`
}

export default function PromoVideoSection({ ctaHref, secondaryHref, variant = 'alt', fullBleedMobile = false, tone }) {
  const { isReady, promoVideo } = useGalleryContent()
  const src = promoVideo?.src ?? ''
  const videoRef = useRef(null)
  const isLight = variant === 'light'
  const sectionTone = tone ?? (isLight ? 'white' : 'alt')
  const useHomeMobileLayout = fullBleedMobile || !isLight
  const mobileBleed = fullBleedMobile
    ? 'max-md:py-0 max-md:border-t-0 max-md:bg-transparent'
    : ''
  const mobileContainerBleed = fullBleedMobile
    ? 'max-md:max-w-none max-md:px-0'
    : ''

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const setPlaybackRate = () => {
      video.playbackRate = PROMO_PLAYBACK_RATE
    }

    setPlaybackRate()
    video.addEventListener('loadedmetadata', setPlaybackRate)

    return () => video.removeEventListener('loadedmetadata', setPlaybackRate)
  }, [src])

  if (!isReady || !promoVideo || !src) return null

  const { label, titleHighlight, description, cta, secondary } = promoVideo
  const mobileDescription = truncatePreviewText(description, 132)
  const primaryHref = ctaHref ?? cta.href
  const secondaryLinkHref = secondaryHref ?? secondary.href

  return (
    <section
      id="promo"
      className={`border-t border-slate-200 py-12 lg:py-20 ${sectionTone === 'white' ? 'bg-white' : 'bg-surface-alt'} ${mobileBleed}`}
      aria-labelledby="promo-heading"
    >
      <div className={`mx-auto max-w-6xl px-6 lg:px-8 ${mobileContainerBleed}`}>
        <div
          className={`relative overflow-hidden md:min-h-[min(46vh,360px)] md:rounded-sm md:shadow-xl md:shadow-brand/15 lg:min-h-[min(72vh,640px)] ${
            fullBleedMobile
              ? 'max-md:rounded-none'
              : 'rounded-2xl max-md:shadow-lg max-md:shadow-brand/15'
          }`}
        >
          <div
            className={`relative w-full md:absolute md:inset-0 ${
              useHomeMobileLayout ? 'aspect-video md:aspect-auto' : 'aspect-[4/5] md:aspect-auto'
            }`}
          >
            <video
              key={src}
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover object-top md:object-center"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src={src} />
            </video>
            <div
              className={`pointer-events-none absolute inset-0 md:hidden ${
                useHomeMobileLayout
                  ? 'bg-gradient-to-t from-brand/40 via-transparent to-brand/10'
                  : 'bg-linear-to-t from-brand via-brand/55 to-brand/10'
              }`}
              aria-hidden="true"
            />
          </div>

          <div
            className="absolute inset-0 hidden bg-gradient-to-br from-brand/92 via-brand/75 to-accent/55 mix-blend-multiply md:block"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 hidden bg-gradient-to-t from-brand/80 via-transparent to-brand/30 md:block"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_20%_50%,rgb(240_138_93/0.35),transparent_55%)] md:block"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_85%_20%,rgb(255_255_255/0.12),transparent_40%)] md:block"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-12 top-1/4 hidden h-48 w-48 rounded-full bg-accent/30 blur-3xl animate-promo-float md:block"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-10 bottom-1/4 hidden h-56 w-56 rounded-full bg-white/10 blur-3xl animate-promo-float-reverse md:block"
            aria-hidden="true"
          />

          {useHomeMobileLayout ? (
            <div className="relative bg-gradient-to-br from-brand via-[#1e5566] to-brand-light px-5 py-6 md:hidden">
              <div className="mb-3 h-0.5 w-12 rounded-full bg-accent" aria-hidden="true" />
              <p className="text-[0.625rem] font-semibold tracking-[0.2em] text-accent uppercase">{label}</p>
              <h2 id="promo-heading" className="mt-2 font-serif text-[1.375rem] leading-[1.2] text-white">
                {titleHighlight}
              </h2>
              <p className="mt-2.5 text-[0.6875rem] leading-[1.6] text-white/80">{mobileDescription}</p>
              <div className="mt-5 flex w-full flex-col gap-2.5">
                <a
                  href={primaryHref}
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-xs font-semibold tracking-wide text-white uppercase shadow-lg shadow-black/20 transition-colors hover:bg-accent-hover"
                >
                  {cta.label}
                </a>
                <a
                  href={secondaryLinkHref}
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-white/50 bg-transparent px-4 py-2.5 text-xs font-medium tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  {secondary.label}
                </a>
              </div>
            </div>
          ) : (
            <div className="absolute inset-x-0 bottom-0 p-5 md:hidden">
              <div className="mb-2 h-0.5 w-10 rounded-full bg-accent" aria-hidden="true" />
              <p className="text-[0.625rem] font-semibold tracking-[0.2em] text-accent uppercase">{label}</p>
              <h2 id="promo-heading" className="mt-2 font-serif text-xl leading-[1.2] text-white">
                {titleHighlight}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-white/85">{mobileDescription}</p>
              <div className="mt-4 flex w-full flex-col gap-2">
                <a
                  href={primaryHref}
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-xs font-semibold tracking-wide text-white uppercase shadow-lg shadow-black/20 transition-colors hover:bg-accent-hover"
                >
                  {cta.label}
                </a>
                <a
                  href={secondaryLinkHref}
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-white/50 bg-white/10 px-4 py-2.5 text-xs font-medium tracking-wide text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/15"
                >
                  {secondary.label}
                </a>
              </div>
            </div>
          )}

          <div className="relative hidden min-h-[min(46vh,360px)] items-center justify-center px-4 py-8 sm:min-h-[min(50vh,400px)] sm:px-6 sm:py-10 md:flex lg:min-h-[min(72vh,640px)] lg:px-12 lg:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="animate-promo-fade-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.22em] lg:px-4 lg:py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
                {label}
              </p>

              <h2 className="animate-promo-fade-up animation-delay-100 mt-4 font-serif text-xl leading-[1.15] text-white sm:mt-5 sm:text-2xl md:text-3xl lg:mt-6 lg:text-[4rem] lg:leading-[1.12]">
                {titleHighlight}
              </h2>

              <div
                className="animate-promo-fade-up animation-delay-200 mx-auto mt-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-accent via-white to-accent sm:mt-5 sm:h-1 sm:w-16 lg:mt-6 lg:w-20"
                aria-hidden="true"
              />

              <p className="animate-promo-fade-up animation-delay-200 mx-auto mt-3 max-w-xs text-[0.6875rem] leading-snug text-white/90 sm:mt-4 sm:max-w-md sm:text-xs sm:leading-relaxed md:max-w-lg lg:mt-6 lg:max-w-2xl lg:text-base lg:leading-relaxed xl:text-lg">
                {description}
              </p>

              <div className="animate-promo-fade-up animation-delay-300 mt-5 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3 lg:mt-8 lg:gap-5">
                <a
                  href={primaryHref}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-accent px-5 py-2 text-[0.6875rem] font-semibold tracking-wide text-white uppercase shadow-lg shadow-accent/30 transition-transform hover:scale-[1.03] hover:bg-accent-hover sm:px-6 sm:py-2.5 sm:text-xs lg:px-8 lg:py-3.5 lg:text-sm"
                >
                  <span
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden="true"
                  />
                  {cta.label}
                </a>
                <a
                  href={secondaryLinkHref}
                  className="inline-flex items-center justify-center rounded-sm border-2 border-white/40 bg-white/10 px-5 py-2 text-[0.6875rem] font-semibold tracking-wide text-white uppercase backdrop-blur-sm transition-colors hover:border-white hover:bg-white/20 sm:px-6 sm:py-2.5 sm:text-xs lg:px-8 lg:py-3.5 lg:text-sm"
                >
                  {secondary.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
