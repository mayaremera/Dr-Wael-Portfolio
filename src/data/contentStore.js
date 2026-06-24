import { drWaelActivity as defaultDrWaelActivity } from './content'
import { globalPresenceMap, mapLocations as defaultMapLocations, normalizeGlobeCountries, normalizeGlobeCountry } from './globalEventMap'
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

function mergeGlobeRegions(defaultRegions = [], savedRegions = []) {
  const defaultById = new Map(defaultRegions.map((region) => [region.id, region]))

  if (!savedRegions.length) return defaultRegions

  return savedRegions.map((region) => {
    const fallback = defaultById.get(region.id) ?? {}
    return {
      ...fallback,
      ...region,
      milestones: region.milestones?.length
        ? region.milestones.map((milestone, milestoneIndex) => ({
            ...fallback.milestones?.[milestoneIndex],
            ...milestone,
            isMilestone: true,
          }))
        : (fallback.milestones ?? []),
    }
  })
}

function usesLegacyCityMarkerSchema(locations = []) {
  if (!locations.length) return false
  if (locations.some((loc) => Array.isArray(loc.regions) && loc.regions.length > 0)) return false
  return locations.some((loc) => loc.city)
}

function shouldResetToDefaultGlobe(savedLocations, defaultById) {
  if (!usesLegacyCityMarkerSchema(savedLocations)) return false
  const unknownCount = savedLocations.filter((loc) => !defaultById.has(loc.id)).length
  return unknownCount >= Math.ceil(savedLocations.length * 0.5)
}

function mergeGlobeCountry(defaultCountry, savedCountry) {
  const fallback = defaultCountry ?? {}
  return normalizeGlobeCountry({
    ...fallback,
    ...savedCountry,
    lat: Number.isFinite(Number(savedCountry.lat)) ? Number(savedCountry.lat) : fallback.lat,
    lng: Number.isFinite(Number(savedCountry.lng)) ? Number(savedCountry.lng) : fallback.lng,
    regions: mergeGlobeRegions(fallback.regions, savedCountry.regions),
  })
}

function mergeGlobeLocations(defaultLocations, savedLocations = []) {
  const normalizedDefaults = normalizeGlobeCountries(defaultLocations)
  if (!savedLocations.length) return normalizedDefaults

  const defaultById = new Map(normalizedDefaults.map((location) => [location.id, location]))

  if (shouldResetToDefaultGlobe(savedLocations, defaultById)) {
    return normalizedDefaults
  }

  const normalizedSaved = normalizeGlobeCountries(savedLocations)
  const savedById = new Map(normalizedSaved.map((location) => [location.id, location]))
  const merged = normalizedSaved.map((location) =>
    mergeGlobeCountry(defaultById.get(location.id), location),
  )

  for (const defaultLocation of normalizedDefaults) {
    if (!savedById.has(defaultLocation.id)) {
      merged.push(defaultLocation)
    }
  }

  return merged
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
      locations: mergeGlobeLocations(defaults.globe.locations, saved.globe?.locations),
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

export const emptyGlobeRegion = {
  id: '',
  name: '',
  role: '',
  milestones: [],
}

export const emptyGlobeLocation = {
  id: '',
  country: '',
  lat: 0,
  lng: 0,
  flag: '',
  role: '',
  regions: [{ ...emptyGlobeRegion, id: 'region-1', name: 'Main region' }],
}
