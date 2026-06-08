import { mediaGallery as defaultMediaGallery } from './content'
import { CONTENT_UPDATED_EVENT } from './contentStore'

const GALLERY_STORAGE_KEY = 'drwael-gallery-content'

function cloneContent(data) {
  return JSON.parse(JSON.stringify(data))
}

export function getDefaultGalleryContent() {
  return {
    mediaGallery: {
      ...cloneContent(defaultMediaGallery),
      items: defaultMediaGallery.items.map((item, index) => ({
        id: `gallery-${index}`,
        ...item,
      })),
    },
  }
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultGalleryContent()

  return {
    ...defaults,
    ...saved,
    mediaGallery: {
      ...defaults.mediaGallery,
      ...saved.mediaGallery,
      items: (saved.mediaGallery?.items ?? defaults.mediaGallery.items).map((item, index) => ({
        id: item.id || `gallery-${index}`,
        ...item,
      })),
    },
  }
}

export function loadGalleryContent() {
  try {
    const saved = localStorage.getItem(GALLERY_STORAGE_KEY)
    if (saved) {
      return mergeWithDefaults(JSON.parse(saved))
    }
  } catch {
    // fall through
  }

  return getDefaultGalleryContent()
}

export function saveGalleryContent(data) {
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded')
    }
    throw error
  }

  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
}

export function resetGalleryContent() {
  localStorage.removeItem(GALLERY_STORAGE_KEY)
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
}

export function createGalleryItemId() {
  return `gallery-item-${Date.now()}`
}

export const emptyGalleryItem = {
  id: '',
  type: 'image',
  src: '',
  alt: '',
}
