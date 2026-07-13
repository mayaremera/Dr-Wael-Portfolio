import ContactButton from './ContactButton'

const sectionLinkClassName =
  'relative inline-block w-fit pb-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand-light hover:after:scale-x-100'

export default function NotFoundPage() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="font-serif text-[10rem] leading-none font-bold text-brand-light/10 sm:text-[14rem] lg:text-[18rem]">
          404
        </span>
      </div>
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <div className="mx-auto mb-6 h-0.5 w-12 rounded-full bg-brand" aria-hidden="true" />
        <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Page not found</p>
        <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
          Oops! This page doesn&apos;t exist.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/70">
          The page you&apos;re looking for seems to have wandered off. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ContactButton href="/">Back to Home</ContactButton>
          <a href="/services" className={sectionLinkClassName}>
            Browse Services
          </a>
        </div>
      </div>
    </section>
  )
}
