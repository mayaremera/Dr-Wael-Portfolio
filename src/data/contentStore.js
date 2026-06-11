import { drWaelActivity as defaultDrWaelActivity } from './content'
import {
  CONTENT_SECTIONS,
  loadSectionPrimary,
  resetSectionPrimary,
  saveSectionPrimary,
} from './contentSync'

export const ACTIVITY_STORAGE_KEY = 'drwael-activity-content'

export { CONTENT_UPDATED_EVENT } from './contentSync'

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
  return getDefaultDrWaelActivity()
}

export async function loadDrWaelActivityRemote() {
  return loadSectionPrimary({
    section: CONTENT_SECTIONS.ACTIVITY,
    storageKey: ACTIVITY_STORAGE_KEY,
    mergeWithDefaults,
    getDefaults: getDefaultDrWaelActivity,
  })
}

export async function saveDrWaelActivity(data) {
  return saveSectionPrimary({
    section: CONTENT_SECTIONS.ACTIVITY,
    storageKey: ACTIVITY_STORAGE_KEY,
    data,
  })
}

export async function resetDrWaelActivity() {
  return resetSectionPrimary({
    section: CONTENT_SECTIONS.ACTIVITY,
    storageKey: ACTIVITY_STORAGE_KEY,
  })
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
