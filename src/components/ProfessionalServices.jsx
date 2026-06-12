import { professionalServices } from '../data/content'
import ContactButton from './ContactButton'

const serviceIcons = [
  (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h2.5l1-2h3l1 2H19a2 2 0 012 2v12a2 2 0 01-2 2z" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-16 0H3m2 0h10M9 7h1m-1 4h1m4-4h1m-1 4h1" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" />
    </svg>
  ),
]

export default function ProfessionalServices() {
  return (
    <section id="professional-services" className="border-b border-slate-200 bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{professionalServices.label}</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{professionalServices.title}</h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-muted md:text-base">{professionalServices.intro}</p>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {professionalServices.availableFor.map((service, index) => (
            <article
              key={service.title}
              className="rounded-sm border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                {serviceIcons[index % serviceIcons.length]}
              </div>
              <h3 className="mt-4 font-serif text-lg text-ink">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{service.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <ContactButton href="#contact-form">Get in Touch</ContactButton>
        </div>
      </div>
    </section>
  )
}
