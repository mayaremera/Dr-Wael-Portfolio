import { useEffect, useRef } from 'react'
import { useHomeContent } from '../hooks/useHomeContent'

const PROMO_PLAYBACK_RATE = 0.65

export default function PromoVideoSection() {
  const { promoVideo } = useHomeContent()
  const { src, label, titleHighlight, description, cta, secondary } = promoVideo
  const videoRef = useRef(null)

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

  return (
    <section
      id="promo"
      className="border-t border-slate-200 bg-surface-alt py-16 lg:py-20"
      aria-labelledby="promo-heading"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative min-h-[min(46vh,360px)] overflow-hidden rounded-sm shadow-xl shadow-brand/15 sm:min-h-[min(50vh,400px)] lg:min-h-[min(72vh,640px)]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src={src} type="video/mp4" />
          </video>

          <div
            className="absolute inset-0 bg-gradient-to-br from-brand/92 via-brand/75 to-accent/55 mix-blend-multiply"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand/80 via-transparent to-brand/30"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgb(240_138_93/0.35),transparent_55%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgb(255_255_255/0.12),transparent_40%)]"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -left-12 top-1/4 h-48 w-48 rounded-full bg-accent/30 blur-3xl animate-promo-float"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-10 bottom-1/4 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-promo-float-reverse"
            aria-hidden="true"
          />

          <div className="relative flex min-h-[min(46vh,360px)] items-center justify-center px-4 py-8 sm:min-h-[min(50vh,400px)] sm:px-6 sm:py-10 lg:min-h-[min(72vh,640px)] lg:px-12 lg:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="animate-promo-fade-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.22em] lg:px-4 lg:py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
                {label}
              </p>

              <h2
                id="promo-heading"
                className="animate-promo-fade-up animation-delay-100 mt-4 font-serif text-xl leading-[1.15] text-white sm:mt-5 sm:text-2xl md:text-3xl lg:mt-6 lg:text-[4rem] lg:leading-[1.12]"
              >
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
                  href={cta.href}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-accent px-5 py-2 text-[0.6875rem] font-semibold tracking-wide text-white uppercase shadow-lg shadow-accent/30 transition-transform hover:scale-[1.03] hover:bg-accent-hover sm:px-6 sm:py-2.5 sm:text-xs lg:px-8 lg:py-3.5 lg:text-sm"
                >
                  <span
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden="true"
                  />
                  {cta.label}
                </a>
                <a
                  href={secondary.href}
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
