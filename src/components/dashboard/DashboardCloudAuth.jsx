import { useEffect, useState } from 'react'
import Logo from '../Logo'
import { isSupabaseConfigured, signInToSupabase } from '../../lib/supabase'

const fieldClassName =
  'w-full rounded-lg border border-slate-200/90 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-muted/50 focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

export default function DashboardCloudAuth({ onAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInToSupabase(email.trim(), password)
      onAuthenticated()
    } catch (authError) {
      setError(authError?.message || 'Could not sign in. Check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      onAuthenticated()
    }
  }, [onAuthenticated])

  if (!isSupabaseConfigured) {
    return null
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-brand via-brand-light to-brand px-6 py-12">
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/15 bg-white/95 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-10">
          <div className="text-center">
            <Logo scrolled markOnly className="mx-auto !h-14 justify-center" />
            <p className="mt-5 text-xs font-semibold tracking-[0.22em] text-brand uppercase">Cloud sync</p>
            <h1 className="mt-2 font-serif text-3xl text-ink">Sign in to publish</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Use your Supabase admin account so dashboard edits update the live website for everyone.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="cloud-email" className="mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                Admin email
              </label>
              <input
                id="cloud-email"
                type="email"
                autoComplete="username"
                className={fieldClassName}
                value={email}
                onChange={(changeEvent) => setEmail(changeEvent.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="cloud-password" className="mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
                Password
              </label>
              <input
                id="cloud-password"
                type="password"
                autoComplete="current-password"
                className={fieldClassName}
                value={password}
                onChange={(changeEvent) => setPassword(changeEvent.target.value)}
                required
              />
            </div>

            {error ? <p className="text-sm text-accent-hover">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand px-5 py-3 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Connect & continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
