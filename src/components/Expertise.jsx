import { images, whyChooseUs } from '../data/content'

export default function Expertise() {
  return (
    <section id="expertise" className="border-t border-slate-200 bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-sm bg-white shadow-md ring-1 ring-slate-200/80 lg:grid lg:grid-cols-2">
          {/* Content — left on desktop, below image on mobile */}
          <div className="order-2 flex flex-col justify-center px-8 py-10 sm:px-10 lg:order-1 lg:px-12 lg:py-14 xl:px-14">
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">
              {whyChooseUs.label}
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-[2.125rem] lg:text-4xl">
              {whyChooseUs.title}
            </h2>
            <div className="mt-5 h-1 w-14 rounded-full bg-brand" aria-hidden="true" />

            <div className="mt-8 space-y-5">
              {whyChooseUs.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-sm leading-relaxed md:text-base ${
                    index === 0
                      ? 'text-ink md:text-[1.05rem] md:leading-relaxed'
                      : 'text-ink-muted'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-10 inline-block w-fit rounded-sm bg-brand px-6 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light"
            >
              Book a Consultation
            </a>
          </div>

          {/* Family photo — right on desktop, top on mobile */}
          <div className="relative order-1 min-h-[260px] sm:min-h-[320px] lg:order-2 lg:min-h-[520px]">
            <img
              src={images.family}
              alt="Family receiving speech-language support"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Soft white wash over the full image */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/10"
              aria-hidden="true"
            />
            {/* Stronger fade from the left into the text panel */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/15 via-white/30 to-white/5"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-white via-white/55 to-transparent lg:block"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
