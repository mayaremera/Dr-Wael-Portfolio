import logoMark from '../assets/logo-wa-mark.png'

function LogoMark({ scrolled, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 transition-all duration-500 ease-out ${
        scrolled
          ? 'bg-brand group-hover:bg-brand-light'
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

export default function Logo({ scrolled = false, className = '', markOnly = false, compactText = false }) {
  const textTone = scrolled ? 'text-ink' : 'text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]'
  const credentialTone = scrolled ? 'text-ink-muted' : 'text-white/80'

  return (
    <div className={`group flex h-[2.75rem] items-center gap-2 sm:gap-2.5 lg:h-[3.15rem] lg:gap-3 ${className}`}>
      <LogoMark scrolled={scrolled} className="h-full w-auto shrink-0" />
      {!markOnly ? (
      <div className="flex min-w-0 flex-col leading-none">
        <span
          className={`font-serif font-medium tracking-[0.01em] transition-colors duration-500 ${
            compactText
              ? 'text-[0.72rem] sm:text-[0.8rem]'
              : 'text-[0.72rem] sm:text-[0.8rem] lg:text-[1.02rem] xl:text-[1.08rem]'
          } ${textTone}`}
        >
          Wael Al-Dakroury
        </span>
        <span
          className={`mt-0.5 font-sans font-semibold tracking-[0.16em] uppercase transition-colors duration-500 lg:mt-1 lg:tracking-[0.2em] ${
            compactText
              ? 'text-[0.42rem] sm:text-[0.46rem]'
              : 'text-[0.42rem] sm:text-[0.46rem] lg:text-[0.56rem] xl:text-[0.58rem]'
          } ${credentialTone}`}
        >
          PhD, CCC-SLP, F-ASHA
        </span>
      </div>
      ) : null}
    </div>
  )
}
