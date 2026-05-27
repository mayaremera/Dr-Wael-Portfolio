import { useState, useEffect } from 'react'

const navLinks = [
  { href: '#profile', label: 'About' },
  { href: '#approach', label: 'Approach' },
  { href: '#certificates', label: 'Certificates' },
  { href: '#video', label: 'Video' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-100 bg-white/95 py-4 shadow-sm backdrop-blur-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 lg:px-8">
        <a
          href="#"
          className={`font-serif text-xl tracking-wide transition-colors ${
            scrolled ? 'text-brand' : 'text-white'
          }`}
        >
          Dr. Wael Al-Dakroury
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide uppercase transition-colors ${
                scrolled
                  ? 'text-ink-muted hover:text-brand'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className={`hidden rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide transition-colors lg:inline-block ${
            scrolled
              ? 'bg-brand text-white hover:bg-brand-light'
              : 'bg-white text-brand hover:bg-brand-muted'
          }`}
        >
          Get in Touch
        </a>

        <button
          type="button"
          className="flex flex-col gap-1.5 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-px w-6 transition-all ${
                scrolled ? 'bg-ink' : 'bg-white'
              } ${open && i === 0 ? 'translate-y-[7px] rotate-45' : ''} ${
                open && i === 1 ? 'opacity-0' : ''
              } ${open && i === 2 ? '-translate-y-[7px] -rotate-45' : ''}`}
            />
          ))}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-100 bg-white px-6 py-6 lg:hidden">
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm tracking-wide text-ink-muted uppercase"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="inline-block rounded-sm bg-brand px-5 py-2.5 text-sm font-medium text-white"
                onClick={() => setOpen(false)}
              >
                Get in Touch
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
