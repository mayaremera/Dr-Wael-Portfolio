import { useMemo, useRef, useState } from 'react'
import DashboardItemList from './DashboardItemList'
import DashboardSaveNotice from './DashboardSaveNotice'
import MediaDropzone from './MediaDropzone'
import { useConfirmDelete } from './DeleteConfirmDialog'
import {
  CERTIFICATE_FEATURED_COUNT,
  TIMELINE_TYPES,
  createAcademicCategoryId,
  createAcademicServiceItemId,
  createContentId,
  emptyAcademicCategory,
  emptyAcademicServiceItem,
  emptyCertificate,
  emptyPublication,
  emptyTimelineEntry,
  getDefaultAboutContent,
  loadAboutContentRemote,
  resolveCertificateDisplayOrder,
  saveAboutContent,
} from '../../data/aboutContentStore'
import { CONTENT_SECTIONS } from '../../data/contentSync'
import { useDashboardSection } from '../../hooks/useDashboardSection'
import DashboardSectionLoader from './DashboardSectionLoader'
import { persistDashboardSection } from './persistDashboardSection'
import { withCacheBust } from '../../lib/mediaUrl'
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

function StringListEditor({ label, items, onChange, addLabel = 'Add line' }) {
  const confirmDelete = useConfirmDelete()

  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex gap-2">
            <textarea className={`${fieldClassName} min-h-20 resize-y`} value={item} onChange={(e) => onChange(items.map((entry, i) => (i === index ? e.target.value : entry)))} />
            <button type="button" onClick={() => confirmDelete({
              title: 'Remove this line?',
              message: 'This line will be removed from the list.',
              confirmLabel: 'Remove',
              onConfirm: () => onChange(items.filter((_, i) => i !== index)),
            })} className="shrink-0 self-start rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold tracking-wide text-accent-hover uppercase">
              Remove
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, ''])} className="mt-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase">
        {addLabel}
      </button>
    </div>
  )
}

