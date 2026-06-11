import { getSupabaseSession, isSupabaseConfigured, supabase } from './supabase'

const MEDIA_BUCKET = 'media'

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

export async function isMediaStorageAvailable() {
  if (!isSupabaseConfigured || !supabase) return false
  const session = await getSupabaseSession()
  return Boolean(session)
}

export async function uploadMediaToStorage(file) {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  const session = await getSupabaseSession()
  if (!session) {
    throw new Error('Sign in to Supabase before uploading media.')
  }

  const objectPath = buildObjectPath(file)
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(objectPath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath)

  return {
    url: data.publicUrl,
    isVideo: file.type.startsWith('video/'),
  }
}
