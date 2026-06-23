import { mediaGallery as defaultMediaGallery, video as defaultWatchVideo } from './content'
import {
  CONTENT_SECTIONS,
  loadSectionPrimary,
  resetSectionPrimary,
  saveSectionPrimary,
} from './contentSync'

export const GALLERY_STORAGE_KEY = 'drwael-gallery-content'

function cloneContent(data) {
  return JSON.parse(JSON.stringify(data))
}

function parseDateFromSrc(src = '') {
  const match = src.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null

  const [, year, month, day] = match
  const timestamp = Date.parse(`${year}-${month}-${day}T12:00:00.000Z`)
  return Number.isNaN(timestamp) ? null : timestamp
}

export function getGalleryItemSortTime(item, fallbackIndex = 0) {
  if (item.createdAt) {
    const timestamp = Date.parse(item.createdAt)
    if (!Number.isNaN(timestamp)) return timestamp
  }

  const fromFilename = parseDateFromSrc(item.src)
  if (fromFilename) return fromFilename

  return fallbackIndex
}

export function sortGalleryItems(items = []) {
  return [...items]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const timeDiff = getGalleryItemSortTime(b.item, b.index) - getGalleryItemSortTime(a.item, a.index)
      if (timeDiff !== 0) return timeDiff
      return a.index - b.index
    })
    .map(({ item }) => item)
}

function withGalleryItemDefaults(item, index) {
  const createdAt =
    item.createdAt ||
    (parseDateFromSrc(item.src) ? new Date(parseDateFromSrc(item.src)).toISOString() : undefined)

  return {
    id: item.id || `gallery-${index}`,
    ...item,
    ...(createdAt ? { createdAt } : {}),
  }
}

export function getDefaultGalleryContent() {
  const defaultItems = defaultMediaGallery.items.map((item, index) =>
    withGalleryItemDefaults({ id: `gallery-${index}`, ...item }, index),
  )

  return {
    watchSection: cloneContent(defaultWatchVideo),
    videoLibrary: {
      label: 'Key Moments',
      title: 'Important Moments from Practice',
      description:
        'Highlights from lectures, ceremonies, and clinical work — each clip captures a meaningful moment in Dr. Wael’s journey.',
      items: [],
    },
    mediaGallery: {
      ...cloneContent(defaultMediaGallery),
      items: sortGalleryItems(defaultItems),
    },
  }
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultGalleryContent()

  const mergedItems = (saved.mediaGallery?.items ?? defaults.mediaGallery.items).map((item, index) =>
    withGalleryItemDefaults(item, index),
  )

  const mergedVideoItems = (saved.videoLibrary?.items ?? defaults.videoLibrary.items).map((item, index) => ({
    id: item.id || `video-library-${index}`,
    ...item,
  }))

  return {
    ...defaults,
    ...saved,
    watchSection: {
      ...defaults.watchSection,
      ...saved.watchSection,
      paragraphs: saved.watchSection?.paragraphs?.length
        ? saved.watchSection.paragraphs
        : defaults.watchSection.paragraphs,
    },
    videoLibrary: {
      ...defaults.videoLibrary,
      ...saved.videoLibrary,
      items: mergedVideoItems,
    },
    mediaGallery: {
      ...defaults.mediaGallery,
      ...saved.mediaGallery,
      items: sortGalleryItems(mergedItems),
    },
  }
}

export function loadGalleryContent() {
  return getDefaultGalleryContent()
}

export async function loadGalleryContentRemote() {
  return loadSectionPrimary({
    section: CONTENT_SECTIONS.GALLERY,
    storageKey: GALLERY_STORAGE_KEY,
    mergeWithDefaults,
    getDefaults: getDefaultGalleryContent,
  })
}

export async function saveGalleryContent(data) {
  return saveSectionPrimary({
    section: CONTENT_SECTIONS.GALLERY,
    storageKey: GALLERY_STORAGE_KEY,
    data,
  })
}

export async function resetGalleryContent() {
  return resetSectionPrimary({
    section: CONTENT_SECTIONS.GALLERY,
    storageKey: GALLERY_STORAGE_KEY,
  })
}

export function createGalleryItemId() {
  return `gallery-item-${Date.now()}`
}

export function createVideoLibraryItemId() {
  return `video-library-${Date.now()}`
}

export function parseYoutubeId(value = '') {
  const trimmed = value.trim()
  if (!trimmed) return ''

  const match = trimmed.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/)
  return match?.[1] ?? trimmed
}

export const emptyGalleryItem = {
  id: '',
  type: 'image',
  src: '',
  alt: '',
  createdAt: '',
}

export const emptyVideoLibraryItem = {
  id: '',
  title: '',
  subtitle: '',
  description: '',
  type: 'youtube',
  youtubeId: '',
  videoSrc: '',
  poster: '',
}
