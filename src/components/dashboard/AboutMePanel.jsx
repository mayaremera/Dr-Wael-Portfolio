import { useState } from 'react'
import DashboardItemList from './DashboardItemList'
import MediaDropzone from './MediaDropzone'
import { useConfirmDelete } from './DeleteConfirmDialog'
import {
  TIMELINE_TYPES,
  createContentId,
  emptyCertificate,
  emptyLeadershipRole,
  emptyTimelineEntry,
  getDefaultAboutContent,
  loadAboutContentRemote,
  resetAboutContent,
  saveAboutContent,
} from '../../data/aboutContentStore'
import { useDashboardSection } from '../../hooks/useDashboardSection'
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

function LeadershipEditor({ initialItem, onSave, onCancel }) {
  const [item, setItem] = useState({ ...emptyLeadershipRole, ...initialItem })
  const update = (field, value) => setItem((c) => ({ ...c, [field]: value }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...item, id: item.id || createContentId(item.title) }) }} className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5">
      <h3 className="font-serif text-xl text-ink">{item.id ? 'Edit leadership role' : 'New leadership role'}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><label className={labelClassName}>Year / period</label><input className={fieldClassName} value={item.year} onChange={(e) => update('year', e.target.value)} required /></div>
        <div className="sm:col-span-2"><label className={labelClassName}>Title</label><input className={fieldClassName} value={item.title} onChange={(e) => update('title', e.target.value)} required /></div>
        <div className="sm:col-span-2"><label className={labelClassName}>Organization</label><input className={fieldClassName} value={item.org} onChange={(e) => update('org', e.target.value)} required /></div>
        <div className="sm:col-span-2"><label className={labelClassName}>Note</label><textarea className={`${fieldClassName} min-h-20 resize-y`} value={item.note} onChange={(e) => update('note', e.target.value)} required /></div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">Cancel</button>
      </div>
    </form>
  )
}

