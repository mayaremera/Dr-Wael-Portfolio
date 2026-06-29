import { useRef, useState } from 'react'
import DashboardItemList from './DashboardItemList'
import DashboardSaveNotice from './DashboardSaveNotice'
import MediaDropzone from './MediaDropzone'
import { useConfirmDelete } from './DeleteConfirmDialog'
import {
  createGalleryItemId,
  createVideoLibraryItemId,
  applyGalleryPresentationOrder,
  emptyGalleryItem,
  emptyVideoLibraryItem,
  getDefaultGalleryContent,
  getNextGallerySortOrder,
  loadGalleryContentRemote,
  parseYoutubeId,
  saveGalleryContent,
} from '../../data/galleryContentStore'
import { CONTENT_SECTIONS } from '../../data/contentSync'
import { useDashboardSection } from '../../hooks/useDashboardSection'
import { withCacheBust } from '../../lib/mediaUrl'
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

function CtaFields({ label, cta, onChange }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-ink">{label}</p>
      <div>
        <label className={labelClassName}>Button label</label>
        <input className={fieldClassName} value={cta.label} onChange={(e) => onChange({ ...cta, label: e.target.value })} />
      </div>
    </div>
  )
}

function SaveChangesButton({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-50"
    >
      Save changes
    </button>
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
        <p className="font-medium text-ink">{item.title || item.alt || 'Untitled'}</p>
        <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
          {item.description?.trim() || item.alt || 'No description'}
        </p>
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
          <label className={labelClassName}>Title</label>
          <input
            className={fieldClassName}
            value={item.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Short headline for this moment"
          />
        </div>
        <div>
          <label className={labelClassName}>Description</label>
          <textarea
            className={`${fieldClassName} min-h-24 resize-y`}
            value={item.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="What is happening in this photo or video?"
          />
        </div>
        <div>
          <label className={labelClassName}>Alt text (accessibility)</label>
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
    CONTENT_SECTIONS.GALLERY,
  )
  const [editingId, setEditingId] = useState(null)
  const [editingVideoId, setEditingVideoId] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const contentRef = useRef(content)
  contentRef.current = content

  const persist = (nextContent, message = 'Changes saved.', previousContent = null) => {
    void persistDashboardSection({
      saveFn: saveGalleryContent,
      nextContent,
      previousContent,
      setContent,
      setSaveError,
      setSavedMessage,
      setIsSaving,
      message,
      storageErrorMessage: 'Could not save — media may be too large. Try a smaller file.',
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

  const normalizeGalleryItem = (item) => ({
    ...item,
    src: item.src ? withCacheBust(item.src) : '',
  })

  const normalizeVideoLibraryItem = (item) => ({
    ...item,
    poster: item.poster ? withCacheBust(item.poster) : '',
    videoSrc: item.videoSrc ? withCacheBust(item.videoSrc) : '',
  })

  const updateGalleryMeta = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        mediaGallery: { ...current.mediaGallery, [field]: value },
      }
    })
  }

  const updateWatchSection = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        watchSection: { ...current.watchSection, [field]: value },
      }
    })
  }

  const updateFeaturedVideo2 = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        featuredVideo2: { ...current.featuredVideo2, [field]: value },
      }
    })
  }

  const updateVideoLibraryMeta = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        videoLibrary: { ...current.videoLibrary, [field]: value },
      }
    })
  }

  const saveHeader = () => {
    persistFromCurrent((current) => current, 'Gallery header saved.')
  }

  const saveWatchSection = () => {
    persistFromCurrent(
      (current) => ({
        ...current,
        watchSection: {
          ...current.watchSection,
          poster: current.watchSection.poster ? withCacheBust(current.watchSection.poster) : '',
        },
      }),
      'Watch section saved.',
    )
  }

  const saveFeaturedVideo2 = () => {
    persistFromCurrent(
      (current) => ({
        ...current,
        featuredVideo2: {
          ...current.featuredVideo2,
          poster: current.featuredVideo2.poster ? withCacheBust(current.featuredVideo2.poster) : '',
        },
      }),
      'Second video saved.',
    )
  }

  const savePromoVideo = () => {
    persistFromCurrent((current) => current, 'Featured video section saved.')
  }

  const updatePromoVideo = (field, value) => {
    setContent((current) => {
      if (!current) return current
      return {
        ...current,
        promoVideo: { ...current.promoVideo, [field]: value },
      }
    })
  }

  const updatePromoVideoSrc = (video, message = 'Featured video saved.') => {
    persistFromCurrent(
      (current) => ({
        ...current,
        promoVideo: {
          ...current.promoVideo,
          src: video ? withCacheBust(video) : '',
        },
      }),
      message,
    )
  }

  const previewPromoVideoSrc = (video) => {
    if (!video) return
    setContent((current) =>
      current
        ? {
            ...current,
            promoVideo: { ...current.promoVideo, src: video },
          }
        : current,
    )
  }

  const saveVideoLibraryHeader = () => {
    persistFromCurrent((current) => current, 'Video library header saved.')
  }

  const saveItem = (item) => {
    const normalized = normalizeGalleryItem(item)
    const items = contentRef.current?.mediaGallery?.items ?? []
    const exists = items.some((entry) => entry.id === normalized.id)
    const existing = items.find((entry) => entry.id === normalized.id)
    const nextSortOrder = exists
      ? typeof normalized.sortOrder === 'number'
        ? normalized.sortOrder
        : (existing?.sortOrder ?? 0)
      : getNextGallerySortOrder(items)

    const nextItem = {
      ...normalized,
      sortOrder: nextSortOrder,
      createdAt: normalized.createdAt || existing?.createdAt || new Date().toISOString(),
    }

    persistFromCurrent(
      (current) => {
        const currentItems = current.mediaGallery.items
        const nextItems = exists
          ? currentItems.map((entry) => (entry.id === normalized.id ? nextItem : entry))
          : [...currentItems, nextItem]

        return {
          ...current,
          mediaGallery: {
            ...current.mediaGallery,
            items: applyGalleryPresentationOrder(nextItems),
          },
        }
      },
      exists ? 'Gallery item updated.' : 'Gallery item added.',
    )
    setEditingId(null)
  }

  const deleteItem = (id) => {
    persistFromCurrent(
      (current) => ({
        ...current,
        mediaGallery: {
          ...current.mediaGallery,
          items: current.mediaGallery.items.filter((entry) => entry.id !== id),
        },
      }),
      'Gallery item deleted.',
    )
    if (editingId === id) setEditingId(null)
  }

  const saveVideoItem = (item) => {
    const normalized = normalizeVideoLibraryItem(item)
    const exists = (contentRef.current?.videoLibrary?.items ?? []).some(
      (entry) => entry.id === normalized.id,
    )

    persistFromCurrent(
      (current) => {
        const items = current.videoLibrary.items
        const nextItems = exists
          ? items.map((entry) => (entry.id === normalized.id ? normalized : entry))
          : [normalized, ...items]

        return {
          ...current,
          videoLibrary: { ...current.videoLibrary, items: nextItems },
        }
      },
      exists ? 'Library video updated.' : 'Library video added.',
    )
    setEditingVideoId(null)
  }

  const deleteVideoItem = (id) => {
    persistFromCurrent(
      (current) => ({
        ...current,
        videoLibrary: {
          ...current.videoLibrary,
          items: current.videoLibrary.items.filter((entry) => entry.id !== id),
        },
      }),
      'Library video deleted.',
    )
    if (editingVideoId === id) setEditingVideoId(null)
  }

  return (
    <PanelShell
      eyebrow="Gallery"
      title="Gallery page"
      description="Sections are listed in the same order they appear on the live Gallery page."
    >
      <DashboardSaveNotice message={savedMessage} error={saveError} saving={isSaving} />
      <DashboardSectionLoader loading={loading} loadError={loadError} />
      {!loading && !loadError && content ? (
        <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a href="/gallery" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand transition-colors hover:text-brand-light">
          Preview live page →
        </a>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">1 · Top of page</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Watch section</h2>
        <p className="mt-1 text-sm text-ink-muted">Two featured YouTube blocks directly below the page hero — first with text on the left, second with video on the left.</p>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="font-serif text-lg text-ink">First video</h3>
          <p className="mt-1 text-sm text-ink-muted">Text on the left, video on the right.</p>
          <div className="mt-4 grid gap-4">
            <div>
              <label className={labelClassName}>YouTube ID or URL</label>
              <input
                className={fieldClassName}
                value={content.watchSection.youtubeId || content.watchSection.youtubeUrl || ''}
                onChange={(e) => {
                  const value = e.target.value
                  setContent((current) => {
                    if (!current) return current
                    return {
                      ...current,
                      watchSection: {
                        ...current.watchSection,
                        youtubeId: parseYoutubeId(value),
                        youtubeUrl: value.includes('http') ? value : current.watchSection.youtubeUrl,
                      },
                    }
                  })
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
            Save first video
          </button>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <h3 className="font-serif text-lg text-ink">Second video</h3>
          <p className="mt-1 text-sm text-ink-muted">Video on the left, text on the right — shown below the first video in the same section.</p>
          <div className="mt-4 grid gap-4">
            <div>
              <label className={labelClassName}>YouTube ID or URL</label>
              <input
                className={fieldClassName}
                value={content.featuredVideo2.youtubeId || content.featuredVideo2.youtubeUrl || ''}
                onChange={(e) => {
                  const value = e.target.value
                  setContent((current) => {
                    if (!current) return current
                    return {
                      ...current,
                      featuredVideo2: {
                        ...current.featuredVideo2,
                        youtubeId: parseYoutubeId(value),
                        youtubeUrl: value.includes('http') ? value : current.featuredVideo2.youtubeUrl,
                      },
                    }
                  })
                }}
              />
            </div>
            <div>
              <label className={labelClassName}>Title</label>
              <input className={fieldClassName} value={content.featuredVideo2.title} onChange={(e) => updateFeaturedVideo2('title', e.target.value)} />
            </div>
            <div>
              <label className={labelClassName}>Poster image</label>
              <MediaDropzone
                image={content.featuredVideo2.poster}
                video=""
                onChange={({ image }) => updateFeaturedVideo2('poster', image)}
                onClear={() => updateFeaturedVideo2('poster', '')}
              />
            </div>
            <StringListEditor
              label="Paragraphs"
              items={content.featuredVideo2.paragraphs ?? []}
              onChange={(paragraphs) => updateFeaturedVideo2('paragraphs', paragraphs)}
            />
          </div>
          <button type="button" onClick={saveFeaturedVideo2} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
            Save second video
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">2 · Key moments</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Video library</h2>
        <p className="mt-1 text-sm text-ink-muted">Important video moments shown as cards below the Watch section.</p>
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
            countLabel={`${content.videoLibrary.items.length} video${content.videoLibrary.items.length === 1 ? '' : 's'}`}
            items={content.videoLibrary.items}
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
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">3 · Featured video banner</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Promo video section</h2>
        <p className="mt-1 text-sm text-ink-muted">
          The background video banner with overlay text — below Key moments on this page, and after the services preview on the home page.
        </p>
        <div className="mt-4 grid gap-4">
          <div>
            <label className={labelClassName}>Background video</label>
            <MediaDropzone
              image=""
              video={content.promoVideo.src ?? ''}
              onChange={({ video }) => previewPromoVideoSrc(video)}
              onUploaded={({ video }) => updatePromoVideoSrc(video)}
              onClear={() => updatePromoVideoSrc('', 'Featured video removed.')}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Eyebrow label</label>
              <input
                className={fieldClassName}
                value={content.promoVideo.label ?? ''}
                onChange={(e) => updatePromoVideo('label', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClassName}>Headline</label>
              <input
                className={fieldClassName}
                value={content.promoVideo.titleHighlight ?? ''}
                onChange={(e) => updatePromoVideo('titleHighlight', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelClassName}>Description</label>
            <textarea
              className={`${fieldClassName} min-h-24 resize-y`}
              value={content.promoVideo.description ?? ''}
              onChange={(e) => updatePromoVideo('description', e.target.value)}
            />
          </div>
          <CtaFields
            label="Primary button"
            cta={content.promoVideo.cta}
            onChange={(cta) => updatePromoVideo('cta', cta)}
          />
          <CtaFields
            label="Secondary button"
            cta={content.promoVideo.secondary}
            onChange={(cta) => updatePromoVideo('secondary', cta)}
          />
          <div className="flex flex-wrap gap-3">
            <SaveChangesButton onClick={savePromoVideo} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">4 · Bottom of page</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Photo &amp; video gallery</h2>
        <p className="mt-1 text-sm text-ink-muted">Section header and paginated gallery cards at the bottom of the page.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Label</label>
            <input className={fieldClassName} value={content.mediaGallery.label} onChange={(e) => updateGalleryMeta('label', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Title</label>
            <input className={fieldClassName} value={content.mediaGallery.title} onChange={(e) => updateGalleryMeta('title', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Description</label>
            <textarea
              className={`${fieldClassName} min-h-20 resize-y`}
              value={content.mediaGallery.description || ''}
              onChange={(e) => updateGalleryMeta('description', e.target.value)}
            />
          </div>
        </div>
        <button type="button" onClick={saveHeader} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save header
        </button>
      </section>

      <div className="mt-6">
        <DashboardItemList
          title="Gallery items"
          countLabel={`${content.mediaGallery.items.length} item${content.mediaGallery.items.length === 1 ? '' : 's'}`}
          items={content.mediaGallery.items}
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
        </>
      ) : null}
    </PanelShell>
  )
}
