import { useEffect, useRef } from 'react'
import { promoVideo } from '../data/content'

const PROMO_PLAYBACK_RATE = 0.65

export default function PromoVideoSection() {
  const {
    src,
    sectionLabel,
    sectionTitle,
    label,
    titleHighlight,
    description,
    cta,
    secondary,
  } = promoVideo
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
  }, [])

  return (
    <section
      id="promo"
      className="border-t border-slate-200 bg-surface-alt py-16 lg:py-20"
      aria-labelledby="promo-section-heading"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mb-10 text-center lg:mb-12">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            {sectionLabel}
          </p>
          <h2
            id="promo-section-heading"
            className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            {sectionTitle}
          </h2>
          <div
            className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-brand via-brand-light to-accent"
            aria-hidden="true"
          />
        </header>

        <div className="relative min-h-[min(72vh,640px)] overflow-hidden rounded-sm shadow-xl shadow-brand/15">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
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

          <div className="relative flex min-h-[min(72vh,640px)] items-center justify-center px-6 py-16 sm:px-10 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="animate-promo-fade-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-white uppercase backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
                {label}
              </p>

              <h2
                id="promo-heading"
                className="animate-promo-fade-up animation-delay-100 mt-6 font-serif text-2xl leading-[1.15] text-white sm:text-3xl md:text-4xl lg:text-[4rem] lg:leading-[1.12]"
              >
                {titleHighlight}
              </h2>

              <div
                className="animate-promo-fade-up animation-delay-200 mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-accent via-white to-accent"
                aria-hidden="true"
              />

              <p className="animate-promo-fade-up animation-delay-200 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg md:leading-relaxed">
                {description}
              </p>

              <div className="animate-promo-fade-up animation-delay-300 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                <a
                  href={cta.href}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-accent px-8 py-3.5 text-sm font-semibold tracking-wide text-white uppercase shadow-lg shadow-accent/30 transition-transform hover:scale-[1.03] hover:bg-accent-hover"
                >
                  <span
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden="true"
                  />
                  {cta.label}
                </a>
                <a
                  href={secondary.href}
                  className="inline-flex items-center justify-center rounded-sm border-2 border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold tracking-wide text-white uppercase backdrop-blur-sm transition-colors hover:border-white hover:bg-white/20"
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