export default function AboutMePanel() {
  const { content, setContent, loading, loadError } = useDashboardSection(
    getDefaultAboutContent,
    loadAboutContentRemote,
  )
  const [editingCertId, setEditingCertId] = useState(null)
  const [editingTimelineId, setEditingTimelineId] = useState(null)
  const [editingLeadershipId, setEditingLeadershipId] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const persist = (next, message = 'Changes saved.') => {
    persistDashboardSection({
      saveFn: saveAboutContent,
      nextContent: next,
      setContent,
      setSaveError,
      setSavedMessage,
      message,
      storageErrorMessage: 'Could not save — images may be too large. Try a smaller file.',
    })
  }

  const updateProfile = (field, value) => setContent((c) => ({ ...c, profileDetails: { ...c.profileDetails, [field]: value } }))
  const saveProfile = () => persist(content, 'Profile saved.')

  const saveListItem = (listKey, item, setEditing) => {
    const list = content[listKey]
    const exists = list.some((entry) => entry.id === item.id)
    const nextList = exists ? list.map((entry) => (entry.id === item.id ? item : entry)) : [item, ...list]
    persist({ ...content, [listKey]: nextList }, exists ? 'Entry updated.' : 'Entry created.')
    setEditing(null)
  }

  const deleteListItem = (listKey, id, setEditing, editingId) => {
    persist({ ...content, [listKey]: content[listKey].filter((entry) => entry.id !== id) }, 'Entry deleted.')
    if (editingId === id) setEditing(null)
  }

  const handleReset = () => {
    if (!window.confirm('Reset all About Me content back to defaults?')) return
    resetAboutContent()
    setContent(getDefaultAboutContent())
    setEditingCertId(null)
    setEditingTimelineId(null)
    setEditingLeadershipId(null)
    setSavedMessage('Reset to default content.')
    window.setTimeout(() => setSavedMessage(''), 2500)
  }

  return (
    <PanelShell eyebrow="About Me" title="Profile, certificates & career" description="Manage Dr. Wael's biography, certificates, career timeline, and leadership roles on the About Me page.">
      <DashboardSectionLoader loading={loading} loadError={loadError} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a href="/about-me" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand">Preview live page →</a>
        <div className="flex gap-2">
          {saveError ? <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-hover">{saveError}</span> : null}
          {savedMessage ? <span className="rounded-full bg-brand-muted px-3 py-1 text-xs font-semibold text-brand">{savedMessage}</span> : null}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="font-serif text-xl text-ink">About Dr. Wael</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div><label className={labelClassName}>Name</label><input className={fieldClassName} value={content.profileDetails.name} onChange={(e) => updateProfile('name', e.target.value)} /></div>
          <div><label className={labelClassName}>Tagline</label><input className={fieldClassName} value={content.profileDetails.tagline} onChange={(e) => updateProfile('tagline', e.target.value)} /></div>
          <div className="md:col-span-2"><label className={labelClassName}>Title</label><textarea className={`${fieldClassName} min-h-20 resize-y`} value={content.profileDetails.title} onChange={(e) => updateProfile('title', e.target.value)} /></div>
          <div className="md:col-span-2"><StringListEditor label="Credentials" items={content.profileDetails.credentials} onChange={(credentials) => updateProfile('credentials', credentials)} addLabel="Add credential" /></div>
          <div className="md:col-span-2"><StringListEditor label="Bio paragraphs" items={content.profileDetails.bio} onChange={(bio) => updateProfile('bio', bio)} addLabel="Add paragraph" /></div>
          <div className="md:col-span-2"><label className={labelClassName}>Profile photo</label><MediaDropzone image={content.profileImage} video="" onChange={({ image }) => setContent((c) => ({ ...c, profileImage: image }))} onClear={() => setContent((c) => ({ ...c, profileImage: '' }))} /></div>
        </div>
        <button type="button" onClick={saveProfile} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">Save profile</button>
      </section>

      <div className="mt-6">
        <DashboardItemList title="Certificates" countLabel={`${content.certificates.length} certificate${content.certificates.length === 1 ? '' : 's'}`} items={content.certificates} editingId={editingCertId} onAdd={() => setEditingCertId('new')} onEdit={setEditingCertId} onDelete={(id) => deleteListItem('certificates', id, setEditingCertId, editingCertId)} getItemId={(i) => i.id}
          renderPreview={(item) => (<div className="flex gap-3"><div className="h-14 w-20 overflow-hidden rounded bg-slate-100">{item.image ? <img src={item.image} alt="" className="h-full w-full object-cover" /> : null}</div><div><p className="font-medium text-ink">{item.title}</p><p className="text-xs text-ink-muted">{item.issuer} · {item.year}</p></div></div>)}
          renderEditor={(item) => item === 'new' ? <CertificateEditor initialItem={emptyCertificate} onSave={(entry) => saveListItem('certificates', entry, setEditingCertId)} onCancel={() => setEditingCertId(null)} /> : <CertificateEditor key={item.id} initialItem={item} onSave={(entry) => saveListItem('certificates', entry, setEditingCertId)} onCancel={() => setEditingCertId(null)} />}
        />
      </div>

      <div className="mt-6">
        <DashboardItemList title="Career timeline" countLabel={`${content.careerTimeline.length} entries`} items={content.careerTimeline} editingId={editingTimelineId} onAdd={() => setEditingTimelineId('new')} onEdit={setEditingTimelineId} onDelete={(id) => deleteListItem('careerTimeline', id, setEditingTimelineId, editingTimelineId)} getItemId={(i) => i.id}
          renderPreview={(item) => (<div><p className="text-xs font-semibold text-brand uppercase">{item.year} · {item.type}</p><p className="font-medium text-ink">{item.title}</p><p className="text-sm text-ink-muted">{item.org}</p></div>)}
          renderEditor={(item) => item === 'new' ? <TimelineEditor initialItem={emptyTimelineEntry} onSave={(entry) => saveListItem('careerTimeline', entry, setEditingTimelineId)} onCancel={() => setEditingTimelineId(null)} /> : <TimelineEditor key={item.id} initialItem={item} onSave={(entry) => saveListItem('careerTimeline', entry, setEditingTimelineId)} onCancel={() => setEditingTimelineId(null)} />}
        />
      </div>

      <div className="mt-6">
        <DashboardItemList title="Leadership & research" countLabel={`${content.leadershipRoles.length} roles`} items={content.leadershipRoles} editingId={editingLeadershipId} onAdd={() => setEditingLeadershipId('new')} onEdit={setEditingLeadershipId} onDelete={(id) => deleteListItem('leadershipRoles', id, setEditingLeadershipId, editingLeadershipId)} getItemId={(i) => i.id}
          renderPreview={(item) => (<div><p className="text-xs font-semibold text-brand uppercase">{item.year}</p><p className="font-medium text-ink">{item.title}</p><p className="text-sm text-ink-muted">{item.org}</p></div>)}
          renderEditor={(item) => item === 'new' ? <LeadershipEditor initialItem={emptyLeadershipRole} onSave={(entry) => saveListItem('leadershipRoles', entry, setEditingLeadershipId)} onCancel={() => setEditingLeadershipId(null)} /> : <LeadershipEditor key={item.id} initialItem={item} onSave={(entry) => saveListItem('leadershipRoles', entry, setEditingLeadershipId)} onCancel={() => setEditingLeadershipId(null)} />}
        />
      </div>

      <div className="mt-6">
        <button type="button" onClick={handleReset} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">Reset to defaults</button>
      </div>
    </PanelShell>
  )
}
