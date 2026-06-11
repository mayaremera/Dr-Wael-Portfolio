import { mediaGallery as defaultMediaGallery } from './content'
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

export const emptyGalleryItem = {
  id: '',
  type: 'image',
  src: '',
  alt: '',
}
