import logo from '../assets/logo-wa-transparent.png'

export default function Logo({ scrolled = false, className = '' }) {
  return (
    <img
      src={logo}
      alt=""
      className={`h-12 w-auto shrink-0 transition-[filter] duration-300 lg:h-12 ${
        scrolled ? '' : 'brightness-0 invert'
      } ${className}`}
    />
  )
}
