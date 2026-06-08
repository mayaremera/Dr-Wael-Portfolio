import { useCallback, useState } from 'react'
import logo from '../../assets/logo-wa-transparent.png'
import { DASHBOARD_PASSWORD_LENGTH, verifyDashboardPassword } from './dashboardAuth'

const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'backspace']

function PinDots({ length, filled }) {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      {Array.from({ length }).map((_, index) => (
        <span
          key={index}
          className={`h-3.5 w-3.5 rounded-full border-2 transition-all duration-200 ${
            index < filled
              ? 'scale-110 border-brand bg-brand'
              : 'border-slate-300 bg-transparent'
          }`}
        />
      ))}
    </div>
  )
}

function KeypadButton({ label, onClick, variant = 'digit' }) {
  const isAction = variant !== 'digit'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid h-14 place-items-center rounded-xl text-lg font-semibold transition-all active:scale-95 sm:h-16 ${
        isAction
          ? 'bg-surface-alt text-ink-muted hover:bg-brand-muted hover:text-brand'
          : 'bg-white text-ink shadow-sm ring-1 ring-slate-200/80 hover:bg-brand-muted hover:text-brand hover:ring-brand/20'
      }`}
      aria-label={
        label === 'backspace' ? 'Delete last digit' : label === 'clear' ? 'Clear code' : `Digit ${label}`
      }
    >
      {label === 'backspace' ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10l-6 6m0-6l6 6M5 7h11a2 2 0 012 2v6a2 2 0 01-2 2H8l-4-4V9a2 2 0 012-2z" />
        </svg>
      ) : label === 'clear' ? (
        <span className="text-xs font-bold tracking-wide uppercase">Clear</span>
      ) : (
        label
      )}
    </button>
  )
}

export default function DashboardLogin({ onAuthenticated }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const tryUnlock = useCallback(
    (value) => {
      if (verifyDashboardPassword(value)) {
        setError('')
        onAuthenticated()
        return
      }

      setError('Incorrect code. Try again.')
      setShake(true)
      setCode('')
      window.setTimeout(() => setShake(false), 450)
    },
    [onAuthenticated],
  )

  const appendDigit = (digit) => {
    if (code.length >= DASHBOARD_PASSWORD_LENGTH) return

    const nextCode = `${code}${digit}`
    setCode(nextCode)
    setError('')

    if (nextCode.length === DASHBOARD_PASSWORD_LENGTH) {
      window.setTimeout(() => tryUnlock(nextCode), 120)
    }
  }

  const handleKeyPress = (key) => {
    if (key === 'clear') {
      setCode('')
      setError('')
      return
    }

    if (key === 'backspace') {
      setCode((current) => current.slice(0, -1))
      setError('')
      return
    }

    appendDigit(key)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-brand via-brand-light to-brand px-6 py-12">
      <div
        className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-12 h-48 w-48 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/15 bg-white/95 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-10">
          <div className="text-center">
            <img src={logo} alt="" className="mx-auto h-14 w-auto" />
            <p className="mt-5 text-xs font-semibold tracking-[0.22em] text-brand uppercase">Dashboard</p>
            <h1 className="mt-2 font-serif text-3xl text-ink">Enter access code</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Use the keypad below to unlock the content dashboard.
            </p>
          </div>

          <div className={`mt-8 ${shake ? 'animate-shake' : ''}`}>
            <PinDots length={DASHBOARD_PASSWORD_LENGTH} filled={code.length} />
            {error ? <p className="mt-4 text-center text-sm text-accent-hover">{error}</p> : null}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {keypadKeys.map((key) => (
              <KeypadButton key={key} label={key} onClick={() => handleKeyPress(key)} />
            ))}
          </div>

          <a
            href="/"
            className="mt-8 flex items-center justify-center gap-2 text-sm text-ink-muted transition-colors hover:text-brand"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to website
          </a>
        </div>
      </div>
    </div>
  )
}
