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

export function cacheSectionLocally(storageKey, data) {
  localStorage.setItem(storageKey, JSON.stringify(data))
}

export function clearCachedSection(storageKey) {
  localStorage.removeItem(storageKey)
}

export function loadCachedSection(storageKey) {
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

    cacheSectionLocally(storageKey, data)
    notifyContentUpdated()
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

  notifyContentUpdated()
  return { synced: false, reason: 'local_only' }
}

export async function loadSectionPrimary({ section, storageKey, mergeWithDefaults, getDefaults }) {
  if (isSupabaseConfigured) {
    const remote = await fetchRemoteSection(section)

    if (remote) {
      const merged = mergeWithDefaults(remote)
      cacheSectionLocally(storageKey, merged)
      return merged
    }

    return getDefaults()
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
  notifyContentUpdated()
  return deleteRemoteSection(section)
}

export function notifyContentUpdated() {
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
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
      () => {
        realtimeListeners.forEach((listener) => listener())
      },
    )
    .subscribe()
}

function teardownRealtimeChannel() {
  if (!realtimeChannel || !supabase) return

  supabase.removeChannel(realtimeChannel)
  realtimeChannel = null
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
