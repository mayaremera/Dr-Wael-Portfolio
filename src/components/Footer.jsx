import { site, footerServices } from '../data/content'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-surface-tint py-12">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-xl text-brand">{site.name}, {site.suffix}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {site.tagline}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-brand uppercase">
              Services
            </p>
            <ul className="mt-4 space-y-2">
              {footerServices.map((service) => (
                <li key={service} className="text-sm text-ink-muted">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-brand uppercase">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-brand">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-brand">
                  {site.phone}
                </a>
              </li>
              <li>{site.hours}</li>
              <li>
                <a
                  href={`https://${site.domain}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand"
                >
                  {site.domain}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-center md:flex-row md:text-left">
          <p className="text-sm text-ink-muted">
            Bilingual services in {site.languages.join(' & ')}
          </p>
          <p className="text-sm text-ink-muted">
            &copy; {year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
