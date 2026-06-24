import { getSupabaseSession, isSupabaseConfigured, supabase } from '../lib/supabase'

export const CONTENT_UPDATED_EVENT = 'drwael-content-updated'

export const CONTENT_SECTIONS = {
  ACTIVITY: 'activity',
  SERVICES: 'services',
  GALLERY: 'gallery',
  ABOUT: 'about',
  CONTACT: 'contact',
  HOME: 'home',
}

const memoryCache = new Map()
const inFlightLoads = new Map()
const sectionSubscribers = new Map()
const localPublishTimestamps = new Map()

const LOCAL_PUBLISH_GRACE_MS = 5000

export function markSectionLocallyPublished(section) {
  if (!section) return
  localPublishTimestamps.set(section, Date.now())
}

function shouldIgnoreRealtimeUpdate(section) {
  const publishedAt = localPublishTimestamps.get(section)
  if (!publishedAt) return false

  if (Date.now() - publishedAt > LOCAL_PUBLISH_GRACE_MS) {
    localPublishTimestamps.delete(section)
    return false
  }

  return true
}

export function getCachedSectionData(section) {
  return memoryCache.get(section) ?? null
}

export function invalidateSectionCache(section) {
  memoryCache.delete(section)
  inFlightLoads.delete(section)
}

export function publishSectionContent(section, data) {
  memoryCache.set(section, data)
  sectionSubscribers.get(section)?.forEach((listener) => listener(data))
}

export function subscribeToSectionContent(section, onUpdate) {
  if (!sectionSubscribers.has(section)) {
    sectionSubscribers.set(section, new Set())
  }

  sectionSubscribers.get(section).add(onUpdate)

  const cached = memoryCache.get(section)
  if (cached) {
    onUpdate(cached)
  }

  return () => {
    sectionSubscribers.get(section)?.delete(onUpdate)
  }
}

export function cacheSectionLocally(storageKey, data) {
  if (isSupabaseConfigured) return
  localStorage.setItem(storageKey, JSON.stringify(data))
}

export function clearCachedSection(storageKey) {
  localStorage.removeItem(storageKey)
}

export function loadCachedSection(storageKey) {
  if (isSupabaseConfigured) return null

  try {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export async function fetchRemoteSection(section) {
  if (!isSupabaseConfigured || !supabase) return null

  const { data, error } = await supabase
    .from('site_sections')
    .select('data, updated_at')
    .eq('section', section)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data?.data ?? null
}

export async function listRemoteSections() {
  if (!isSupabaseConfigured || !supabase) return []

  const { data, error } = await supabase
    .from('site_sections')
    .select('section, updated_at')
    .order('section')

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function saveRemoteSection(section, data) {
  if (!isSupabaseConfigured || !supabase) {
    return { synced: false, reason: 'not_configured' }
  }

  const session = await getSupabaseSession()
  if (!session) {
    return { synced: false, reason: 'not_authenticated' }
  }

  const { error } = await supabase.from('site_sections').upsert(
    {
      section,
      data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section' },
  )

  if (error) {
    throw new Error(error.message)
  }

  return { synced: true }
}

export async function saveSectionPrimary({ section, storageKey, data }) {
  if (isSupabaseConfigured) {
    const result = await saveRemoteSection(section, data)

    if (!result.synced) {
      if (result.reason === 'not_authenticated') {
        throw new Error('Sign in to Supabase to save changes.')
      }

      throw new Error('Supabase is not configured.')
    }

    markSectionLocallyPublished(section)
    publishSectionContent(section, data)
    notifyContentUpdated(section)
    return result
  }

  try {
    cacheSectionLocally(storageKey, data)
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded')
    }
    throw error
  }

  notifyContentUpdated(section)
  return { synced: false, reason: 'local_only' }
}

async function loadSectionFromSupabase({ section, mergeWithDefaults, getDefaults }) {
  if (inFlightLoads.has(section)) {
    return inFlightLoads.get(section)
  }

  const loadPromise = (async () => {
    const remote = await fetchRemoteSection(section)
    const merged = remote ? mergeWithDefaults(remote) : getDefaults()
    publishSectionContent(section, merged)
    return merged
  })()

  inFlightLoads.set(section, loadPromise)

  try {
    return await loadPromise
  } finally {
    inFlightLoads.delete(section)
  }
}

export async function loadSectionPrimary({ section, storageKey, mergeWithDefaults, getDefaults }) {
  if (isSupabaseConfigured) {
    const cached = getCachedSectionData(section)
    if (cached) return cached

    return loadSectionFromSupabase({ section, mergeWithDefaults, getDefaults })
  }

  const cached = loadCachedSection(storageKey)
  if (cached) {
    return mergeWithDefaults(cached)
  }

  return getDefaults()
}

export async function deleteRemoteSection(section) {
  if (!isSupabaseConfigured || !supabase) return { synced: false }

  const session = await getSupabaseSession()
  if (!session) {
    throw new Error('Sign in to Supabase to reset content.')
  }

  const { error } = await supabase.from('site_sections').delete().eq('section', section)
  if (error) throw new Error(error.message)

  return { synced: true }
}

export async function resetSectionPrimary({ section, storageKey }) {
  clearCachedSection(storageKey)
  invalidateSectionCache(section)
  notifyContentUpdated(section)
  return deleteRemoteSection(section)
}

export function notifyContentUpdated(section) {
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: { section } }))
}

const realtimeListeners = new Set()
let realtimeChannel = null

function ensureRealtimeChannel() {
  if (!isSupabaseConfigured || !supabase || realtimeChannel) return

  realtimeChannel = supabase
    .channel('site-sections')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'site_sections' },
      (payload) => {
        const section = payload.new?.section ?? payload.old?.section
        if (!section || shouldIgnoreRealtimeUpdate(section)) return

        invalidateSectionCache(section)
        realtimeListeners.forEach((listener) => listener(section))
      },
    )
    .subscribe()
}

function teardownRealtimeChannel() {
  if (!realtimeChannel || !supabase) return

  supabase.removeChannel(realtimeChannel)
  realtimeChannel = null
}

export function clearLegacyLocalCaches() {
  if (!isSupabaseConfigured) return

  const legacyKeys = [
    'drwael-home-content',
    'drwael-activity-content',
    'drwael-services-content',
    'drwael-gallery-content',
    'drwael-about-content',
    'drwael-contact-content',
  ]

  legacyKeys.forEach(clearCachedSection)
}

export function subscribeToRemoteContent(onChange) {
  if (!isSupabaseConfigured || !supabase) return () => {}

  ensureRealtimeChannel()
  realtimeListeners.add(onChange)

  return () => {
    realtimeListeners.delete(onChange)
    if (realtimeListeners.size === 0) {
      teardownRealtimeChannel()
    }
  }
}
