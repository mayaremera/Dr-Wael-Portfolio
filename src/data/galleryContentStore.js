import { mediaGallery as defaultMediaGallery, video as defaultWatchVideo } from './content'
import {
  CONTENT_SECTIONS,
  loadSectionPrimary,
  resetSectionPrimary,
  saveSectionPrimary,
} from './contentSync'

export const GALLERY_STORAGE_KEY = 'drwael-gallery-content'
export const GALLERY_PAGE_SIZE = 6

/** First index on page 5 when using GALLERY_PAGE_SIZE (0-based). */
export const GALLERY_BACKSEAT_POSITION = (5 - 1) * GALLERY_PAGE_SIZE

const GALLERY_BACKSEAT_VIDEO_PATTERN = /62\.49\.01\s*PM\.mp4/i

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
  return [...items].sort((a, b) => {
    const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : 0
    const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : 0
    if (orderB !== orderA) return orderB - orderA

    return String(a.id ?? '').localeCompare(String(b.id ?? ''))
  })
}

function ensureGallerySortOrders(items = []) {
  if (items.length === 0) return items

  return items.map((item, index) => {
    if (typeof item.sortOrder === 'number' && !Number.isNaN(item.sortOrder)) {
      return item
    }

    return {
      ...item,
      sortOrder: items.length - index,
    }
  })
}

function moveItemToPosition(items, fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= items.length) {
    return items
  }

  const reordered = [...items]
  const [moved] = reordered.splice(fromIndex, 1)
  reordered.splice(toIndex, 0, moved)

  const total = reordered.length
  return reordered.map((item, index) => ({
    ...item,
    sortOrder: total - index,
  }))
}

/** Stable display order: explicit sortOrder, with one legacy clip kept off page 1. */
export function applyGalleryPresentationOrder(items = []) {
  const withOrders = ensureGallerySortOrders(items)
  const sorted = sortGalleryItems(withOrders)
  const total = sorted.length

  if (total <= GALLERY_BACKSEAT_POSITION) return sorted

  const backseatIndex = sorted.findIndex(
    (item) => item.type === 'video' && GALLERY_BACKSEAT_VIDEO_PATTERN.test(item.src || ''),
  )

  if (backseatIndex === -1 || backseatIndex === GALLERY_BACKSEAT_POSITION) {
    return sorted
  }

  return moveItemToPosition(sorted, backseatIndex, GALLERY_BACKSEAT_POSITION)
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

export function getNextGallerySortOrder(items = []) {
  return Math.max(0, ...items.map((item) => item.sortOrder ?? 0)) + 1
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
      items: applyGalleryPresentationOrder(defaultItems),
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
      items: applyGalleryPresentationOrder(mergedItems),
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
  const payload = {
    ...data,
    mediaGallery: {
      ...data.mediaGallery,
      items: applyGalleryPresentationOrder(data.mediaGallery?.items ?? []),
    },
  }

  return saveSectionPrimary({
    section: CONTENT_SECTIONS.GALLERY,
    storageKey: GALLERY_STORAGE_KEY,
    data: payload,
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
  title: '',
  alt: '',
  description: '',
  sortOrder: null,
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
