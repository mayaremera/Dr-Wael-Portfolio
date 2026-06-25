import { mediaGallery as defaultMediaGallery, promoVideo as defaultPromoVideo, video as defaultWatchVideo } from './content'
import { mergeHomeContent } from './homeContentStore'
import {
  CONTENT_SECTIONS,
  fetchRemoteSection,
  markSectionLocallyPublished,
  loadSectionPrimary,
  notifyContentUpdated,
  publishSectionContent,
  resetSectionPrimary,
  saveRemoteSection,
  saveSectionPrimary,
} from './contentSync'
import { getSupabaseSession, isSupabaseConfigured } from '../lib/supabase'

export const GALLERY_STORAGE_KEY = 'drwael-gallery-content'
export const GALLERY_PAGE_SIZE = 15

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
    promoVideo: cloneContent(defaultPromoVideo),
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

function migratePromoCta(saved, defaults) {
  if (!saved) return defaults

  return {
    label: saved.label ?? defaults.label,
    href: saved.href ?? defaults.href,
  }
}

function migratePromoVideo(saved, defaults) {
  if (!saved) return defaults

  return {
    src: saved.src != null ? saved.src : defaults.src,
    sectionLabel: saved.sectionLabel ?? defaults.sectionLabel,
    sectionTitle: saved.sectionTitle ?? defaults.sectionTitle,
    label: saved.label ?? defaults.label,
    titleHighlight: saved.titleHighlight ?? defaults.titleHighlight,
    description: saved.description ?? defaults.description,
    cta: migratePromoCta(saved.cta, defaults.cta),
    secondary: migratePromoCta(saved.secondary, defaults.secondary),
  }
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultGalleryContent()

  const mergedItems =
    saved.mediaGallery?.items != null
      ? saved.mediaGallery.items.map((item, index) => withGalleryItemDefaults(item, index))
      : defaults.mediaGallery.items

  const mergedVideoItems =
    saved.videoLibrary?.items != null
      ? saved.videoLibrary.items.map((item, index) => ({
          id: item.id || `video-library-${index}`,
          ...item,
        }))
      : defaults.videoLibrary.items

  return {
    watchSection: {
      ...defaults.watchSection,
      ...saved.watchSection,
      paragraphs:
        saved.watchSection?.paragraphs != null
          ? saved.watchSection.paragraphs
          : defaults.watchSection.paragraphs,
    },
    promoVideo: migratePromoVideo(saved.promoVideo, defaults.promoVideo),
    videoLibrary: {
      label: saved.videoLibrary?.label ?? defaults.videoLibrary.label,
      title: saved.videoLibrary?.title ?? defaults.videoLibrary.title,
      description: saved.videoLibrary?.description ?? defaults.videoLibrary.description,
      items: mergedVideoItems,
    },
    mediaGallery: {
      label: saved.mediaGallery?.label ?? defaults.mediaGallery.label,
      title: saved.mediaGallery?.title ?? defaults.mediaGallery.title,
      description: saved.mediaGallery?.description ?? defaults.mediaGallery.description,
      items: applyGalleryPresentationOrder(mergedItems),
    },
  }
}

export function loadGalleryContent() {
  return getDefaultGalleryContent()
}

function buildGallerySavePayload(data) {
  return {
    ...data,
    mediaGallery: {
      ...data.mediaGallery,
      items: applyGalleryPresentationOrder(data.mediaGallery?.items ?? []),
    },
  }
}

async function persistPromoVideoMigration(remoteGallery, remoteHome) {
  const migratedGallery = mergeWithDefaults({
    ...(remoteGallery ?? {}),
    promoVideo: remoteHome.promoVideo,
  })

  const session = await getSupabaseSession()
  if (!session) {
    publishSectionContent(CONTENT_SECTIONS.GALLERY, migratedGallery)
    return migratedGallery
  }

  await saveRemoteSection(CONTENT_SECTIONS.GALLERY, buildGallerySavePayload(migratedGallery))
  markSectionLocallyPublished(CONTENT_SECTIONS.GALLERY)
  publishSectionContent(CONTENT_SECTIONS.GALLERY, migratedGallery)
  notifyContentUpdated(CONTENT_SECTIONS.GALLERY)

  // Only remove the legacy promoVideo field from home — never rewrite other home sections.
  const { promoVideo: _legacyPromoVideo, ...cleanedHome } = remoteHome ?? {}
  await saveRemoteSection(CONTENT_SECTIONS.HOME, cleanedHome)
  markSectionLocallyPublished(CONTENT_SECTIONS.HOME)
  publishSectionContent(CONTENT_SECTIONS.HOME, mergeHomeContent(cleanedHome))
  notifyContentUpdated(CONTENT_SECTIONS.HOME)

  return migratedGallery
}

export async function loadGalleryContentRemote() {
  if (isSupabaseConfigured) {
    const remoteGallery = await fetchRemoteSection(CONTENT_SECTIONS.GALLERY)
    const remoteHome = await fetchRemoteSection(CONTENT_SECTIONS.HOME)

    if (remoteHome?.promoVideo && remoteGallery?.promoVideo == null) {
      return persistPromoVideoMigration(remoteGallery, remoteHome)
    }
  }

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
    data: buildGallerySavePayload(data),
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
