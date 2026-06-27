import { site } from '../data/content'
import GoogleScholarIcon from './icons/GoogleScholarIcon'
import ResearchGateIcon from './icons/ResearchGateIcon'
import OrcidIcon from './icons/OrcidIcon'

function HeaderAcademicLink({ href, label, title, compact, heroStyle = false, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={title}
      className={`flex items-center justify-center rounded-full transition-colors ${
        heroStyle
          ? 'h-9 w-9 shrink-0 border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-white/45 hover:bg-white/20'
          : `bg-brand-muted text-brand hover:bg-brand hover:text-white ${compact ? 'h-7 w-7' : 'h-8 w-8'}`
      }`}
    >
      {children}
    </a>
  )
}

function FooterAcademicLink({ href, label, title, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={title}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:border-white hover:bg-white/10"
    >
      {children}
    </a>
  )
}

export function AcademicProfileIcons({ compact = false, variant = 'header', heroStyle = false }) {
  const { academic } = site
  const iconClass =
    variant === 'footer' ? 'h-4 w-4' : heroStyle ? 'h-3.5 w-3.5' : compact ? 'h-3 w-3' : 'h-3.5 w-3.5'
  const Link = variant === 'footer' ? FooterAcademicLink : HeaderAcademicLink

  return (
    <>
      <Link href={academic.googleScholar} label="Google Scholar" compact={compact} heroStyle={heroStyle}>
        <GoogleScholarIcon className={iconClass} />
      </Link>
      <Link href={academic.researchGate} label="ResearchGate" compact={compact} heroStyle={heroStyle}>
        <ResearchGateIcon className={iconClass} />
      </Link>
      <Link
        href={academic.orcid}
        label={`ORCID ${academic.orcidId}`}
        title={academic.orcidId}
        compact={compact}
        heroStyle={heroStyle}
      >
        <OrcidIcon className={iconClass} />
      </Link>
    </>
  )
}
