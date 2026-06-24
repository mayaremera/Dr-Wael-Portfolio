import { getSupabaseSession, isSupabaseConfigured, supabase } from './supabase'
import { isImageFile, isVideoFile, resolveMediaContentType } from './mediaFileTypes'

const MEDIA_BUCKET = 'media'
const AUTH_CACHE_MS = 5000

let cachedAuthContext = null
let cachedAuthContextAt = 0

function buildObjectPath(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40)

  return `${Date.now()}-${safeName || 'upload'}.${extension}`
}

async function getAuthenticatedMediaContext() {
  if (!isSupabaseConfigured || !supabase) return null

  if (cachedAuthContext && Date.now() - cachedAuthContextAt < AUTH_CACHE_MS) {
    return cachedAuthContext
  }

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    cachedAuthContext = null
    return null
  }

  const session = await getSupabaseSession()
  if (!session) {
    cachedAuthContext = null
    return null
  }

  cachedAuthContext = { user: data.user, session }
  cachedAuthContextAt = Date.now()
  return cachedAuthContext
}

export async function isMediaStorageAvailable() {
  return Boolean(await getAuthenticatedMediaContext())
}

export async function uploadMediaToStorage(file) {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  const authContext = await getAuthenticatedMediaContext()
  if (!authContext) {
    throw new Error('Sign in to Supabase before uploading media.')
  }

  const objectPath = buildObjectPath(file)
  const contentType = resolveMediaContentType(file)
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(objectPath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath)

  return {
    url: data.publicUrl,
    isVideo: isVideoFile(file),
  }
}
