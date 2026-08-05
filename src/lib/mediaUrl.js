export function hasMediaSrc(src) {
  return typeof src === 'string' && src.trim().length > 0
}

export function withCacheBust(url) {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return url

  const [base] = url.split('?')
  return `${base}?v=${Date.now()}`
}

const SUPABASE_PUBLIC_OBJECT =
  /^(https?:\/\/[^/]+)\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/i

/**
 * On mobile, rewrite Supabase public object URLs to the image renderer
 * so cards download a smaller JPEG instead of the full upload.
 * Falls back to the original URL if transforms are unavailable (img onError).
 */
export function optimizeMediaUrlForMobile(url, { width = 640, quality = 68, resize = 'contain' } = {}) {
  if (!hasMediaSrc(url)) return url
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) return url

  const clean = url.trim().split('#')[0]
  const match = clean.match(SUPABASE_PUBLIC_OBJECT)
  if (!match) return url

  const [, origin, bucket, objectPath] = match
  const path = objectPath.split('?')[0]
  if (!path) return url

  const params = new URLSearchParams({
    width: String(Math.max(64, Math.round(width))),
    quality: String(Math.min(100, Math.max(40, Math.round(quality)))),
    resize,
  })

  return `${origin}/storage/v1/render/image/public/${bucket}/${path}?${params.toString()}`
}
