import { drWaelActivity as defaultDrWaelActivity } from './content'
import { globalPresenceMap, mapLocations as defaultMapLocations } from './globalEventMap'
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

export function getDefaultGlobeContent() {
  return {
    ...cloneActivity(globalPresenceMap),
    locations: cloneActivity(defaultMapLocations),
  }
}

export function getDefaultDrWaelActivity() {
  return {
    ...cloneActivity(defaultDrWaelActivity),
    globe: getDefaultGlobeContent(),
  }
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultDrWaelActivity()

  return {
    ...defaults,
    ...saved,
    upcoming: saved.upcoming ?? defaults.upcoming,
    recent: saved.recent ?? defaults.recent,
    globe: {
      ...defaults.globe,
      ...saved.globe,
      locations: saved.globe?.locations?.length
        ? saved.globe.locations.map((location, index) => ({
            ...defaults.globe.locations[index],
            ...location,
            milestones: location.milestones?.length
              ? location.milestones.map((milestone, milestoneIndex) => ({
                  ...defaults.globe.locations[index]?.milestones?.[milestoneIndex],
                  ...milestone,
                  isMilestone: true,
                }))
              : (defaults.globe.locations[index]?.milestones ?? []),
          }))
        : defaults.globe.locations,
    },
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

export const emptyGlobeMilestone = {
  id: '',
  period: '',
  date: '',
  type: '',
  title: '',
  location: '',
  note: '',
  isMilestone: true,
}

export const emptyGlobeLocation = {
  id: '',
  country: '',
  city: '',
  lat: 0,
  lng: 0,
  flag: '',
  role: '',
  milestones: [],
}
