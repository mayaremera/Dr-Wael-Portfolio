import { useHomeContent } from '../hooks/useHomeContent'
import { hasMediaSrc } from '../lib/mediaUrl'
import ContactButton from './ContactButton'

export default function Expertise() {
  const { content, isReady } = useHomeContent()
  if (!isReady || !content) return null

  const { whyChooseUs } = content
  const imageSrc = whyChooseUs.image

  return (
    <section id="expertise" className="bg-surface-alt pb-12 max-lg:pt-0 lg:border-t lg:border-slate-200 lg:py-28">
      {/* Mobile: full-width image banner */}
      {hasMediaSrc(imageSrc) ? (
        <div className="expertise-mobile-banner relative mb-6 aspect-[16/10] w-full overflow-hidden lg:hidden">
          <img
            key={imageSrc}
            src={imageSrc}
            alt="Family receiving speech-language support"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="expertise-panel overflow-hidden lg:rounded-sm lg:bg-white lg:shadow-md lg:ring-1 lg:ring-slate-200/80 lg:grid lg:grid-cols-2">
          <div className="flex flex-col justify-center max-lg:px-0 lg:order-1 lg:px-12 lg:py-14 xl:px-14">
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">
              {whyChooseUs.label}
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-ink max-lg:max-w-none md:text-[2.125rem] lg:mt-4 lg:text-4xl">
              {whyChooseUs.title}
            </h2>
            <div className="mt-4 space-y-3 lg:mt-8 lg:space-y-5">
              {(whyChooseUs.paragraphs ?? []).map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-sm leading-relaxed lg:text-base ${
                    index === 0
                      ? 'text-ink lg:text-[1.05rem] lg:leading-relaxed'
                      : 'text-ink-muted'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <ContactButton
              href="#contact"
              className="mt-6 w-full max-md:!min-h-10 max-md:!justify-center max-md:!rounded-lg max-md:!py-2.5 max-md:!text-xs md:max-lg:w-fit lg:mt-10 lg:w-fit"
            >
              Contact Us Now
            </ContactButton>
          </div>

          <div className="expertise-panel-image relative hidden min-h-[520px] lg:order-2 lg:block">
            {hasMediaSrc(imageSrc) ? (
              <img
                key={imageSrc}
                src={imageSrc}
                alt="Family receiving speech-language support"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.28)_18%,transparent_32%)]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
