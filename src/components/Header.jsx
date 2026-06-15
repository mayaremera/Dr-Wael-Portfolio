import { useState, useEffect } from 'react'
import { site } from '../data/content'
import ContactButton from './ContactButton'
import Logo from './Logo'
import MobileBottomNav from './MobileBottomNav'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about-me', label: 'About Me' },
  { href: '/services', label: 'Services' },
  { href: '/video-gallery', label: 'Video / Gallery' },
  { href: '/in-the-field', label: 'In the Field' },
]

function getCurrentPath() {
  const rawPath = window.location.pathname.replace(/\/+$/, '') || '/'
  return rawPath === '/cases' ? '/services' : rawPath
}

function isLinkActive(href, currentPath) {
  if (href === '/') return currentPath === '/'
  return currentPath === href
}

function SocialIcon({ href, label, children, compact = false }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`flex items-center justify-center rounded-full bg-brand-muted text-brand transition-colors hover:bg-brand hover:text-white ${
        compact ? 'h-7 w-7' : 'h-8 w-8'
      }`}
    >
      {children}
    </a>
  )
}

function ContactIcon({ href, label, children, compact = false }) {
  return (
    <a
      href={href}
      aria-label={label}
      className={`flex items-center justify-center rounded-full bg-brand-muted text-brand transition-colors hover:bg-brand hover:text-white ${
        compact ? 'h-7 w-7' : 'h-8 w-8'
      }`}
    >
      {children}
    </a>
  )
}

function SocialIcons({ compact = false }) {
  const iconClass = compact ? 'h-3 w-3' : 'h-3.5 w-3.5'

  return (
    <>
      <SocialIcon href={site.social.facebook} label="Facebook" compact={compact}>
        <svg viewBox="0 0 24 24" className={`${iconClass} fill-current`} aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </SocialIcon>
      <SocialIcon href={site.social.twitter} label="X / Twitter" compact={compact}>
        <svg viewBox="0 0 24 24" className={`${iconClass} fill-current`}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </SocialIcon>
      <SocialIcon href={site.social.instagram} label="Instagram" compact={compact}>
        <svg viewBox="0 0 24 24" className={`${iconClass} fill-none stroke-current`} strokeWidth="2.2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      </SocialIcon>
      <SocialIcon href={site.social.linkedin} label="LinkedIn" compact={compact}>
        <svg viewBox="0 0 24 24" className={`${iconClass} fill-current`}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </SocialIcon>
    </>
  )
}

function PhoneMailIcons({ compact = false }) {
  const iconClass = compact ? 'h-3 w-3' : 'h-3.5 w-3.5'

  return (
    <>
      <ContactIcon href={`tel:${site.phone.replace(/\s/g, '')}`} label={`Call ${site.phone}`} compact={compact}>
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      </ContactIcon>
      <ContactIcon href={`mailto:${site.email}`} label={`Email ${site.email}`} compact={compact}>
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </ContactIcon>
    </>
  )
}

function NavLink({ href, label, scrolled, active, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`relative pb-1 text-sm tracking-wide uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-transform after:duration-300 after:ease-out ${
        active ? 'after:scale-x-100 font-semibold' : 'after:scale-x-0 hover:after:scale-x-100'
      } ${
        scrolled
          ? active
            ? 'text-brand after:bg-brand'
            : 'text-ink-muted after:bg-brand hover:text-brand'
          : active
            ? 'text-white after:bg-white'
            : 'text-white/85 after:bg-white hover:text-white'
      }`}
    >
      {label}
    </a>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const currentPath = getCurrentPath()
  const isContactActive = currentPath === '/contact'
  const isInTheField = currentPath === '/in-the-field'
  const headerScrolled = scrolled || isInTheField

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
    <div className="fixed top-0 right-0 left-0 z-50">
      <div className="border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 md:gap-4 md:px-6 lg:px-8 lg:py-2.5">
          <a
            href="/"
            aria-label="Home"
            className="flex shrink-0 items-center transition-opacity hover:opacity-90 md:hidden"
          >
            <Logo scrolled className="!h-9" />
          </a>

          <div className="flex shrink-0 items-center gap-1 md:hidden">
            <SocialIcons compact />
            <PhoneMailIcons compact />
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <SocialIcons />
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <div className="flex items-center gap-2 lg:hidden">
              <PhoneMailIcons />
            </div>

            <a
              href={`tel:${site.phone.replace(/\s/g, '')}`}
              className="group hidden min-w-0 items-center gap-2 hover:text-brand-light lg:flex"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 text-brand"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              <span className="truncate text-xs font-bold text-ink group-hover:text-brand lg:text-sm">
                {site.phone}
              </span>
            </a>

            <span className="hidden h-4 w-px bg-slate-300 lg:inline" />

            <a
              href={`mailto:${site.email}`}
              className="group hidden min-w-0 items-center gap-2 hover:text-brand-light lg:flex"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 text-brand"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <span className="truncate text-xs font-bold text-ink group-hover:text-brand lg:text-sm">
                {site.email}
              </span>
            </a>
          </div>
        </div>
      </div>

      <header
        className={`hidden transition-all duration-300 lg:block ${
          headerScrolled
            ? 'border-b border-slate-100 bg-white/95 py-4 shadow-sm backdrop-blur-sm'
            : 'bg-transparent py-4 lg:py-5'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 lg:gap-6 lg:px-8">
          <a
            href="/"
            aria-label="Home"
            className="flex shrink-0 items-center transition-opacity hover:opacity-90"
          >
            <Logo scrolled={headerScrolled} />
          </a>

          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                scrolled={headerScrolled}
                active={isLinkActive(link.href, currentPath)}
              />
            ))}
          </nav>

          <ContactButton
            href="/contact"
            aria-current={isContactActive ? 'page' : undefined}
            className="hidden lg:inline-flex"
            headerState={{ active: isContactActive, scrolled: headerScrolled }}
          >
            Contact Us Now
          </ContactButton>
        </div>
      </header>
    </div>
    <MobileBottomNav />
    </>
  )
}
