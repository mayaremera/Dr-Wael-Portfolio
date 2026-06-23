import logoMark from '../assets/logo-wa-mark.png'

export function Spinner({ className = 'h-8 w-8' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-brand/20 border-t-brand ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

function AnimatedLogoMark() {
  return (
    <span
      className="page-loader__logo-mark"
      aria-hidden="true"
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

export default function PageLoader({ variant = 'fullscreen' }) {
  const positionClass =
    variant === 'below-header'
      ? 'inset-x-0 bottom-0 top-14 lg:top-[8.75rem]'
      : variant === 'dashboard'
        ? 'inset-y-0 right-0 left-0 lg:left-72 xl:left-80'
        : 'inset-0'

  return (
    <div
      className={`page-loader fixed z-[60] flex items-center justify-center ${positionClass}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <AnimatedLogoMark />
    </div>
  )
}
