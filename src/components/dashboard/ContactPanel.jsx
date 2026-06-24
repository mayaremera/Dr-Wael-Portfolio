import { useRef, useState } from 'react'
import { DashboardPagination, useDashboardPagination } from './DashboardItemList'
import {
  getDefaultContactContent,
  loadContactContentRemote,
  saveContactContent,
} from '../../data/contactContentStore'
import { CONTENT_SECTIONS } from '../../data/contentSync'
import { useDashboardSection } from '../../hooks/useDashboardSection'
import DashboardSaveNotice from './DashboardSaveNotice'
import DashboardSectionLoader from './DashboardSectionLoader'
import { persistDashboardSection } from './persistDashboardSection'

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
  const { content, setContent, loading, loadError } = useDashboardSection(
    getDefaultContactContent,
    loadContactContentRemote,
    CONTENT_SECTIONS.CONTACT,
  )
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const contentRef = useRef(content)
  contentRef.current = content

  const schedulePagination = useDashboardPagination(content?.contactDetails?.schedule ?? [])

  const persist = (nextContent, message = 'Changes saved.', previousContent = null) => {
    void persistDashboardSection({
      saveFn: saveContactContent,
      nextContent,
      previousContent,
      setContent,
      setSaveError,
      setSavedMessage,
      setIsSaving,
      message,
      storageErrorMessage: 'Could not save changes.',
    })
  }

  const persistFromCurrent = (buildNextContent, message) => {
    const current = contentRef.current
    if (!current) {
      setSaveError('Content is still loading. Try again in a moment.')
      return
    }

    const nextContent = buildNextContent(current)
    persist(nextContent, message, current)
  }

  const updateContactSection = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        contactSection: { ...current.contactSection, [field]: value },
      }
    })
  }

  const updateWorkplace = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        contactDetails: {
          ...current.contactDetails,
          workplace: { ...current.contactDetails.workplace, [field]: value },
        },
      }
    })
  }

  const updateSchedule = (index, field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        contactDetails: {
          ...current.contactDetails,
          schedule: current.contactDetails.schedule.map((entry, entryIndex) =>
            entryIndex === index ? { ...entry, [field]: value } : entry,
          ),
        },
      }
    })
  }

  const updateDirectContact = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        directContact: { ...current.directContact, [field]: value },
      }
    })
  }

  const saveContactSectionHeader = () => {
    persistFromCurrent((current) => current, 'Contact section header saved.')
  }

  const saveWorkplace = () => {
    persistFromCurrent((current) => current, 'Practice location saved.')
  }

  const saveSchedule = () => {
    persistFromCurrent((current) => current, 'Office hours saved.')
  }

  const saveDirectContact = () => {
    persistFromCurrent((current) => current, 'Direct contact saved.')
  }

  return (
    <PanelShell
      eyebrow="Contact"
      title="Contact & appointments"
      description="Sections follow the Contact page order. Every save writes to Supabase and updates the live site."
    >
      <DashboardSaveNotice message={savedMessage} error={saveError} saving={isSaving} />
      <DashboardSectionLoader loading={loading} loadError={loadError} />
      {!loading && !loadError && content ? (
        <>
          <div className="mb-6">
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brand transition-colors hover:text-brand-light"
            >
              Preview live page →
            </a>
          </div>

          <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
            <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">1 · Contact &amp; appointment</p>
            <h2 className="mt-1 font-serif text-xl text-ink">Section header</h2>
            <p className="mt-1 text-sm text-ink-muted">
              The centered heading above the location card, direct contact links, and appointment form.
            </p>
            <div className="mt-4 grid gap-4">
              <div>
                <label className={labelClassName}>Section label</label>
                <input
                  className={fieldClassName}
                  value={content.contactSection?.label ?? ''}
                  onChange={(event) => updateContactSection('label', event.target.value)}
                />
              </div>
              <div>
                <label className={labelClassName}>Section title</label>
                <input
                  className={fieldClassName}
                  value={content.contactSection?.title ?? ''}
                  onChange={(event) => updateContactSection('title', event.target.value)}
                />
              </div>
              <div>
                <label className={labelClassName}>Intro</label>
                <textarea
                  className={`${fieldClassName} min-h-24 resize-y`}
                  value={content.contactSection?.intro ?? ''}
                  onChange={(event) => updateContactSection('intro', event.target.value)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={saveContactSectionHeader}
              className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase"
            >
              Save section header
            </button>
          </section>

          <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
            <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">2 · Practice location &amp; office hours</p>
            <h2 className="mt-1 font-serif text-xl text-ink">Location card</h2>
            <p className="mt-1 text-sm text-ink-muted">Shown in the branded card on the left side of the contact section.</p>
            <div className="mt-4 grid gap-4">
              <div>
                <label className={labelClassName}>Name</label>
                <input
                  className={fieldClassName}
                  value={content.contactDetails.workplace.name}
                  onChange={(event) => updateWorkplace('name', event.target.value)}
                />
              </div>
              <div>
                <label className={labelClassName}>Department</label>
                <input
                  className={fieldClassName}
                  value={content.contactDetails.workplace.department}
                  onChange={(event) => updateWorkplace('department', event.target.value)}
                />
              </div>
              <div>
                <label className={labelClassName}>City</label>
                <input
                  className={fieldClassName}
                  value={content.contactDetails.workplace.city}
                  onChange={(event) => updateWorkplace('city', event.target.value)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={saveWorkplace}
              className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase"
            >
              Save practice location
            </button>

            <div className="mt-8 border-t border-slate-200/80 pt-6">
              <h3 className="font-serif text-lg text-ink">Office hours</h3>
              <div className="mt-4 space-y-3">
                {schedulePagination.pageItems.map((entry) => {
                  const index = content.contactDetails.schedule.findIndex((item) => item.day === entry.day)

                  return (
                    <div
                      key={entry.day}
                      className="grid gap-3 rounded-lg border border-slate-200/80 bg-surface-alt/60 p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center"
                    >
                      <p className="text-sm font-semibold text-ink">{entry.day}</p>
                      <input
                        className={fieldClassName}
                        value={entry.hours}
                        onChange={(event) => updateSchedule(index, 'hours', event.target.value)}
                      />
                      <label className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                        <input
                          type="checkbox"
                          checked={Boolean(entry.weekend)}
                          onChange={(event) => updateSchedule(index, 'weekend', event.target.checked)}
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
              <button
                type="button"
                onClick={saveSchedule}
                className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase"
              >
                Save office hours
              </button>
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
            <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">3 · Direct contact</p>
            <h2 className="mt-1 font-serif text-xl text-ink">Email &amp; phone</h2>
            <p className="mt-1 text-sm text-ink-muted">Shown beside the location card on the contact page.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClassName}>Email</label>
                <input
                  className={fieldClassName}
                  value={content.directContact.email}
                  onChange={(event) => updateDirectContact('email', event.target.value)}
                />
              </div>
              <div>
                <label className={labelClassName}>Phone</label>
                <input
                  className={fieldClassName}
                  value={content.directContact.phone}
                  onChange={(event) => updateDirectContact('phone', event.target.value)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={saveDirectContact}
              className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase"
            >
              Save direct contact
            </button>
          </section>
        </>
      ) : null}
    </PanelShell>
  )
}