function CareerStatsEditor({ stats, onChange }) {
  const updateStat = (index, field, value) => {
    onChange(stats.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat)))
  }

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <div key={`career-stat-${index}`} className="rounded-lg border border-slate-200/80 bg-surface-alt/40 p-4">
          <p className="mb-3 text-xs font-semibold tracking-wide text-brand uppercase">Card {index + 1}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>Number</label>
              <input
                className={fieldClassName}
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                placeholder="30+"
              />
            </div>
            <div>
              <label className={labelClassName}>Label</label>
              <input
                className={fieldClassName}
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                placeholder="Years of Experience"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClassName}>Description</label>
              <textarea
                className={`${fieldClassName} min-h-20 resize-y`}
                value={stat.detail}
                onChange={(e) => updateStat(index, 'detail', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function toggleCertificateFeaturedSlot(selectedIds, certificateId, slotIndex) {
  const next = Array.from({ length: CERTIFICATE_FEATURED_COUNT }, (_, index) => selectedIds?.[index] ?? '')

  if (next[slotIndex] === certificateId) {
    next[slotIndex] = ''
    return next
  }

  for (let index = 0; index < CERTIFICATE_FEATURED_COUNT; index += 1) {
    if (next[index] === certificateId) next[index] = ''
  }

  next[slotIndex] = certificateId
  return next
}

function getCertificateFeaturedSlot(selectedIds, certificateId) {
  const slotIndex = (selectedIds ?? []).findIndex((id) => id === certificateId)
  return slotIndex >= 0 ? slotIndex + 1 : null
}

function CertificateFeaturedCheckboxes({ certificateId, selectedIds, onToggle }) {
  const normalizedIds = Array.from({ length: CERTIFICATE_FEATURED_COUNT }, (_, index) => selectedIds?.[index] ?? '')

  return (
    <div className="mt-4 rounded-lg border border-slate-200/80 bg-white p-3">
      <p className="text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">
        Show in first {CERTIFICATE_FEATURED_COUNT} on About Me
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {Array.from({ length: CERTIFICATE_FEATURED_COUNT }, (_, index) => {
          const checked = normalizedIds[index] === certificateId

          return (
            <label
              key={index}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                checked
                  ? 'border-brand bg-brand-muted/50 text-brand'
                  : 'border-slate-200 bg-white text-ink-muted hover:border-brand/25 hover:text-brand'
              }`}
            >
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-slate-300 text-brand focus:ring-brand/30"
                checked={checked}
                onChange={() => onToggle(certificateId, index)}
              />
              {index + 1}
            </label>
          )
        })}
      </div>
    </div>
  )
}

function CertificateEditor({ initialItem, onSave, onCancel }) {
  const [item, setItem] = useState({ ...emptyCertificate, ...initialItem })
  const update = (field, value) => setItem((c) => ({ ...c, [field]: value }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...item, id: item.id || createContentId(item.title) }) }} className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5">
      <h3 className="font-serif text-xl text-ink">{item.id ? 'Edit certificate' : 'New certificate'}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><label className={labelClassName}>Title</label><input className={fieldClassName} value={item.title} onChange={(e) => update('title', e.target.value)} required /></div>
        <div><label className={labelClassName}>Year</label><input className={fieldClassName} value={item.year} onChange={(e) => update('year', e.target.value)} required /></div>
        <div className="sm:col-span-2"><label className={labelClassName}>Issuer</label><input className={fieldClassName} value={item.issuer} onChange={(e) => update('issuer', e.target.value)} required /></div>
        <div className="sm:col-span-2"><label className={labelClassName}>Description</label><textarea className={`${fieldClassName} min-h-24 resize-y`} value={item.description} onChange={(e) => update('description', e.target.value)} required /></div>
        <div className="sm:col-span-2"><label className={labelClassName}>Certificate image</label><MediaDropzone image={item.image} video="" onChange={({ image }) => update('image', image)} onClear={() => update('image', '')} /></div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">Cancel</button>
      </div>
    </form>
  )
}

function TimelineEditor({ initialItem, onSave, onCancel }) {
  const [item, setItem] = useState({ ...emptyTimelineEntry, ...initialItem })
  const update = (field, value) => setItem((c) => ({ ...c, [field]: value }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...item, id: item.id || createContentId(item.title) }) }} className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5">
      <h3 className="font-serif text-xl text-ink">{item.id ? 'Edit timeline entry' : 'New timeline entry'}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><label className={labelClassName}>Year / period</label><input className={fieldClassName} value={item.year} onChange={(e) => update('year', e.target.value)} required /></div>
        <div><label className={labelClassName}>Type</label><select className={fieldClassName} value={item.type} onChange={(e) => update('type', e.target.value)}>{TIMELINE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></div>
        <div className="sm:col-span-2"><label className={labelClassName}>Title</label><input className={fieldClassName} value={item.title} onChange={(e) => update('title', e.target.value)} required /></div>
        <div className="sm:col-span-2"><label className={labelClassName}>Organization</label><input className={fieldClassName} value={item.org} onChange={(e) => update('org', e.target.value)} required /></div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">Cancel</button>
      </div>
    </form>
  )
}

function WorkshopsEditor({ workshops, onChange }) {
  const confirmDelete = useConfirmDelete()

  const updateWorkshop = (index, field, value) => {
    onChange(workshops.map((workshop, workshopIndex) => (workshopIndex === index ? { ...workshop, [field]: value } : workshop)))
  }

  return (
    <div>
      <label className={labelClassName}>Workshops (optional)</label>
      <div className="space-y-2">
        {workshops.map((workshop, index) => (
          <div key={`workshop-${index}`} className="flex flex-wrap gap-2">
            <input
              className={`${fieldClassName} w-24`}
              value={workshop.year}
              onChange={(e) => updateWorkshop(index, 'year', e.target.value)}
              placeholder="Year"
            />
            <input
              className={`${fieldClassName} min-w-0 flex-1`}
              value={workshop.title}
              onChange={(e) => updateWorkshop(index, 'title', e.target.value)}
              placeholder="Workshop title"
            />
            <button
              type="button"
              onClick={() =>
                confirmDelete({
                  title: 'Remove this workshop?',
                  message: 'This workshop line will be removed.',
                  confirmLabel: 'Remove',
                  onConfirm: () => onChange(workshops.filter((_, workshopIndex) => workshopIndex !== index)),
                })
              }
              className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold tracking-wide text-accent-hover uppercase"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...workshops, { year: '', title: '' }])}
        className="mt-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase"
      >
        Add workshop
      </button>
    </div>
  )
}

function buildAcademicServiceItem(item) {
  const payload = {
    id: item.id || createAcademicServiceItemId(item.title),
    title: item.title.trim(),
    org: item.org.trim(),
    period: item.period?.trim() || null,
    description: item.description?.trim() || null,
  }

  if (item.link?.href?.trim()) {
    payload.link = {
      href: item.link.href.trim(),
      label: item.link.label?.trim() || 'Learn more',
    }
  }

  const journals = (item.journals ?? []).map((entry) => entry.trim()).filter(Boolean)
  if (journals.length) payload.journals = journals

  const workshops = (item.workshops ?? []).filter((workshop) => workshop.year?.trim() || workshop.title?.trim())
  if (workshops.length) payload.workshops = workshops

  return payload
}

function AcademicServiceItemEditor({ initialItem, onSave, onCancel }) {
  const [item, setItem] = useState({
    ...emptyAcademicServiceItem,
    ...initialItem,
    link: { ...emptyAcademicServiceItem.link, ...(initialItem.link ?? {}) },
    journals: initialItem.journals?.length ? [...initialItem.journals] : [],
    workshops: initialItem.workshops?.length ? initialItem.workshops.map((workshop) => ({ ...workshop })) : [],
  })
  const [error, setError] = useState('')
  const update = (field, value) => setItem((current) => ({ ...current, [field]: value }))
  const updateLink = (field, value) => setItem((current) => ({ ...current, link: { ...current.link, [field]: value } }))

  const handleSave = () => {
    if (!item.title.trim() || !item.org.trim()) {
      setError('Title and organization are required.')
      return
    }
    setError('')
    onSave(buildAcademicServiceItem(item))
  }

  return (
    <div className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5">
      <h3 className="font-serif text-xl text-ink">{item.id ? 'Edit entry' : 'New entry'}</h3>
      {error ? <p className="mt-2 text-sm text-accent-hover">{error}</p> : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClassName}>Title</label>
          <input className={fieldClassName} value={item.title} onChange={(e) => update('title', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Organization</label>
          <input className={fieldClassName} value={item.org} onChange={(e) => update('org', e.target.value)} />
        </div>
        <div>
          <label className={labelClassName}>Period (optional)</label>
          <input className={fieldClassName} value={item.period ?? ''} onChange={(e) => update('period', e.target.value)} placeholder="2021 – Present" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Description (optional)</label>
          <textarea className={`${fieldClassName} min-h-24 resize-y`} value={item.description ?? ''} onChange={(e) => update('description', e.target.value)} />
        </div>
        <div>
          <label className={labelClassName}>Link URL (optional)</label>
          <input className={fieldClassName} value={item.link.href} onChange={(e) => updateLink('href', e.target.value)} placeholder="https://" />
        </div>
        <div>
          <label className={labelClassName}>Link label</label>
          <input className={fieldClassName} value={item.link.label} onChange={(e) => updateLink('label', e.target.value)} placeholder="Learn more" />
        </div>
        <div className="sm:col-span-2">
          <StringListEditor label="Journals (optional)" items={item.journals} onChange={(journals) => update('journals', journals)} addLabel="Add journal" />
        </div>
        <div className="sm:col-span-2">
          <WorkshopsEditor workshops={item.workshops} onChange={(workshops) => update('workshops', workshops)} />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={handleSave} className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save entry</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">Cancel</button>
      </div>
    </div>
  )
}

function AcademicCategoryEditor({ initialCategory, onSave, onCancel }) {
  const confirmDelete = useConfirmDelete()
  const [category, setCategory] = useState({
    ...emptyAcademicCategory,
    ...initialCategory,
    items: initialCategory.items?.length ? initialCategory.items.map((item) => ({ ...item })) : [],
  })
  const [editingItemId, setEditingItemId] = useState(null)
  const [error, setError] = useState('')

  const saveItem = (entry) => {
    setCategory((current) => {
      const exists = current.items.some((item) => item.id === entry.id)
      const nextItems = exists
        ? current.items.map((item) => (item.id === entry.id ? entry : item))
        : [entry, ...current.items]
      return { ...current, items: nextItems }
    })
    setEditingItemId(null)
  }

  const deleteItem = (id) => {
    setCategory((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }))
    if (editingItemId === id) setEditingItemId(null)
  }

  const handleSaveCategory = () => {
    if (!category.label.trim()) {
      setError('Category label is required.')
      return
    }
    setError('')
    onSave({
      ...category,
      id: category.id || createAcademicCategoryId(category.label),
      label: category.label.trim(),
    })
  }

  return (
    <div className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5">
      <h3 className="font-serif text-xl text-ink">{category.id ? 'Edit category' : 'New category'}</h3>
      {error ? <p className="mt-2 text-sm text-accent-hover">{error}</p> : null}
      <div className="mt-4">
        <label className={labelClassName}>Category label</label>
        <input className={fieldClassName} value={category.label} onChange={(e) => setCategory((current) => ({ ...current, label: e.target.value }))} />
      </div>

      <div className="mt-6 border-t border-slate-200/80 pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink">Entries in this category</p>
          <button type="button" onClick={() => setEditingItemId('new')} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase">
            Add entry
          </button>
        </div>
        <p className="mt-2 text-xs text-ink-muted">Fill in each entry and click <span className="font-semibold text-ink">Save entry</span>, then click <span className="font-semibold text-ink">Save category</span> when done.</p>

        {editingItemId === 'new' ? (
          <div className="mt-4">
            <AcademicServiceItemEditor initialItem={emptyAcademicServiceItem} onSave={saveItem} onCancel={() => setEditingItemId(null)} />
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {category.items.length === 0 ? (
            <p className="rounded-lg bg-white/70 px-4 py-5 text-center text-sm text-ink-muted">No entries yet.</p>
          ) : (
            category.items.map((item) => (
              <article key={item.id} className="rounded-lg border border-slate-200/80 bg-white p-4">
                {editingItemId === item.id ? (
                  <AcademicServiceItemEditor key={item.id} initialItem={item} onSave={saveItem} onCancel={() => setEditingItemId(null)} />
                ) : (
                  <>
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="text-sm text-brand">{item.org}</p>
                    {item.period ? <p className="mt-1 text-xs text-ink-muted">{item.period}</p> : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setEditingItemId(item.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase">
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          confirmDelete({
                            title: 'Delete this entry?',
                            message: 'This academic service entry will be removed from the category.',
                            confirmLabel: 'Delete',
                            onConfirm: () => deleteItem(item.id),
                          })
                        }
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-hover uppercase"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button type="button" onClick={handleSaveCategory} className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save category</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">Cancel</button>
      </div>
    </div>
  )
}

const PUBLICATION_TYPES = ['Journal', 'Proceedings', 'Book Chapter']

function PublicationEditor({ initialItem, onSave, onCancel }) {
  const [item, setItem] = useState({ ...emptyPublication, ...initialItem })
  const update = (field, value) => setItem((current) => ({ ...current, [field]: value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave({
          ...item,
          id: item.id || createContentId(item.title),
          year: Number(item.year) || item.year,
          doi: item.doi?.trim() || null,
        })
      }}
      className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5"
    >
      <h3 className="font-serif text-xl text-ink">{item.id ? 'Edit publication' : 'New publication'}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Year</label>
          <input className={fieldClassName} type="number" value={item.year} onChange={(e) => update('year', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Type</label>
          <select className={fieldClassName} value={item.type} onChange={(e) => update('type', e.target.value)}>
            {PUBLICATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Authors</label>
          <textarea className={`${fieldClassName} min-h-20 resize-y`} value={item.authors} onChange={(e) => update('authors', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Title</label>
          <textarea className={`${fieldClassName} min-h-20 resize-y`} value={item.title} onChange={(e) => update('title', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Venue / Journal</label>
          <input className={fieldClassName} value={item.venue} onChange={(e) => update('venue', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Details (volume, pages, ISBN)</label>
          <input className={fieldClassName} value={item.details} onChange={(e) => update('details', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>DOI link (optional)</label>
          <input className={fieldClassName} value={item.doi || ''} onChange={(e) => update('doi', e.target.value)} placeholder="https://doi.org/..." />
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save publication</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">Cancel</button>
      </div>
    </form>
  )
}

export default function AboutMePanel() {
  const confirmDelete = useConfirmDelete()
  const { content, setContent, loading, loadError } = useDashboardSection(
    getDefaultAboutContent,
    loadAboutContentRemote,
    CONTENT_SECTIONS.ABOUT,
  )
  const [editingCertId, setEditingCertId] = useState(null)
  const [editingTimelineId, setEditingTimelineId] = useState(null)
  const [editingAcademicCategoryId, setEditingAcademicCategoryId] = useState(null)
  const [editingPublicationId, setEditingPublicationId] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const contentRef = useRef(content)
  contentRef.current = content

  const displayedCertificates = useMemo(
    () => resolveCertificateDisplayOrder(content?.certificates ?? [], content?.certificatesFeaturedIds),
    [content?.certificates, content?.certificatesFeaturedIds],
  )

  const persist = (nextContent, message = 'Changes saved.', previousContent = null) => {
    void persistDashboardSection({
      saveFn: saveAboutContent,
      nextContent,
      previousContent,
      setContent,
      setSaveError,
      setSavedMessage,
      setIsSaving,
      message,
      storageErrorMessage: 'Could not save — images may be too large. Try a smaller file.',
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

  const updateProfile = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return { ...current, profileDetails: { ...current.profileDetails, [field]: value } }
    })
  }

  const updateCareerImpact = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return { ...current, careerImpact: { ...current.careerImpact, [field]: value } }
    })
  }

  const updateCertificatesSection = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        certificatesSection: {
          ...(current.certificatesSection ?? getDefaultAboutContent().certificatesSection),
          [field]: value,
        },
      }
    })
  }

  const updateCareerTimelineSection = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        careerTimelineSection: {
          ...(current.careerTimelineSection ?? getDefaultAboutContent().careerTimelineSection),
          [field]: value,
        },
      }
    })
  }

  const updateAcademicServices = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        academicServices: {
          ...(current.academicServices ?? getDefaultAboutContent().academicServices),
          [field]: value,
        },
      }
    })
  }

  const updateRefereedPublications = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        refereedPublications: {
          ...(current.refereedPublications ?? getDefaultAboutContent().refereedPublications),
          [field]: value,
        },
      }
    })
  }

  const saveProfile = () => {
    persistFromCurrent(
      (current) => ({
        ...current,
        profileImage: current.profileImage ? withCacheBust(current.profileImage) : '',
      }),
      'Profile saved.',
    )
  }

  const saveCareerImpact = () => {
    persistFromCurrent((current) => current, 'Career impact cards saved.')
  }

  const saveCertificatesHeader = () => {
    persistFromCurrent((current) => current, 'Certificates section saved.')
  }

  const handleCertificateFeaturedToggle = (certificateId, slotIndex) => {
    persistFromCurrent(
      (current) => ({
        ...current,
        certificatesFeaturedIds: toggleCertificateFeaturedSlot(
          current.certificatesFeaturedIds,
          certificateId,
          slotIndex,
        ),
      }),
      'Certificate display order updated.',
    )
  }

  const saveCareerTimelineHeader = () => {
    persistFromCurrent((current) => current, 'Career timeline header saved.')
  }

  const saveAcademicHeader = () => {
    persistFromCurrent((current) => current, 'Leadership section header saved.')
  }

  const savePublicationsHeader = () => {
    persistFromCurrent((current) => current, 'Publications header saved.')
  }

  const saveListItem = (listKey, item, setEditing) => {
    const list = contentRef.current?.[listKey] ?? []
    const exists = list.some((entry) => entry.id === item.id)

    persistFromCurrent((current) => {
      const currentList = current[listKey] ?? []
      const normalizedItem =
        listKey === 'certificates'
          ? { ...item, image: item.image ? withCacheBust(item.image) : '' }
          : item
      const nextList = exists
        ? currentList.map((entry) => (entry.id === normalizedItem.id ? normalizedItem : entry))
        : [normalizedItem, ...currentList]
      return { ...current, [listKey]: nextList }
    }, exists ? 'Entry updated.' : 'Entry created.')

    setEditing(null)
  }

  const deleteListItem = (listKey, id, setEditing, editingId) => {
    persistFromCurrent(
      (current) => ({
        ...current,
        [listKey]: (current[listKey] ?? []).filter((entry) => entry.id !== id),
        ...(listKey === 'certificates'
          ? {
              certificatesFeaturedIds: (current.certificatesFeaturedIds ?? Array(CERTIFICATE_FEATURED_COUNT).fill('')).map(
                (featuredId) => (featuredId === id ? '' : featuredId),
              ),
            }
          : {}),
      }),
      'Entry deleted.',
    )
    if (editingId === id) setEditing(null)
  }

  const saveAcademicCategory = (category) => {
    const exists = (contentRef.current?.academicServices?.categories ?? []).some((entry) => entry.id === category.id)

    persistFromCurrent((current) => {
      const academicServices = current.academicServices ?? getDefaultAboutContent().academicServices
      const categories = academicServices.categories ?? []
      const nextCategories = exists
        ? categories.map((entry) => (entry.id === category.id ? category : entry))
        : [category, ...categories]
      return {
        ...current,
        academicServices: { ...academicServices, categories: nextCategories },
      }
    }, exists ? 'Category updated.' : 'Category created.')

    setEditingAcademicCategoryId(null)
  }

  const deleteAcademicCategory = (id) => {
    persistFromCurrent((current) => {
      const academicServices = current.academicServices ?? getDefaultAboutContent().academicServices
      return {
        ...current,
        academicServices: {
          ...academicServices,
          categories: (academicServices.categories ?? []).filter((entry) => entry.id !== id),
        },
      }
    }, 'Category deleted.')
    if (editingAcademicCategoryId === id) setEditingAcademicCategoryId(null)
  }

  const savePublication = (paper) => {
    const exists = (contentRef.current?.refereedPublications?.papers ?? []).some((entry) => entry.id === paper.id)

    persistFromCurrent((current) => {
      const refereedPublications = current.refereedPublications ?? getDefaultAboutContent().refereedPublications
      const papers = refereedPublications.papers ?? []
      const nextPapers = exists ? papers.map((entry) => (entry.id === paper.id ? paper : entry)) : [paper, ...papers]
      return {
        ...current,
        refereedPublications: { ...refereedPublications, papers: nextPapers },
      }
    }, exists ? 'Publication updated.' : 'Publication added.')

    setEditingPublicationId(null)
  }

  const deletePublication = (id) => {
    persistFromCurrent((current) => {
      const refereedPublications = current.refereedPublications ?? getDefaultAboutContent().refereedPublications
      return {
        ...current,
        refereedPublications: {
          ...refereedPublications,
          papers: (refereedPublications.papers ?? []).filter((entry) => entry.id !== id),
        },
      }
    }, 'Publication deleted.')
    if (editingPublicationId === id) setEditingPublicationId(null)
  }
  return (
    <PanelShell eyebrow="About Me" title="Profile, certificates & career" description="Sections follow the About Me page order. Every save writes to Supabase and updates the live site.">
      <DashboardSaveNotice message={savedMessage} error={saveError} saving={isSaving} />
      <DashboardSectionLoader loading={loading} loadError={loadError} />
      {!loading && !loadError && content ? (
        <>
      <div className="mb-6">
        <a href="/about-me" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand">Preview live page →</a>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">1 · Top of page</p>
        <h2 className="mt-1 font-serif text-xl text-ink">About Dr. Wael</h2>
        <p className="mt-1 text-sm text-ink-muted">Profile section at the top of the About Me page, including the four stat cards below the bio.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div><label className={labelClassName}>Name</label><input className={fieldClassName} value={content.profileDetails.name} onChange={(e) => updateProfile('name', e.target.value)} /></div>
          <div><label className={labelClassName}>Tagline</label><input className={fieldClassName} value={content.profileDetails.tagline} onChange={(e) => updateProfile('tagline', e.target.value)} /></div>
          <div className="md:col-span-2"><label className={labelClassName}>Title</label><textarea className={`${fieldClassName} min-h-20 resize-y`} value={content.profileDetails.title} onChange={(e) => updateProfile('title', e.target.value)} /></div>
          <div className="md:col-span-2"><StringListEditor label="Credentials" items={content.profileDetails.credentials} onChange={(credentials) => updateProfile('credentials', credentials)} addLabel="Add credential" /></div>
          <div className="md:col-span-2">
            <StringListEditor
              label="Homepage bio (short preview)"
              items={content.profileDetails.bio}
              onChange={(bio) => updateProfile('bio', bio)}
              addLabel="Add paragraph"
            />
            <p className="mt-1 text-xs text-ink-muted">Shown on the home page profile section only.</p>
          </div>
          <div className="md:col-span-2">
            <StringListEditor
              label="About page bio (full)"
              items={content.profileDetails.bioExtended ?? []}
              onChange={(bioExtended) => updateProfile('bioExtended', bioExtended)}
              addLabel="Add paragraph"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Profile photo</label>
            <MediaDropzone
              image={content.profileImage}
              video=""
              onChange={({ image }) => setContent((current) => (current ? { ...current, profileImage: image } : current))}
              onClear={() => setContent((current) => (current ? { ...current, profileImage: '' } : current))}
            />
          </div>
        </div>
        <div className="mt-6 border-t border-slate-200/80 pt-5">
          <p className="text-sm font-medium text-ink">Career impact stat cards</p>
          <div className="mt-4">
            <CareerStatsEditor
              stats={content.careerImpact.stats}
              onChange={(stats) => updateCareerImpact('stats', stats)}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={saveProfile} className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save profile</button>
          <button type="button" onClick={saveCareerImpact} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-brand uppercase">Save stat cards</button>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">2 · Certificates</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Certificates &amp; training archive</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Section label</label>
            <input className={fieldClassName} value={content.certificatesSection?.label ?? ''} onChange={(e) => updateCertificatesSection('label', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Section title</label>
            <input className={fieldClassName} value={content.certificatesSection?.title ?? ''} onChange={(e) => updateCertificatesSection('title', e.target.value)} />
          </div>
        </div>
        <button type="button" onClick={saveCertificatesHeader} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save section header</button>

        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          Pick slots 1–9 to set the first images on the About Me page. Those nine move to the top of this list and
          appear on page 1 here. Leave all unchecked to use the nine most recently added certificates.
        </p>

        <div className="mt-4">
        <DashboardItemList
          title="Certificate cards"
          countLabel={`${content.certificates.length} certificate${content.certificates.length === 1 ? '' : 's'} · first page shows slots 1–9`}
          items={displayedCertificates}
          editingId={editingCertId}
          onAdd={() => setEditingCertId('new')}
          onEdit={setEditingCertId}
          onDelete={(id) => deleteListItem('certificates', id, setEditingCertId, editingCertId)}
          getItemId={(i) => i.id}
          addLabel="Add certificate"
          addEditorPosition="top"
          pageSize={CERTIFICATE_FEATURED_COUNT}
          renderItem={(item) => (
            <article className="overflow-hidden rounded-lg border border-slate-200/80 bg-surface-alt/60">
              <div className="h-1 bg-brand" aria-hidden="true" />
              <div className="p-4">
                {editingCertId === item.id ? (
                  <CertificateEditor
                    key={item.id}
                    initialItem={item}
                    onSave={(entry) => saveListItem('certificates', entry, setEditingCertId)}
                    onCancel={() => setEditingCertId(null)}
                  />
                ) : (
                  <>
                    <div className="flex gap-3">
                      <div className="h-14 w-20 overflow-hidden rounded bg-slate-100">
                        {item.image ? (
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[0.6rem] font-medium text-ink-muted uppercase">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-ink">{item.title}</p>
                          {getCertificateFeaturedSlot(content.certificatesFeaturedIds, item.id) ? (
                            <span className="rounded-full bg-brand-muted px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide text-brand uppercase">
                              Slot {getCertificateFeaturedSlot(content.certificatesFeaturedIds, item.id)}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-ink-muted">{item.issuer} · {item.year}</p>
                      </div>
                    </div>
                    <CertificateFeaturedCheckboxes
                      certificateId={item.id}
                      selectedIds={content.certificatesFeaturedIds}
                      onToggle={handleCertificateFeaturedToggle}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingCertId(item.id)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          confirmDelete({
                            title: 'Delete this certificate?',
                            message: 'This certificate will be permanently removed.',
                            onConfirm: () => deleteListItem('certificates', item.id, setEditingCertId, editingCertId),
                          })
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-hover uppercase"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </article>
          )}
          renderEditor={(item) =>
            item === 'new' ? (
              <CertificateEditor
                initialItem={emptyCertificate}
                onSave={(entry) => saveListItem('certificates', entry, setEditingCertId)}
                onCancel={() => setEditingCertId(null)}
              />
            ) : null
          }
        />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">3 · Career journey</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Career timeline</h2>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Section label</label>
              <input className={fieldClassName} value={content.careerTimelineSection?.label ?? ''} onChange={(e) => updateCareerTimelineSection('label', e.target.value)} />
            </div>
            <div>
              <label className={labelClassName}>Section title</label>
              <input className={fieldClassName} value={content.careerTimelineSection?.title ?? ''} onChange={(e) => updateCareerTimelineSection('title', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClassName}>Introduction</label>
            <textarea className={`${fieldClassName} min-h-24 resize-y`} value={content.careerTimelineSection?.intro ?? ''} onChange={(e) => updateCareerTimelineSection('intro', e.target.value)} />
          </div>
        </div>
        <button type="button" onClick={saveCareerTimelineHeader} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save section header</button>

        <div className="mt-6">
        <DashboardItemList title="Timeline entries" countLabel={`${content.careerTimeline.length} entries`} items={content.careerTimeline} editingId={editingTimelineId} onAdd={() => setEditingTimelineId('new')} onEdit={setEditingTimelineId} onDelete={(id) => deleteListItem('careerTimeline', id, setEditingTimelineId, editingTimelineId)} getItemId={(i) => i.id}
          renderPreview={(item) => (<div><p className="text-xs font-semibold text-brand uppercase">{item.year} · {item.type}</p><p className="font-medium text-ink">{item.title}</p><p className="text-sm text-ink-muted">{item.org}</p></div>)}
          renderEditor={(item) => item === 'new' ? <TimelineEditor initialItem={emptyTimelineEntry} onSave={(entry) => saveListItem('careerTimeline', entry, setEditingTimelineId)} onCancel={() => setEditingTimelineId(null)} /> : <TimelineEditor key={item.id} initialItem={item} onSave={(entry) => saveListItem('careerTimeline', entry, setEditingTimelineId)} onCancel={() => setEditingTimelineId(null)} />}
        />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">4 · Leadership</p>
        <h2 className="mt-1 font-serif text-xl text-ink">International leadership &amp; professional service</h2>
        <p className="mt-1 text-sm text-ink-muted">Header and tabbed categories shown on the About Me page.</p>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Section label</label>
              <input className={fieldClassName} value={content.academicServices.label} onChange={(e) => updateAcademicServices('label', e.target.value)} />
            </div>
            <div>
              <label className={labelClassName}>Section title</label>
              <input className={fieldClassName} value={content.academicServices.title} onChange={(e) => updateAcademicServices('title', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClassName}>Introduction</label>
            <textarea className={`${fieldClassName} min-h-24 resize-y`} value={content.academicServices.intro} onChange={(e) => updateAcademicServices('intro', e.target.value)} />
          </div>
        </div>
        <button type="button" onClick={saveAcademicHeader} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save section header</button>

        <div className="mt-6">
        <DashboardItemList
          title="Leadership categories"
          countLabel={`${content.academicServices?.categories?.length ?? 0} categor${(content.academicServices?.categories?.length ?? 0) === 1 ? 'y' : 'ies'}`}
          items={content.academicServices?.categories ?? []}
          editingId={editingAcademicCategoryId}
          onAdd={() => setEditingAcademicCategoryId('new')}
          onEdit={setEditingAcademicCategoryId}
          onDelete={deleteAcademicCategory}
          getItemId={(item) => item.id}
          addLabel="Add category"
          emptyMessage="No categories yet."
          deleteTitle="Delete this category?"
          deleteMessage="All entries inside this category will also be removed."
          renderPreview={(item) => (
            <div>
              <p className="font-medium text-ink">{item.label}</p>
              <p className="text-sm text-ink-muted">{item.items.length} entr{item.items.length === 1 ? 'y' : 'ies'}</p>
            </div>
          )}
          renderEditor={(item) =>
            item === 'new' ? (
              <AcademicCategoryEditor initialCategory={emptyAcademicCategory} onSave={saveAcademicCategory} onCancel={() => setEditingAcademicCategoryId(null)} />
            ) : (
              <AcademicCategoryEditor key={item.id} initialCategory={item} onSave={saveAcademicCategory} onCancel={() => setEditingAcademicCategoryId(null)} />
            )
          }
        />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">5 · Publications</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Refereed publications</h2>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Section label</label>
              <input className={fieldClassName} value={content.refereedPublications?.label ?? ''} onChange={(e) => updateRefereedPublications('label', e.target.value)} />
            </div>
            <div>
              <label className={labelClassName}>Section title</label>
              <input className={fieldClassName} value={content.refereedPublications?.title ?? ''} onChange={(e) => updateRefereedPublications('title', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClassName}>Introduction</label>
            <textarea className={`${fieldClassName} min-h-24 resize-y`} value={content.refereedPublications?.intro ?? ''} onChange={(e) => updateRefereedPublications('intro', e.target.value)} />
          </div>
        </div>
        <button type="button" onClick={savePublicationsHeader} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save section header</button>

        <div className="mt-6">
        <DashboardItemList
          title="Refereed papers"
          countLabel={`${content.refereedPublications?.papers?.length ?? 0} paper${content.refereedPublications?.papers?.length === 1 ? '' : 's'}`}
          items={content.refereedPublications?.papers ?? []}
          editingId={editingPublicationId}
          onAdd={() => setEditingPublicationId('new')}
          onEdit={setEditingPublicationId}
          onDelete={deletePublication}
          getItemId={(item) => item.id}
          addLabel="Add paper"
          emptyMessage="No publications yet."
          renderPreview={(item) => (
            <div>
              <p className="text-xs font-semibold text-brand uppercase">{item.year} · {item.type}</p>
              <p className="font-medium text-ink">{item.title}</p>
              <p className="line-clamp-2 text-sm text-ink-muted">{item.venue}</p>
            </div>
          )}
          renderEditor={(item) =>
            item === 'new' ? (
              <PublicationEditor initialItem={emptyPublication} onSave={savePublication} onCancel={() => setEditingPublicationId(null)} />
            ) : (
              <PublicationEditor key={item.id} initialItem={item} onSave={savePublication} onCancel={() => setEditingPublicationId(null)} />
            )
          }
        />
        </div>
      </section>
        </>
      ) : null}
    </PanelShell>
  )
}
