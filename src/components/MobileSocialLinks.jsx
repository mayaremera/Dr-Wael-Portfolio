import { site } from '../data/content'
import ThreadsIcon from './icons/ThreadsIcon'
import { AcademicProfileIcons } from './AcademicProfileIcons'

function HeroSocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:border-white/45 hover:bg-white/20"
    >
      {children}
    </a>
  )
}

function BarSocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-muted text-brand transition-colors hover:bg-brand hover:text-white"
    >
      {children}
    </a>
  )
}

function SocialLinksList({ variant }) {
  const Link = variant === 'hero' ? HeroSocialLink : BarSocialLink
  const iconClass = variant === 'hero' ? 'h-3.5 w-3.5' : 'h-3 w-3'

  return (
    <>
      <Link href={site.social.facebook} label="Facebook">
        <svg viewBox="0 0 24 24" className={`${iconClass} fill-current`} aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </Link>
      <Link href={site.social.twitter} label="X / Twitter">
        <svg viewBox="0 0 24 24" className={`${iconClass} fill-current`} aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </Link>
      <Link href={site.social.threads} label="Threads">
        <ThreadsIcon className={variant === 'hero' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
      </Link>
      <Link href={site.social.linkedin} label="LinkedIn">
        <svg viewBox="0 0 24 24" className={`${iconClass} fill-current`} aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </Link>
      <AcademicProfileIcons compact variant="header" heroStyle={variant === 'hero'} />
    </>
  )
}

export default function MobileSocialLinks({ variant = 'bar', className = '', label = 'Connect' }) {
  if (variant === 'hero') {
    return (
      <div className={`max-lg:block lg:hidden ${className}`.trim()}>
        <p className="text-[0.625rem] font-semibold tracking-[0.2em] text-white/55 uppercase">{label}</p>
        <div className="mobile-icon-scroll mobile-icon-scroll--inset mt-2.5">
          <div className="flex w-max items-center gap-2 pr-3">
            <SocialLinksList variant="hero" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`mobile-icon-scroll ${className}`.trim()}>
      <div className="flex w-max items-center gap-1.5 pr-2">
        <SocialLinksList variant="bar" />
      </div>
    </div>
  )
}
