import { useState } from 'react'
import DashboardItemList from './DashboardItemList'
import MediaDropzone from './MediaDropzone'
import {
  createGalleryItemId,
  emptyGalleryItem,
  getDefaultGalleryContent,
  loadGalleryContent,
  resetGalleryContent,
  saveGalleryContent,
} from '../../data/galleryContentStore'

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

function GalleryItemPreview({ item }) {
  return (
    <div className="flex gap-3">
      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80">
        {item.src ? (
          item.type === 'video' ? (
            <video src={item.src} className="h-full w-full object-cover" muted playsInline />
          ) : (
            <img src={item.src} alt="" className="h-full w-full object-cover" />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-[0.6rem] text-ink-muted">No media</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="rounded-full bg-brand-muted px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide text-brand uppercase">
          {item.type}
        </span>
        <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{item.alt || 'No alt text'}</p>
      </div>
    </div>
  )
}

function GalleryItemEditor({ initialItem, onSave, onCancel }) {
  const [item, setItem] = useState({ ...emptyGalleryItem, ...initialItem })

  const updateField = (field, value) => {
    setItem((current) => ({ ...current, [field]: value }))
  }

  const handleMediaChange = ({ image, video }) => {
    if (video) {
      setItem((current) => ({ ...current, type: 'video', src: video }))
      return
    }

    setItem((current) => ({ ...current, type: 'image', src: image }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!item.src) return

    onSave({
      ...item,
      id: item.id || createGalleryItemId(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink">{item.id ? 'Edit gallery item' : 'New gallery item'}</h3>
        <button type="button" onClick={onCancel} className="text-xs font-semibold tracking-wide text-ink-muted uppercase hover:text-brand">
          Cancel
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label className={labelClassName}>Photo or video</label>
          <MediaDropzone
            image={item.type === 'image' ? item.src : ''}
            video={item.type === 'video' ? item.src : ''}
            onChange={handleMediaChange}
            onClear={() => updateField('src', '')}
          />
        </div>
        <div>
          <label className={labelClassName}>Alt text</label>
          <input className={fieldClassName} value={item.alt} onChange={(e) => updateField('alt', e.target.value)} required />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save item
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function GalleryPanel() {
  const [content, setContent] = useState(loadGalleryContent)
  const [editingId, setEditingId] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const persist = (nextContent, message = 'Changes saved to this browser.') => {
    try {
      saveGalleryContent(nextContent)
      setContent(nextContent)
      setSaveError('')
      setSavedMessage(message)
      window.setTimeout(() => setSavedMessage(''), 2500)
    } catch {
      setSaveError('Could not save — media may be too large for browser storage.')
    }
  }

  const updateGalleryMeta = (field, value) => {
    setContent((current) => ({
      ...current,
      mediaGallery: { ...current.mediaGallery, [field]: value },
    }))
  }

  const saveHeader = () => persist(content, 'Gallery header saved.')

  const saveItem = (item) => {
    const items = content.mediaGallery.items
    const exists = items.some((entry) => entry.id === item.id)
    const nextItems = exists ? items.map((entry) => (entry.id === item.id ? item : entry)) : [item, ...items]

    persist(
      {
        ...content,
        mediaGallery: { ...content.mediaGallery, items: nextItems },
      },
      exists ? 'Gallery item updated.' : 'Gallery item added.',
    )
    setEditingId(null)
  }

  const deleteItem = (id) => {
    persist(
      {
        ...content,
        mediaGallery: {
          ...content.mediaGallery,
          items: content.mediaGallery.items.filter((entry) => entry.id !== id),
        },
      },
      'Gallery item deleted.',
    )
    if (editingId === id) setEditingId(null)
  }

  const handleReset = () => {
    if (!window.confirm('Reset gallery content back to defaults?')) return
    resetGalleryContent()
    setContent(getDefaultGalleryContent())
    setEditingId(null)
    setSavedMessage('Reset to default content.')
    window.setTimeout(() => setSavedMessage(''), 2500)
  }

  const items = content.mediaGallery.items

  return (
    <PanelShell
      eyebrow="Gallery"
      title="Photo & video gallery"
      description="Add, edit, and remove images and videos in the gallery grid on the Video & Gallery page."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a href="/video-gallery#gallery" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand transition-colors hover:text-brand-light">
          Preview live page →
        </a>
        <div className="flex flex-wrap items-center gap-2">
          {saveError ? <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-hover">{saveError}</span> : null}
          {savedMessage ? <span className="rounded-full bg-brand-muted px-3 py-1 text-xs font-semibold text-brand">{savedMessage}</span> : null}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Gallery header</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Label</label>
            <input className={fieldClassName} value={content.mediaGallery.label} onChange={(e) => updateGalleryMeta('label', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Title</label>
            <input className={fieldClassName} value={content.mediaGallery.title} onChange={(e) => updateGalleryMeta('title', e.target.value)} />
          </div>
        </div>
        <button type="button" onClick={saveHeader} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save header
        </button>
      </section>

      <div className="mt-6">
        <DashboardItemList
          title="Gallery items"
          countLabel={`${items.length} item${items.length === 1 ? '' : 's'}`}
          items={items}
          editingId={editingId}
          onAdd={() => setEditingId('new')}
          onEdit={setEditingId}
          onDelete={deleteItem}
          getItemId={(item) => item.id}
          addLabel="Add item"
          renderPreview={(item) => <GalleryItemPreview item={item} />}
          renderEditor={(item) =>
            item === 'new' ? (
              <GalleryItemEditor initialItem={emptyGalleryItem} onSave={saveItem} onCancel={() => setEditingId(null)} />
            ) : (
              <GalleryItemEditor key={item.id} initialItem={item} onSave={saveItem} onCancel={() => setEditingId(null)} />
            )
          }
        />
      </div>

      <div className="mt-6">
        <button type="button" onClick={handleReset} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-accent/30 hover:text-accent-hover">
          Reset to defaults
        </button>
      </div>
    </PanelShell>
  )
}
