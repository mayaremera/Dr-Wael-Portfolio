import { drWaelActivity as defaultDrWaelActivity } from './content'

const ACTIVITY_STORAGE_KEY = 'drwael-activity-content'

export const CONTENT_UPDATED_EVENT = 'drwael-content-updated'

function cloneActivity(data) {
  return JSON.parse(JSON.stringify(data))
}

export function getDefaultDrWaelActivity() {
  return cloneActivity(defaultDrWaelActivity)
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultDrWaelActivity()

  return {
    ...defaults,
    ...saved,
    upcoming: saved.upcoming ?? defaults.upcoming,
    recent: saved.recent ?? defaults.recent,
  }
}

export function loadDrWaelActivity() {
  try {
    const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY)
    if (saved) {
      return mergeWithDefaults(JSON.parse(saved))
    }
  } catch {
    // fall through to defaults
  }

  return getDefaultDrWaelActivity()
}

export function saveDrWaelActivity(data) {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded')
    }
    throw error
  }

  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
}

export function resetDrWaelActivity() {
  localStorage.removeItem(ACTIVITY_STORAGE_KEY)
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
}

export function createActivityId(title = 'event') {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 24)

  return `${slug || 'event'}-${Date.now()}`
}

export const emptyActivityEvent = {
  id: '',
  period: '',
  date: '',
  type: '',
  title: '',
  location: '',
  image: '',
  video: '',
  imageAlt: '',
  note: '',
}
