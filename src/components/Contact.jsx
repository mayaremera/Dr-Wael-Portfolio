import { site } from '../data/content'

const problemTypes = [
  'Screening inquiry',
  'Assessment request',
  'Family counseling',
  'Therapy appointment',
  'Professional collaboration',
  'Other',
]

export default function Contact() {
  return (
    <section id="contact" className="border-t border-slate-200 bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-brand uppercase">
              Contact & Appointment
            </p>
            <h2 className="mt-4 font-serif text-3xl font-medium text-ink md:text-4xl">
              Happy to connect with you
            </h2>
            <p className="mt-6 leading-relaxed text-ink-muted">
              Whether you are a parent seeking guidance for your child, a
              colleague interested in collaboration, or an institution looking for
              expert consultation. Reach out to begin the conversation.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href={`mailto:${site.email}`}
                className="block text-brand transition-colors hover:text-brand-light"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="block text-ink transition-colors hover:text-brand"
              >
                {site.phone}
              </a>
              <p className="text-ink-muted">
                Hours: {site.hours}
              </p>
              <a
                href={`https://${site.domain}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-ink-muted transition-colors hover:text-brand"
              >
                {site.domain}
              </a>
            </div>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-xs font-medium tracking-wide text-ink-muted uppercase"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full border-b border-slate-200 bg-transparent py-3 text-ink outline-none transition-colors focus:border-brand"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-xs font-medium tracking-wide text-ink-muted uppercase"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full border-b border-slate-200 bg-transparent py-3 text-ink outline-none transition-colors focus:border-brand"
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium tracking-wide text-ink-muted uppercase"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border-b border-slate-200 bg-transparent py-3 text-ink outline-none transition-colors focus:border-brand"
                placeholder={site.email}
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-xs font-medium tracking-wide text-ink-muted uppercase"
              >
                Subject
              </label>
              <select
                id="subject"
                className="w-full border-b border-slate-200 bg-transparent py-3 text-ink outline-none transition-colors focus:border-brand"
                defaultValue=""
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
              <label
                htmlFor="message"
                className="mb-2 block text-xs font-medium tracking-wide text-ink-muted uppercase"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full resize-none border-b border-slate-200 bg-transparent py-3 text-ink outline-none transition-colors focus:border-brand"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              className="rounded-sm bg-brand px-8 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-brand-light"
            >
              Make Appointment
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
