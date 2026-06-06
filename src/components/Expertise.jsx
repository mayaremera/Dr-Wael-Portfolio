import { images, whyChooseUs } from '../data/content'
import ContactButton from './ContactButton'

export default function Expertise() {
  return (
    <section id="expertise" className="border-t border-slate-200 bg-surface-alt py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-sm bg-white shadow-md ring-1 ring-slate-200/80 lg:grid lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-8 py-10 sm:px-10 lg:order-1 lg:px-12 lg:py-14 xl:px-14">
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">
              {whyChooseUs.label}
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-[2.125rem] lg:text-4xl">
              {whyChooseUs.title}
            </h2>
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

            <ContactButton href="#contact" className="mt-10 w-fit">
              Contact Us Now
            </ContactButton>
          </div>

          <div className="relative order-1 min-h-[260px] sm:min-h-[320px] lg:order-2 lg:min-h-[520px]">
            <img
              src={images.family}
              alt="Family receiving speech-language support"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface-alt/85 via-surface-alt/25 to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-surface-alt via-surface-alt/40 to-transparent lg:block"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
