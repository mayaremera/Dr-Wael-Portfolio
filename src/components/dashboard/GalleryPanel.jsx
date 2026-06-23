import { useState } from 'react'
import DashboardItemList from './DashboardItemList'
import MediaDropzone from './MediaDropzone'
import { useConfirmDelete } from './DeleteConfirmDialog'
import {
  createGalleryItemId,
  createVideoLibraryItemId,
  emptyGalleryItem,
  emptyVideoLibraryItem,
  getDefaultGalleryContent,
  loadGalleryContentRemote,
  parseYoutubeId,
  saveGalleryContent,
} from '../../data/galleryContentStore'
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

function StringListEditor({ label, items, onChange, addLabel = 'Add paragraph' }) {
  const confirmDelete = useConfirmDelete()

  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex gap-2">
            <textarea
              className={`${fieldClassName} min-h-20 resize-y`}
              value={item}
              onChange={(e) => onChange(items.map((entry, i) => (i === index ? e.target.value : entry)))}
            />
            <button
              type="button"
              onClick={() =>
                confirmDelete({
                  title: 'Remove this paragraph?',
                  message: 'This paragraph will be removed from the list.',
                  confirmLabel: 'Remove',
                  onConfirm: () => onChange(items.filter((_, i) => i !== index)),
                })
              }
              className="shrink-0 self-start rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold tracking-wide text-accent-hover uppercase"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="mt-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase"
      >
        {addLabel}
      </button>
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
      createdAt: item.createdAt || new Date().toISOString(),
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

function VideoLibraryItemPreview({ item }) {
  const description = item.description?.trim() || item.subtitle?.trim() || ''

  return (
    <div className="flex gap-3">
      <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80">
        {item.poster ? (
          <img src={item.poster} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[0.6rem] text-ink-muted">No poster</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{item.title || 'Untitled video'}</p>
        {item.subtitle ? <p className="mt-0.5 text-xs font-semibold tracking-wide text-brand uppercase">{item.subtitle}</p> : null}
        <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{description || item.youtubeId || item.videoSrc || 'No description'}</p>
      </div>
    </div>
  )
}

function VideoLibraryItemEditor({ initialItem, onSave, onCancel }) {
  const [item, setItem] = useState({ ...emptyVideoLibraryItem, ...initialItem })

  const updateField = (field, value) => {
    setItem((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!item.title) return

    const youtubeId = item.type === 'youtube' ? parseYoutubeId(item.youtubeId) : ''
    if (item.type === 'youtube' && !youtubeId) return
    if (item.type === 'file' && !item.videoSrc) return

    onSave({
      ...item,
      id: item.id || createVideoLibraryItemId(),
      youtubeId,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink">{item.id ? 'Edit library video' : 'New library video'}</h3>
        <button type="button" onClick={onCancel} className="text-xs font-semibold tracking-wide text-ink-muted uppercase hover:text-brand">
          Cancel
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClassName}>Title</label>
          <input className={fieldClassName} value={item.title} onChange={(e) => updateField('title', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Tag (optional)</label>
          <input
            className={fieldClassName}
            value={item.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="e.g. Lecture · 2024"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Description</label>
          <textarea
            className={`${fieldClassName} min-h-24 resize-y`}
            value={item.description ?? ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="What happens in this moment and why it matters..."
          />
        </div>
        <div>
          <label className={labelClassName}>Video source</label>
          <select className={fieldClassName} value={item.type} onChange={(e) => updateField('type', e.target.value)}>
            <option value="youtube">YouTube link (embedded player)</option>
            <option value="file">Upload video file</option>
          </select>
        </div>
        <div>
          <label className={labelClassName}>Poster image</label>
          <MediaDropzone
            image={item.poster}
            video=""
            onChange={({ image }) => updateField('poster', image)}
            onClear={() => updateField('poster', '')}
          />
        </div>
        {item.type === 'youtube' ? (
          <div className="sm:col-span-2">
            <label className={labelClassName}>YouTube link or video ID</label>
            <input
              className={fieldClassName}
              value={item.youtubeId}
              onChange={(e) => updateField('youtubeId', e.target.value)}
              placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..."
              required
            />
            <p className="mt-1.5 text-xs text-ink-muted">Plays inside the site in an embedded frame — the video is not stored on your server.</p>
          </div>
        ) : (
          <div className="sm:col-span-2">
            <label className={labelClassName}>Upload video</label>
            <MediaDropzone
              image=""
              video={item.videoSrc}
              onChange={({ video }) => updateField('videoSrc', video)}
              onClear={() => updateField('videoSrc', '')}
            />
            <p className="mt-1.5 text-xs text-ink-muted">Upload an MP4 or other supported video file to host on your site.</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save video
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function GalleryPanel() {
  const { content, setContent, loading, loadError } = useDashboardSection(
    getDefaultGalleryContent,
    loadGalleryContentRemote,
  )
  const [editingId, setEditingId] = useState(null)
  const [editingVideoId, setEditingVideoId] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const persist = (nextContent, message = 'Changes saved.') => {
    persistDashboardSection({
      saveFn: saveGalleryContent,
      nextContent,
      setContent,
      setSaveError,
      setSavedMessage,
      message,
      storageErrorMessage: 'Could not save — media may be too large. Try a smaller file.',
    })
  }

  const updateGalleryMeta = (field, value) => {
    setContent((current) => ({
      ...current,
      mediaGallery: { ...current.mediaGallery, [field]: value },
    }))
  }

  const updateWatchSection = (field, value) => {
    setContent((current) => ({
      ...current,
      watchSection: { ...current.watchSection, [field]: value },
    }))
  }

  const updateVideoLibraryMeta = (field, value) => {
    setContent((current) => ({
      ...current,
      videoLibrary: { ...current.videoLibrary, [field]: value },
    }))
  }

  const saveHeader = () => persist(content, 'Gallery header saved.')
  const saveWatchSection = () => persist(content, 'Watch section saved.')
  const saveVideoLibraryHeader = () => persist(content, 'Video library header saved.')

  const saveItem = (item) => {
    const items = content.mediaGallery.items
    const exists = items.some((entry) => entry.id === item.id)
    const nextItem = exists ? item : { ...item, createdAt: item.createdAt || new Date().toISOString() }
    const nextItems = exists
      ? items.map((entry) => (entry.id === item.id ? nextItem : entry))
      : [nextItem, ...items]

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

  const saveVideoItem = (item) => {
    const items = content.videoLibrary.items
    const exists = items.some((entry) => entry.id === item.id)
    const nextItems = exists ? items.map((entry) => (entry.id === item.id ? item : entry)) : [item, ...items]

    persist(
      {
        ...content,
        videoLibrary: { ...content.videoLibrary, items: nextItems },
      },
      exists ? 'Library video updated.' : 'Library video added.',
    )
    setEditingVideoId(null)
  }

  const deleteVideoItem = (id) => {
    persist(
      {
        ...content,
        videoLibrary: {
          ...content.videoLibrary,
          items: content.videoLibrary.items.filter((entry) => entry.id !== id),
        },
      },
      'Library video deleted.',
    )
    if (editingVideoId === id) setEditingVideoId(null)
  }

  const items = content.mediaGallery.items
  const videoItems = content.videoLibrary.items

  return (
    <PanelShell
      eyebrow="Gallery"
      title="Video & gallery page"
      description="Edit the Watch section, video library, and photo grid on the Video & Gallery page."
    >
      <DashboardSectionLoader loading={loading} loadError={loadError} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a href="/video-gallery" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand transition-colors hover:text-brand-light">
          Preview live page →
        </a>
        <div className="flex flex-wrap items-center gap-2">
          {saveError ? <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-hover">{saveError}</span> : null}
          {savedMessage ? <span className="rounded-full bg-brand-muted px-3 py-1 text-xs font-semibold text-brand">{savedMessage}</span> : null}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Watch section</h2>
        <p className="mt-1 text-sm text-ink-muted">The featured YouTube block below the page hero.</p>
        <div className="mt-4 grid gap-4">
          <div>
            <label className={labelClassName}>YouTube ID or URL</label>
            <input
              className={fieldClassName}
              value={content.watchSection.youtubeId || content.watchSection.youtubeUrl || ''}
              onChange={(e) => {
                const value = e.target.value
                setContent((current) => ({
                  ...current,
                  watchSection: {
                    ...current.watchSection,
                    youtubeId: parseYoutubeId(value),
                    youtubeUrl: value.includes('http') ? value : current.watchSection.youtubeUrl,
                  },
                }))
              }}
            />
          </div>
          <div>
            <label className={labelClassName}>Title</label>
            <input className={fieldClassName} value={content.watchSection.title} onChange={(e) => updateWatchSection('title', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Poster image</label>
            <MediaDropzone
              image={content.watchSection.poster}
              video=""
              onChange={({ image }) => updateWatchSection('poster', image)}
              onClear={() => updateWatchSection('poster', '')}
            />
          </div>
          <StringListEditor
            label="Paragraphs"
            items={content.watchSection.paragraphs ?? []}
            onChange={(paragraphs) => updateWatchSection('paragraphs', paragraphs)}
          />
        </div>
        <button type="button" onClick={saveWatchSection} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save watch section
        </button>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Key moments</h2>
        <p className="mt-1 text-sm text-ink-muted">Important video moments shown as cards below the Watch section. Add as many as you need.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Label</label>
            <input className={fieldClassName} value={content.videoLibrary.label} onChange={(e) => updateVideoLibraryMeta('label', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Title</label>
            <input className={fieldClassName} value={content.videoLibrary.title} onChange={(e) => updateVideoLibraryMeta('title', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Description</label>
            <textarea
              className={`${fieldClassName} min-h-24 resize-y`}
              value={content.videoLibrary.description}
              onChange={(e) => updateVideoLibraryMeta('description', e.target.value)}
            />
          </div>
        </div>
        <button type="button" onClick={saveVideoLibraryHeader} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save section header
        </button>

        <div className="mt-6">
          <DashboardItemList
            title="Moment videos"
            countLabel={`${videoItems.length} video${videoItems.length === 1 ? '' : 's'}`}
            items={videoItems}
            editingId={editingVideoId}
            onAdd={() => setEditingVideoId('new')}
            onEdit={setEditingVideoId}
            onDelete={deleteVideoItem}
            getItemId={(item) => item.id}
            addLabel="Add video"
            renderPreview={(item) => <VideoLibraryItemPreview item={item} />}
            renderEditor={(item) =>
              item === 'new' ? (
                <VideoLibraryItemEditor initialItem={emptyVideoLibraryItem} onSave={saveVideoItem} onCancel={() => setEditingVideoId(null)} />
              ) : (
                <VideoLibraryItemEditor key={item.id} initialItem={item} onSave={saveVideoItem} onCancel={() => setEditingVideoId(null)} />
              )
            }
          />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
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
    </PanelShell>
  )
}
