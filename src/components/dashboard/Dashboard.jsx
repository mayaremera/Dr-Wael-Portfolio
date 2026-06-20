import { useCallback, useEffect, useState } from 'react'
import DashboardSidebar from './DashboardSidebar'
import { DashboardPanel } from './DashboardPanels'
import DashboardCloudAuth from './DashboardCloudAuth'
import { DeleteConfirmProvider } from './DeleteConfirmDialog'
import {
  getSupabaseSession,
  isSupabaseConfigured,
  signOutFromSupabase,
  subscribeToAuthChanges,
} from '../../lib/supabase'

const DEFAULT_SECTION = 'in-the-field'
const VALID_SECTIONS = new Set([
  'home',
  'about-me',
  'services',
  'gallery',
  'in-the-field',
  'contact',
])

function getDashboardSection() {
  const match = window.location.pathname.match(/^\/dashboard\/?([^/]*)?/)
  const section = match?.[1] || DEFAULT_SECTION
  return VALID_SECTIONS.has(section) ? section : DEFAULT_SECTION
}

function sectionToPath(section) {
  return section === DEFAULT_SECTION ? '/dashboard' : `/dashboard/${section}`
}

function DashboardAuthBootScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-alt">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
        <p className="text-sm text-ink-muted">Checking your session…</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [authChecked, setAuthChecked] = useState(!isSupabaseConfigured)
  const [isCloudAuthenticated, setIsCloudAuthenticated] = useState(!isSupabaseConfigured)
  const [activeSection, setActiveSection] = useState(getDashboardSection)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    getSupabaseSession().then((session) => {
      if (cancelled) return
      setIsCloudAuthenticated(Boolean(session))
      setAuthChecked(true)
    })

    const unsubscribe = subscribeToAuthChanges((session) => {
      setIsCloudAuthenticated(Boolean(session))
      setAuthChecked(true)
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const syncSection = () => setActiveSection(getDashboardSection())

    window.addEventListener('popstate', syncSection)
    return () => window.removeEventListener('popstate', syncSection)
  }, [])

  const navigateTo = useCallback((section) => {
    const path = sectionToPath(section)
    window.history.pushState(null, '', path)
    setActiveSection(section)
    setMobileNavOpen(false)
  }, [])

  const handleLogout = async () => {
    await signOutFromSupabase()
    setIsCloudAuthenticated(!isSupabaseConfigured)
    setMobileNavOpen(false)
  }

  if (!authChecked) {
    return <DashboardAuthBootScreen />
  }

  if (!isCloudAuthenticated) {
    return <DashboardCloudAuth onAuthenticated={() => setIsCloudAuthenticated(true)} />
  }

  return (
    <DeleteConfirmProvider>
    <div className="min-h-screen bg-surface-alt">
      <div
        className={`fixed inset-0 z-40 bg-ink/50 transition-opacity lg:hidden ${
          mobileNavOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(100%,20rem)] transition-transform duration-300 lg:w-72 lg:translate-x-0 xl:w-80 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar activeSection={activeSection} onSelect={navigateTo} />
      </div>

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-72 xl:ml-80">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-sm lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-ink lg:hidden"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label="Toggle dashboard menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">Dr. Wael Portfolio</p>
              <p className="text-sm text-ink-muted">Content dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-brand-muted px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-brand uppercase sm:inline-block">
              {isSupabaseConfigured ? 'Cloud sync on' : 'Local only'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-5xl">
            <DashboardPanel section={activeSection} />
          </div>
        </main>
      </div>
    </div>
    </DeleteConfirmProvider>
  )
}
