import { site, footerQuickLinks } from '../data/content'

function FooterSocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:border-white hover:bg-white/10"
    >
      {children}
    </a>
  )
}

function FooterLinkColumn({ title, children }) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      {children}
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  const quickLinkColumns = [
    footerQuickLinks.slice(0, 3),
    footerQuickLinks.slice(3),
  ]

  return (
    <footer className="bg-brand">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-serif text-xl leading-snug text-white md:text-2xl">{site.name}</p>
            <p className="mt-2 text-sm text-white/65">{site.title}</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              {site.footerTagline}
            </p>
          </div>

          <FooterLinkColumn title="Quick Links">
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {quickLinkColumns.map((column, columnIndex) => (
                <ul key={columnIndex} className="space-y-2.5">
                  {column.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </FooterLinkColumn>

          <FooterLinkColumn title="Follow Us">
            <div className="mt-4 flex flex-wrap gap-3">
              <FooterSocialIcon href={site.social.facebook} label="Facebook">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </FooterSocialIcon>
              <FooterSocialIcon href={site.social.instagram} label="Instagram">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </FooterSocialIcon>
              <FooterSocialIcon href={site.social.youtube} label="YouTube">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </FooterSocialIcon>
              <FooterSocialIcon href={site.social.linkedin} label="LinkedIn">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </FooterSocialIcon>
            </div>
          </FooterLinkColumn>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-white/50">
            &copy; {year} {site.name}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <a href="/contact" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <span className="text-white/25" aria-hidden="true">
              |
            </span>
            <a href="/contact" className="transition-colors hover:text-white">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
