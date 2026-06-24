const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|avif|svg|bmp|heic|heif)$/i
const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|ogv)$/i

const IMAGE_MIME_BY_EXTENSION = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  heic: 'image/heic',
  heif: 'image/heif',
}

const VIDEO_MIME_BY_EXTENSION = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  m4v: 'video/mp4',
  ogv: 'video/ogg',
}

export function resolveMediaKind(file) {
  if (!file) return null

  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'

  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  if (IMAGE_EXTENSIONS.test(file.name) || extension in IMAGE_MIME_BY_EXTENSION) return 'image'
  if (VIDEO_EXTENSIONS.test(file.name) || extension in VIDEO_MIME_BY_EXTENSION) return 'video'

  return null
}

export function resolveMediaContentType(file) {
  if (file.type) return file.type

  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  return IMAGE_MIME_BY_EXTENSION[extension] || VIDEO_MIME_BY_EXTENSION[extension] || 'application/octet-stream'
}

export function isImageFile(file) {
  return resolveMediaKind(file) === 'image'
}

export function isVideoFile(file) {
  return resolveMediaKind(file) === 'video'
}
