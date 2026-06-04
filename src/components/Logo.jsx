import logo from '../assets/logo-wa-transparent.png'

export default function Logo({ scrolled = false, className = '' }) {
  return (
    <img
      src={logo}
      alt=""
      className={`h-[3.3rem] w-auto shrink-0 transition-[filter] duration-300 lg:h-[3.3rem] ${
        scrolled ? '' : 'brightness-0 invert'
      } ${className}`}
    />
  )
}
