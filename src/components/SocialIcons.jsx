import { site } from '../data/content'

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

export default function SocialIcons({ compact = false, className = '' }) {
  const iconClass = compact ? 'h-3 w-3' : 'h-3.5 w-3.5'

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`.trim()}>
      <SocialIcon href={site.social.facebook} label="Facebook" compact={compact}>
        <svg viewBox="0 0 24 24" className={`${iconClass} fill-current`} aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </SocialIcon>
      <SocialIcon href={site.social.twitter} label="X / Twitter" compact={compact}>
        <svg viewBox="0 0 24 24" className={`${iconClass} fill-current`} aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </SocialIcon>
      <SocialIcon href={site.social.threads} label="Threads" compact={compact}>
        <svg viewBox="0 0 24 24" className={`${iconClass} fill-current`} aria-hidden="true">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.011v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.11.636c-.52-1.635-1.368-2.918-2.534-3.812C17.705 1.75 15.413 1.17 12.2 1.15h-.01c-3.01.022-5.312.911-6.838 2.647-1.433 1.635-2.17 3.985-2.196 6.973v.015c.026 2.988.763 5.338 2.196 6.973 1.526 1.736 3.828 2.625 6.838 2.647h.01c2.39-.017 4.223-.643 5.67-1.947 1.558-1.402 2.377-3.573 2.432-6.458v-.844H12.01v-2.11h5.84v1.086c-.053 3.31-1.148 6.168-3.278 8.078-1.874 1.692-4.467 2.542-7.786 2.564z" />
        </svg>
      </SocialIcon>
      <SocialIcon href={site.social.linkedin} label="LinkedIn" compact={compact}>
        <svg viewBox="0 0 24 24" className={`${iconClass} fill-current`} aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </SocialIcon>
    </div>
  )
}
