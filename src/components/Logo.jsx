import logoMark from '../assets/logo-wa-mark.png'

function LogoMark({ scrolled, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 transition-all duration-500 ease-out ${
        scrolled
          ? 'bg-accent group-hover:bg-accent-hover'
          : 'bg-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]'
      } ${className}`}
      style={{
        aspectRatio: '396 / 279',
        WebkitMaskImage: `url(${logoMark})`,
        maskImage: `url(${logoMark})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

export default function Logo({ scrolled = false, className = '', markOnly = false }) {
  const textTone = scrolled ? 'text-ink' : 'text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]'
  const credentialTone = scrolled ? 'text-ink-muted' : 'text-white/80'

  return (
    <div className={`group flex h-[2.75rem] items-center gap-2.5 sm:gap-3 lg:h-[3.15rem] ${className}`}>
      <LogoMark scrolled={scrolled} className="h-full w-auto" />
      {!markOnly ? (
      <div className="hidden min-w-0 flex-col leading-none lg:flex">
        <span
          className={`font-serif text-[1.02rem] font-medium tracking-[0.01em] transition-colors duration-500 xl:text-[1.08rem] ${textTone}`}
        >
          Wael Al-Dakroury
        </span>
        <span
          className={`mt-1 font-sans text-[0.56rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-500 xl:text-[0.58rem] ${credentialTone}`}
        >
          PhD, CCC-SLP, F-ASHA
        </span>
      </div>
      ) : null}
    </div>
  )
}
