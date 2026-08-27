import { useState } from 'react'
import { useContactContent } from '../hooks/useContactContent'
import { toWhatsAppHref } from '../data/contactContentStore'
import ContactButton from './ContactButton'
import { CONTACT_RECIPIENT_EMAIL, submitContactForm } from '../lib/contactFormSubmit'

const problemTypes = [
  'Screening inquiry',
  'Assessment request',
  'Family counseling',
  'Therapy appointment',
  'Professional consultation',
  'Speaking engagement',
  'Workshop or training program',
  'University lecture',
  'Clinical supervision & mentorship',
  'International collaboration',
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function ContactLink({ href, label, icon, external, compact = false }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white/70 text-sm transition-all duration-300 hover:border-brand/25 hover:bg-white hover:shadow-md hover:shadow-brand/5 ${
        compact ? 'min-h-11 px-3.5 py-2.5' : 'px-4 py-3'
      }`}
    >
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white ${
          compact ? 'h-8 w-8' : 'h-9 w-9'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 font-medium text-ink transition-colors group-hover:text-brand">{label}</span>
    </a>
  )
}

function MobileWeekSchedule({ schedule }) {
  const weekdays = schedule.filter((entry) => !entry.weekend)
  const weekend = schedule.filter((entry) => entry.weekend)

  return (
    <div className="mt-4 space-y-2">
      {weekdays.map((entry) => (
        <div
          key={entry.day}
          className="flex items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/10 px-3 py-2"
        >
          <span className="text-xs font-semibold tracking-wide text-white">{dayAbbrev[entry.day]}</span>
          <span className="text-right text-xs text-white/85">{entry.hours}</span>
        </div>
      ))}

      <div className="flex items-center gap-2 pt-1">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />
        <span className="text-[0.58rem] font-semibold tracking-[0.16em] text-accent uppercase">Weekend</span>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {weekend.map((entry) => (
          <div
            key={entry.day}
            className="rounded-lg bg-accent/90 px-2.5 py-2 text-center text-white shadow-sm shadow-accent/20"
          >
            <p className="text-[0.62rem] font-bold tracking-wide uppercase">{dayAbbrev[entry.day]}</p>
            <p className="mt-0.5 text-[0.68rem] font-semibold">{entry.hours}</p>
          </div>
        ))}
      </div>
    </div>
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
  'w-full rounded-lg border border-slate-200/90 bg-white px-4 py-3 text-base text-ink outline-none transition-all placeholder:text-ink-muted/50 focus:border-brand/40 focus:ring-2 focus:ring-brand/15 lg:text-sm'

export default function Contact() {
  const { isReady, contactSection, contactDetails, directContact } = useContactContent()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [botcheck, setBotcheck] = useState(false)

  if (!isReady || !contactDetails || !directContact) return null

  const { workplace } = contactDetails

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    if (status !== 'idle') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (botcheck) return

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.subject || !form.message.trim()) {
      setStatus('error')
      setErrorMessage('Please fill in all fields before sending.')
      return
    }

    setStatus('sending')
    setErrorMessage('')

    try {
      await submitContactForm({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        subject: form.subject,
        message: form.message,
      })

      setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' })
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : `Unable to send your message. Please email us directly at ${CONTACT_RECIPIENT_EMAIL}.`,
      )
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden border-t border-slate-200 bg-surface-alt py-12 lg:py-28">
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
            {contactSection?.label}
          </p>
          <h2 className="animate-fade-up animation-delay-100 mt-2 font-serif text-2xl leading-tight text-ink sm:mt-4 sm:text-3xl md:text-4xl lg:text-[2.75rem]">
            {contactSection?.title}
          </h2>
          <p className="animate-fade-up animation-delay-200 mt-3 text-sm leading-relaxed text-ink-muted sm:mt-5 sm:text-base md:text-lg">
            {contactSection?.intro}
          </p>
        </header>

        <div className="home-contact-layout animate-fade-up animation-delay-300 mt-8 grid gap-4 sm:gap-5 lg:mt-16 lg:grid-cols-12 lg:gap-6">
          <div className="order-1 flex flex-col gap-3 lg:order-2 lg:col-span-3 lg:gap-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">Direct Contact</p>
            <div className="grid gap-2.5 sm:gap-3">
              <ContactLink
                href={`mailto:${directContact.email}`}
                label={directContact.email}
                icon={<MailIcon />}
                compact
              />
              <ContactLink
                href={`tel:${directContact.phone.replace(/[^\d+]/g, '')}`}
                label={directContact.phone}
                icon={<PhoneIcon />}
                compact
              />
              {directContact.whatsapp?.trim() ? (
                <ContactLink
                  href={toWhatsAppHref(directContact.whatsapp)}
                  label={directContact.whatsapp.trim()}
                  icon={<WhatsAppIcon />}
                  external
                  compact
                />
              ) : null}
            </div>

            <div className="contact-lang-mobile rounded-xl border border-brand/20 bg-brand-muted/50 p-4 lg:mt-auto lg:hidden">
              <p className="font-serif text-base text-ink">Bilingual Services</p>
              <p className="mt-1.5 text-sm leading-relaxed text-brand">
                Arabic & English
              </p>
            </div>

            <div className="contact-lang-desktop mt-auto hidden rounded-2xl border border-dashed border-brand/20 bg-brand-muted/50 p-5 lg:block">
              <p className="font-serif text-lg text-ink">Bilingual Services</p>
              <p className="mt-2 text-sm leading-relaxed text-brand">
                Arabic & English
              </p>
            </div>
          </div>

          <div
            id="contact-form"
            className="order-2 rounded-xl border border-slate-200/80 bg-white p-4 shadow-lg shadow-brand/5 sm:p-6 lg:order-3 lg:col-span-4 lg:rounded-2xl lg:p-8"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Appointment Request</p>
            <h3 className="mt-1.5 font-serif text-xl text-ink sm:mt-2 sm:text-2xl">Send a message</h3>
            <p className="mt-1.5 text-sm text-ink-muted sm:mt-2">We&apos;ll get back to you as soon as possible.</p>

            <form className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4" onSubmit={handleSubmit} noValidate>
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                checked={botcheck}
                onChange={(event) => setBotcheck(event.target.checked)}
                className="hidden"
                style={{ display: 'none' }}
                aria-hidden="true"
              />
              <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label htmlFor="firstName" className="mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={updateField('firstName')}
                    className={fieldClassName}
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={updateField('lastName')}
                    className={fieldClassName}
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={updateField('email')}
                  className={fieldClassName}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={updateField('subject')}
                  className={fieldClassName}
                >
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
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={updateField('message')}
                  className={`${fieldClassName} resize-none`}
                  placeholder="How can we help?"
                />
              </div>

              <p className="rounded-lg border border-brand/15 bg-brand-muted/40 px-3.5 py-2.5 text-xs leading-relaxed text-ink-muted sm:px-4 sm:py-3 sm:text-sm">
                <span className="lg:hidden">Your message goes to Dr. Wael&apos;s work email — we&apos;ll reply soon.</span>
                <span className="hidden lg:inline">
                  This message will be sent to the work mail of Dr. Wael El Dakroury ({CONTACT_RECIPIENT_EMAIL}) and you
                  will receive a response soon.
                </span>
              </p>

              {status === 'success' && (
                <p className="rounded-lg border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-brand" role="status">
                  Your message has been sent successfully. We will get back to you soon.
                </p>
              )}

              {status === 'error' && errorMessage && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {errorMessage}
                </p>
              )}

              <ContactButton
                as="button"
                type="submit"
                className="min-h-11 w-full rounded-lg disabled:cursor-not-allowed disabled:opacity-60 lg:min-h-0 lg:rounded-sm"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </ContactButton>
            </form>
          </div>

          <div className="relative order-3 overflow-hidden rounded-xl bg-linear-to-br from-brand via-brand-light to-brand p-4 text-white shadow-xl shadow-brand/25 sm:p-6 lg:order-1 lg:col-span-5 lg:rounded-2xl lg:p-8">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/25 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.16em] uppercase backdrop-blur-sm sm:text-[0.65rem] sm:tracking-[0.18em]">
                <LocationIcon />
                Practice Location
              </div>

              <h3 className="mt-4 font-serif text-xl leading-snug sm:mt-6 sm:text-2xl md:text-3xl">{workplace.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/85 sm:mt-3">{workplace.department}</p>
              <p className="mt-1 text-sm font-medium text-accent">{workplace.city}</p>

              <div className="mt-6 border-t border-white/15 pt-5 sm:mt-8 sm:pt-6">
                <div className="inline-flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.16em] uppercase text-white/70 sm:text-[0.65rem] sm:tracking-[0.18em]">
                  <ClockIcon />
                  Office Hours
                </div>
                <div className="contact-schedule-mobile lg:hidden">
                  <MobileWeekSchedule schedule={contactDetails.schedule} />
                </div>
                <div className="contact-schedule-desktop hidden lg:block">
                  <WeekSchedule schedule={contactDetails.schedule} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
