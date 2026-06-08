import { useState } from 'react'
import { DashboardPagination, useDashboardPagination } from './DashboardItemList'
import {
  getDefaultContactContent,
  loadContactContent,
  resetContactContent,
  saveContactContent,
} from '../../data/contactContentStore'

const fieldClassName =
  'w-full rounded-lg border border-slate-200/90 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-muted/50 focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

const labelClassName = 'mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase'

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

export default function ContactPanel() {
  const [content, setContent] = useState(loadContactContent)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const schedulePagination = useDashboardPagination(content.contactDetails.schedule)

  const persist = (nextContent, message = 'Changes saved to this browser.') => {
    try {
      saveContactContent(nextContent)
      setContent(nextContent)
      setSaveError('')
      setSavedMessage(message)
      window.setTimeout(() => setSavedMessage(''), 2500)
    } catch {
      setSaveError('Could not save changes.')
    }
  }

  const updateWorkplace = (field, value) => {
    setContent((current) => ({
      ...current,
      contactDetails: {
        ...current.contactDetails,
        workplace: { ...current.contactDetails.workplace, [field]: value },
      },
    }))
  }

  const updateSchedule = (index, field, value) => {
    setContent((current) => ({
      ...current,
      contactDetails: {
        ...current.contactDetails,
        schedule: current.contactDetails.schedule.map((entry, entryIndex) =>
          entryIndex === index ? { ...entry, [field]: value } : entry,
        ),
      },
    }))
  }

  const updateDirectContact = (field, value) => {
    setContent((current) => ({
      ...current,
      directContact: { ...current.directContact, [field]: value },
    }))
  }

  const saveAll = () => persist(content)

  const handleReset = () => {
    if (!window.confirm('Reset contact content back to defaults?')) return
    resetContactContent()
    setContent(getDefaultContactContent())
    setSavedMessage('Reset to default content.')
    window.setTimeout(() => setSavedMessage(''), 2500)
  }

  return (
    <PanelShell
      eyebrow="Contact"
      title="Contact & appointments"
      description="Edit practice location, office hours, and direct contact details shown on the live Contact page."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a href="/contact" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand transition-colors hover:text-brand-light">
          Preview live page →
        </a>
        <div className="flex flex-wrap items-center gap-2">
          {saveError ? <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-hover">{saveError}</span> : null}
          {savedMessage ? <span className="rounded-full bg-brand-muted px-3 py-1 text-xs font-semibold text-brand">{savedMessage}</span> : null}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Practice location</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label className={labelClassName}>Name</label>
            <input className={fieldClassName} value={content.contactDetails.workplace.name} onChange={(e) => updateWorkplace('name', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Department</label>
            <input className={fieldClassName} value={content.contactDetails.workplace.department} onChange={(e) => updateWorkplace('department', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>City</label>
            <input className={fieldClassName} value={content.contactDetails.workplace.city} onChange={(e) => updateWorkplace('city', e.target.value)} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Office hours</h2>
        <div className="mt-4 space-y-3">
          {schedulePagination.pageItems.map((entry) => {
            const index = content.contactDetails.schedule.findIndex((item) => item.day === entry.day)

            return (
              <div key={entry.day} className="grid gap-3 rounded-lg border border-slate-200/80 bg-surface-alt/60 p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                <p className="text-sm font-semibold text-ink">{entry.day}</p>
                <input className={fieldClassName} value={entry.hours} onChange={(e) => updateSchedule(index, 'hours', e.target.value)} />
                <label className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                  <input
                    type="checkbox"
                    checked={Boolean(entry.weekend)}
                    onChange={(e) => updateSchedule(index, 'weekend', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
                  />
                  Weekend
                </label>
              </div>
            )
          })}
        </div>
        {schedulePagination.needsPagination ? (
          <DashboardPagination
            page={schedulePagination.page}
            pageCount={schedulePagination.pageCount}
            onPageChange={schedulePagination.setPage}
          />
        ) : null}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Direct contact</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Email</label>
            <input className={fieldClassName} value={content.directContact.email} onChange={(e) => updateDirectContact('email', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Phone</label>
            <input className={fieldClassName} value={content.directContact.phone} onChange={(e) => updateDirectContact('phone', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Website</label>
            <input className={fieldClassName} value={content.directContact.domain} onChange={(e) => updateDirectContact('domain', e.target.value)} />
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={saveAll} className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save all changes
        </button>
        <button type="button" onClick={handleReset} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-accent/30 hover:text-accent-hover">
          Reset to defaults
        </button>
      </div>
    </PanelShell>
  )
}
