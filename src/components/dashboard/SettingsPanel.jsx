import { useCallback, useEffect, useState } from 'react'
import { listRemoteSections } from '../../data/contentSync'
import { SEED_SECTIONS, seedAllSectionsToSupabase } from '../../data/seedSupabase'
import { getSupabaseSession, isSupabaseConfigured, supabase } from '../../lib/supabase'

function PanelShell({ eyebrow, title, description, children }) {
  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-3xl text-ink md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">{description}</p>
      </header>
      {children}
    </div>
  )
}

function StatusBadge({ ok, label }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.65rem] font-semibold tracking-wide uppercase ${
        ok ? 'bg-brand-muted text-brand' : 'bg-accent/10 text-accent-hover'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${ok ? 'bg-brand' : 'bg-accent'}`} aria-hidden="true" />
      {label}
    </span>
  )
}

export default function SettingsPanel() {
  const [sessionEmail, setSessionEmail] = useState('')
  const [sections, setSections] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  const refreshStatus = useCallback(async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      if (!isSupabaseConfigured || !supabase) {
        setSessionEmail('')
        setSections([])
        setErrorMessage('Supabase env variables are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        return
      }

      const session = await getSupabaseSession()
      setSessionEmail(session?.user?.email ?? '')

      const rows = await listRemoteSections()
      setSections(rows)
    } catch (error) {
      setErrorMessage(error?.message || 'Could not connect to Supabase.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshStatus()
  }, [refreshStatus])

  const handleSeed = async (overwrite = false) => {
    setSeeding(true)
    setStatusMessage('')
    setErrorMessage('')

    try {
      const result = await seedAllSectionsToSupabase({ overwrite })
      const parts = []

      if (result.seeded.length) {
        parts.push(`Published: ${result.seeded.join(', ')}`)
      }

      if (result.skipped.length) {
        parts.push(`Skipped (already in Supabase): ${result.skipped.join(', ')}`)
      }

      setStatusMessage(parts.join(' · ') || 'Nothing to publish.')
      await refreshStatus()
    } catch (error) {
      setErrorMessage(error?.message || 'Could not publish default content.')
    } finally {
      setSeeding(false)
    }
  }

  const savedSectionSet = new Set(sections.map((row) => row.section))

  return (
    <PanelShell
      eyebrow="Settings"
      title="Supabase connection"
      description="Supabase is now the main source of truth. Dashboard saves go there first, and the live website reads from there."
    >
      <div className="space-y-5">
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge ok={isSupabaseConfigured} label={isSupabaseConfigured ? 'Supabase configured' : 'Not configured'} />
            <StatusBadge ok={Boolean(sessionEmail)} label={sessionEmail ? `Signed in as ${sessionEmail}` : 'Not signed in'} />
            <StatusBadge
              ok={sections.length > 0}
              label={sections.length ? `${sections.length} sections in database` : 'No saved sections yet'}
            />
          </div>

          {loading ? <p className="mt-4 text-sm text-ink-muted">Checking connection…</p> : null}
          {errorMessage ? <p className="mt-4 text-sm text-accent-hover">{errorMessage}</p> : null}
          {statusMessage ? <p className="mt-4 text-sm text-brand">{statusMessage}</p> : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleSeed(false)}
              disabled={seeding || !sessionEmail}
              className="rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light disabled:opacity-50"
            >
              {seeding ? 'Publishing…' : 'Publish missing defaults'}
            </button>
            <button
              type="button"
              onClick={refreshStatus}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand"
            >
              Refresh status
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">Section status</h2>
          <ul className="mt-4 space-y-2">
            {SEED_SECTIONS.map((entry) => {
              const saved = savedSectionSet.has(entry.section)
              const row = sections.find((item) => item.section === entry.section)

              return (
                <li
                  key={entry.section}
                  className="flex items-center justify-between rounded-lg bg-surface-alt px-3 py-2.5 text-sm"
                >
                  <span className="text-ink">{entry.label}</span>
                  <span className={saved ? 'text-brand' : 'text-ink-muted'}>
                    {saved ? `Saved · ${new Date(row.updated_at).toLocaleString()}` : 'Not in Supabase yet'}
                  </span>
                </li>
              )
            })}
          </ul>
        </article>

        <article className="rounded-xl border border-dashed border-brand/20 bg-brand-muted/20 p-5">
          <h2 className="text-sm font-semibold text-ink">How to test</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            <li>Make sure you are signed in with your Supabase admin email and password.</li>
            <li>Click <strong className="text-ink">Publish missing defaults</strong> once to create the first rows.</li>
            <li>Edit any tab (e.g. In the Field), save, then refresh this page — the timestamp should update.</li>
            <li>Open the live site in another browser/incognito — you should see the same content.</li>
            <li>In Supabase → Table Editor → <code className="text-ink">site_sections</code>, confirm the JSON changed.</li>
          </ol>
        </article>
      </div>
    </PanelShell>
  )
}
