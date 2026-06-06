export const contactButtonBaseClassName =
  'inline-flex items-center justify-center rounded-sm border-0 px-5 py-2.5 text-sm font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30'

export const contactButtonFillClassName = 'bg-brand text-white hover:bg-brand-light'

export const contactButtonClassName = `${contactButtonBaseClassName} ${contactButtonFillClassName}`

export function getHeaderContactButtonClass({ active, scrolled }) {
  if (active) {
    return scrolled
      ? 'bg-brand-light text-white ring-2 ring-brand/30'
      : 'bg-brand text-white ring-2 ring-white/40'
  }

  if (scrolled) {
    return 'bg-brand text-white hover:bg-brand-light'
  }

  return 'bg-white text-brand hover:bg-brand-muted'
}

export default function ContactButton({
  as: Component = 'a',
  className = '',
  headerState,
  children,
  ...props
}) {
  const fillClass = headerState
    ? getHeaderContactButtonClass(headerState)
    : contactButtonFillClassName

  return (
    <Component className={`${contactButtonBaseClassName} ${fillClass} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}
