import { drWaelActivity as defaultDrWaelActivity, professionalMembership as defaultProfessionalMembership } from './content'
import { globalPresenceMap, mapLocations as defaultMapLocations, normalizeGlobeCountries } from './globalEventMap'
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
    professionalMembership: cloneActivity(defaultProfessionalMembership),
  }
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

function migrateGlobeLocations(savedLocations, defaultLocations) {
  const normalizedDefaults = normalizeGlobeCountries(defaultLocations)
  if (savedLocations == null) return normalizedDefaults
  if (!savedLocations.length) return []

  const defaultById = new Map(normalizedDefaults.map((location) => [location.id, location]))

  if (shouldResetToDefaultGlobe(savedLocations, defaultById)) {
    return normalizedDefaults
  }

  return normalizeGlobeCountries(savedLocations)
}

function migrateGlobe(saved, defaults) {
  if (!saved) return defaults

  return {
    label: saved.label ?? defaults.label,
    title: saved.title ?? defaults.title,
    description: saved.description ?? defaults.description,
    locations: migrateGlobeLocations(saved.locations, defaults.locations),
  }
}

function migrateProfessionalMembership(saved, defaults) {
  if (!saved) return defaults

  return {
    label: saved.label ?? defaults.label,
    title: saved.title ?? defaults.title,
    intro: saved.intro ?? defaults.intro,
    organizations: saved.organizations != null ? saved.organizations : defaults.organizations,
  }
}

function migrateAcademicClinicalPresence(saved, defaults) {
  if (!saved) return defaults

  return {
    label: saved.label ?? defaults.label,
    title: saved.title ?? defaults.title,
    description: saved.description ?? defaults.description,
    primaryLabel: saved.primaryLabel ?? defaults.primaryLabel,
    secondaryLabel: saved.secondaryLabel ?? defaults.secondaryLabel,
  }
}

function normalizeHomepageFeaturedIds(savedIds, defaults) {
  const source = Array.isArray(savedIds) ? savedIds : defaults.homepageFeaturedIds
  return [0, 1, 2].map((index) => (typeof source[index] === 'string' ? source[index] : ''))
}

export function buildActivityEventPool(activity) {
  const upcoming = activity?.upcoming ?? []
  const recent = activity?.recent ?? []

  return [
    ...upcoming.map((event) => ({ ...event, isUpcoming: true })),
    ...recent.map((event) => ({ ...event, isUpcoming: false })),
  ]
}

export function resolveHomepageFeaturedEvents(activity) {
  const pool = buildActivityEventPool(activity)
  const byId = new Map(pool.map((event) => [event.id, event]))
  const selectedIds = normalizeHomepageFeaturedIds(activity?.homepageFeaturedIds, { homepageFeaturedIds: ['', '', ''] })
  const hasSelection = selectedIds.some((id) => id && byId.has(id))

  if (!hasSelection) {
    return pool.slice(0, 3)
  }

  const used = new Set()
  const featured = []

  for (const id of selectedIds) {
    if (id && byId.has(id) && !used.has(id)) {
      featured.push(byId.get(id))
      used.add(id)
      continue
    }

    const fallback = pool.find((event) => !used.has(event.id))
    if (fallback) {
      featured.push(fallback)
      used.add(fallback.id)
    }
  }

  return featured.slice(0, 3)
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultDrWaelActivity()
  const merged = {
    label: saved.label ?? defaults.label,
    title: saved.title ?? defaults.title,
    description: saved.description ?? defaults.description,
    upcoming: saved.upcoming != null ? saved.upcoming : defaults.upcoming,
    recent: saved.recent != null ? saved.recent : defaults.recent,
    globe: migrateGlobe(saved.globe, defaults.globe),
    professionalMembership: migrateProfessionalMembership(
      saved.professionalMembership,
      defaults.professionalMembership,
    ),
    academicClinicalPresence: migrateAcademicClinicalPresence(
      saved.academicClinicalPresence,
      defaults.academicClinicalPresence,
    ),
  }

  const validIds = new Set([
    ...(merged.upcoming ?? []).map((event) => event.id),
    ...(merged.recent ?? []).map((event) => event.id),
  ])

  merged.homepageFeaturedIds = normalizeHomepageFeaturedIds(
    saved.homepageFeaturedIds,
    defaults,
  ).map((id) => (id && validIds.has(id) ? id : ''))

  return merged
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

export const emptyMembershipOrg = {
  id: '',
  abbr: '',
  name: '',
  scope: 'International',
}

const MEMBERSHIP_SCOPES = ['International', 'National', 'Regional']
export { MEMBERSHIP_SCOPES }
