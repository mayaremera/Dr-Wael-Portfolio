import { getSupabaseSession, isSupabaseConfigured, supabase } from './supabase'
import { isVideoFile, resolveMediaContentType } from './mediaFileTypes'

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

function formatStorageError(error, fallback = 'Upload failed.') {
  if (!error) return fallback

  const status = error.statusCode ?? error.status ?? error.statusText
  const message = error.message || fallback
  const lower = message.toLowerCase()

  if (lower.includes('bucket') && (lower.includes('not found') || lower.includes('does not exist'))) {
    return `Storage bucket "${MEDIA_BUCKET}" was not found. Create a public "${MEDIA_BUCKET}" bucket in Supabase Storage (or run the media bucket migration).`
  }

  if (
    lower.includes('row-level security') ||
    lower.includes('violates') ||
    lower.includes('permission') ||
    lower.includes('not authorized') ||
    lower.includes('jwt') ||
    status === 403 ||
    status === '403'
  ) {
    return `Storage permission denied (${status || 'RLS'}). Sign in again, and confirm authenticated users can upload to the "${MEDIA_BUCKET}" bucket.`
  }

  if (status) {
    return `${message} (status ${status})`
  }

  return message
}

function clearAuthCache() {
  cachedAuthContext = null
  cachedAuthContextAt = 0
}

/**
 * Resolve the current auth context. Session-first.
 * refreshSession is best-effort and never clears a still-valid session on failure.
 */
async function getAuthenticatedMediaContext({ softRefresh = false } = {}) {
  if (!isSupabaseConfigured || !supabase) return null

  if (!softRefresh && cachedAuthContext && Date.now() - cachedAuthContextAt < AUTH_CACHE_MS) {
    return cachedAuthContext
  }

  if (softRefresh) {
    try {
      await supabase.auth.refreshSession()
    } catch {
      // Ignore — fall through to existing session checks.
    }
  }

  const session = await getSupabaseSession()
  if (!session) {
    clearAuthCache()
    return null
  }

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    // Session may still be usable for Storage if getUser network-fails.
    // Prefer keeping the session when a local JWT exists.
    if (!session.access_token) {
      clearAuthCache()
      return null
    }

    cachedAuthContext = { user: session.user ?? { id: 'session' }, session }
    cachedAuthContextAt = Date.now()
    return cachedAuthContext
  }

  cachedAuthContext = { user: data.user, session }
  cachedAuthContextAt = Date.now()
  return cachedAuthContext
}

export async function isMediaStorageAvailable() {
  return Boolean(await getAuthenticatedMediaContext())
}

/**
 * Ensures Supabase is configured and the user has a valid session for Storage uploads.
 * Throws with an actionable message when cloud media is required but not ready.
 */
export async function assertCloudMediaReady() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }

  // Prefer the existing session first — do not require a successful refresh.
  let authContext = await getAuthenticatedMediaContext({ softRefresh: false })

  if (!authContext) {
    authContext = await getAuthenticatedMediaContext({ softRefresh: true })
  }

  if (!authContext) {
    throw new Error('Sign in to Supabase before uploading media.')
  }

  return authContext
}

async function verifyUploadedObject(objectPath, publicUrl) {
  // Confirm the object is listed in the bucket (getPublicUrl alone only builds a URL string).
  const { data: listed, error: listError } = await supabase.storage.from(MEDIA_BUCKET).list('', {
    search: objectPath,
    limit: 20,
  })

  const foundInList = Boolean(listed?.some((entry) => entry.name === objectPath))
  if (listError || !foundInList) {
    // Fallback: try reading the object directly (works even when list search is flaky).
    const { error: downloadError } = await supabase.storage.from(MEDIA_BUCKET).download(objectPath)
    if (downloadError) {
      throw new Error(
        `Upload did not land in the "${MEDIA_BUCKET}" bucket as "${objectPath}". ${formatStorageError(
          listError || downloadError,
          'Object missing after upload.',
        )}`,
      )
    }
  }

  // Public URL must resolve for the live site.
  try {
    const response = await fetch(publicUrl, { method: 'HEAD', mode: 'cors' })
    if (!response.ok) {
      throw new Error(
        `File is in Storage but the public URL returned ${response.status}. Confirm the "${MEDIA_BUCKET}" bucket is public.`,
      )
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('public URL')) throw error
    // Some browsers block HEAD on CORS; download already proved the object exists.
  }
}

export async function uploadMediaToStorage(file) {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  await assertCloudMediaReady()

  const objectPath = buildObjectPath(file)
  const contentType = resolveMediaContentType(file)
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(objectPath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType,
  })

  if (error) {
    throw new Error(formatStorageError(error))
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath)

  if (!data?.publicUrl) {
    throw new Error('Upload succeeded but no public URL was returned. Check that the media bucket is public.')
  }

  await verifyUploadedObject(objectPath, data.publicUrl)

  return {
    url: data.publicUrl,
    isVideo: isVideoFile(file),
    path: objectPath,
    bucket: MEDIA_BUCKET,
  }
}

/** Tiny valid JPEG used for Settings → Test media upload. */
export function createProbeJpegFile() {
  const bytes = Uint8Array.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
    0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08,
    0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12, 0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a,
    0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34,
    0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00,
    0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xff, 0xc4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01,
    0x00, 0x00, 0x3f, 0x00, 0x7f, 0xbf, 0xff, 0xd9,
  ])
  return new File([bytes], `media-probe-${Date.now()}.jpg`, { type: 'image/jpeg' })
}

export { MEDIA_BUCKET }
