export default function VibeBand({
  label,
  title,
  description,
  primaryHref = '/contact',
  primaryLabel = 'Book Consultation',
  secondaryHref = '/services',
  secondaryLabel = 'Explore Services',
}) {
  return (
    <section className="border-t border-slate-200 bg-surface py-8 lg:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand via-brand-light to-brand p-5 text-white shadow-lg shadow-brand/20 sm:p-8 lg:rounded-sm lg:bg-linear-to-r lg:p-12">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/25 blur-2xl lg:-right-16 lg:-top-16 lg:h-44 lg:w-44" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-white/10 blur-3xl lg:-bottom-20 lg:-left-12 lg:h-48 lg:w-48" />

          <div className="relative text-center lg:text-left">
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-accent uppercase lg:text-xs lg:tracking-[0.22em]">
              {label}
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-snug lg:mt-3 lg:max-w-3xl lg:text-3xl lg:leading-tight xl:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/85 lg:mx-0 lg:mt-4 lg:max-w-2xl lg:text-base">
              {description}
            </p>
          </div>

          <div className="relative mt-5 flex flex-col gap-2.5 lg:mt-7 lg:flex-row lg:flex-wrap lg:gap-3">
            <a
              href={primaryHref}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:bg-brand-muted lg:min-h-0 lg:w-auto lg:rounded-sm lg:py-2.5"
            >
              {primaryLabel}
            </a>
            <a
              href={secondaryHref}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-white/40 bg-black/20 px-5 py-3 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm transition-colors hover:border-white hover:bg-black/30 lg:min-h-0 lg:w-auto lg:rounded-sm lg:py-2.5"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
