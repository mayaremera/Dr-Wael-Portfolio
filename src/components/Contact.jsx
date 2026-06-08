import { useContactContent } from '../hooks/useContactContent'
import ContactButton from './ContactButton'

const problemTypes = [
  'Screening inquiry',
  'Assessment request',
  'Family counseling',
  'Therapy appointment',
  'Professional collaboration',
  'Other',
]

const dayAbbrev = {
  Sunday: 'Sun',
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 2" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 5 8-5M4 7v10h16V7" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 4h2l1.5 4-2 1.5a11 11 0 005.5 5.5L17 13l4 1.5v2a2 2 0 01-2 2A15 15 0 014 6.5 2 2 0 016.5 4z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" />
    </svg>
  )
}

function ContactLink({ href, label, icon, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white/70 px-4 py-3 text-sm transition-all duration-300 hover:border-brand/25 hover:bg-white hover:shadow-md hover:shadow-brand/5"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
        {icon}
      </span>
      <span className="font-medium text-ink transition-colors group-hover:text-brand">{label}</span>
    </a>
  )
}

function WeekSchedule({ schedule }) {
  const weekdays = schedule.filter((entry) => !entry.weekend)
  const weekend = schedule.filter((entry) => entry.weekend)

  return (
    <div className="mt-5 space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {weekdays.map((entry) => (
          <div
            key={entry.day}
            className="rounded-lg border border-slate-200/80 bg-white/80 px-2 py-3 text-center transition-colors hover:border-brand/20"
          >
            <p className="text-[0.65rem] font-bold tracking-wide text-brand uppercase">
              {dayAbbrev[entry.day]}
            </p>
            <p className="mt-2 text-[0.6rem] leading-snug text-ink-muted lg:text-[0.65rem]">
              {entry.hours.replace(' – ', '–').replace(' AM', '').replace(' PM', '')}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-brand/25 to-transparent" aria-hidden="true" />
        <span className="text-[0.6rem] font-semibold tracking-[0.2em] text-accent uppercase">Weekend</span>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-brand/25 to-transparent" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {weekend.map((entry) => (
          <div
            key={entry.day}
            className="rounded-lg bg-accent px-3 py-3 text-center text-white shadow-md shadow-accent/30"
          >
            <p className="text-[0.65rem] font-bold tracking-wide uppercase">{dayAbbrev[entry.day]}</p>
            <p className="mt-1 text-xs font-semibold">{entry.hours}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const fieldClassName =
  'w-full rounded-lg border border-slate-200/90 bg-white px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-muted/50 focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

export default function Contact() {
  const { contactDetails, directContact } = useContactContent()
  const { workplace } = contactDetails

  return (
    <section id="contact" className="relative overflow-hidden border-t border-slate-200 bg-surface-alt py-20 lg:py-28">
      <div
        className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-12 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-muted/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="animate-fade-up text-xs font-semibold tracking-[0.24em] text-brand uppercase">
            Contact & Appointment
          </p>
          <h2 className="animate-fade-up animation-delay-100 mt-4 font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-[2.75rem]">
            Let&apos;s start the conversation
          </h2>
          <p className="animate-fade-up animation-delay-200 mt-5 text-base leading-relaxed text-ink-muted md:text-lg">
            Parents, colleagues, and institutions are welcome. Reach out to book a session or ask a question.
          </p>
        </header>

        <div className="animate-fade-up animation-delay-300 mt-12 grid gap-5 lg:mt-16 lg:grid-cols-12 lg:gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand via-brand-light to-brand p-6 text-white shadow-xl shadow-brand/25 lg:col-span-5 lg:p-8">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/25 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase backdrop-blur-sm">
                <LocationIcon />
                Practice Location
              </div>

              <h3 className="mt-6 font-serif text-2xl leading-snug md:text-3xl">{workplace.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">{workplace.department}</p>
              <p className="mt-1 text-sm font-medium text-accent">{workplace.city}</p>

              <div className="mt-8 border-t border-white/15 pt-6">
                <div className="inline-flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-white/70">
                  <ClockIcon />
                  Office Hours
                </div>
                <WeekSchedule schedule={contactDetails.schedule} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-3">
            <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">Direct Contact</p>
            <ContactLink href={`mailto:${directContact.email}`} label={directContact.email} icon={<MailIcon />} />
            <ContactLink
              href={`tel:${directContact.phone.replace(/\s/g, '')}`}
              label={directContact.phone}
              icon={<PhoneIcon />}
            />
            <ContactLink
              href={`https://${directContact.domain}/`}
              label={directContact.domain}
              icon={<GlobeIcon />}
              external
            />

            <div className="mt-auto hidden rounded-2xl border border-dashed border-brand/20 bg-brand-muted/50 p-5 lg:block">
              <p className="font-serif text-lg text-brand">English & Arabic</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Consultations and sessions available in both languages.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-brand/5 lg:col-span-4 lg:p-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Appointment Request</p>
            <h3 className="mt-2 font-serif text-2xl text-ink">Send a message</h3>
            <p className="mt-2 text-sm text-ink-muted">We&apos;ll get back to you as soon as possible.</p>

            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                    First Name
                  </label>
                  <input id="firstName" type="text" className={fieldClassName} placeholder="Your first name" />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                    Last Name
                  </label>
                  <input id="lastName" type="text" className={fieldClassName} placeholder="Your last name" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                  Email
                </label>
                <input id="email" type="email" className={fieldClassName} placeholder={directContact.email} />
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                  Subject
                </label>
                <select id="subject" className={fieldClassName} defaultValue="">
                  <option value="" disabled>
                    Select a subject
                  </option>
                  {problemTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className={`${fieldClassName} resize-none`}
                  placeholder="How can we help?"
                />
              </div>

              <ContactButton as="button" type="submit" className="w-full">
                Contact Us Now
              </ContactButton>
            </form>
          </div>
        </div>

        <p className="animate-fade-up animation-delay-300 mt-8 text-center text-sm text-ink-muted lg:hidden">
          Consultations available in English and Arabic.
        </p>
      </div>
    </section>
  )
}
