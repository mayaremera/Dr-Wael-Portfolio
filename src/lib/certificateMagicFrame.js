/**
 * Certificate Remaster — AI-style studio refactor (free, in-browser).
 *
 * 1. Remove the original background (IMG.LY ONNX model)
 * 2. Match the photo’s background color (or black/white) for seamless side fill
 * 3. Compose onto a perfect 4:3 card
 * 4. Zoom in/out — empty space always filled with the same solid bg
 *
 * No paper-stretch outpainting (that caused the blurry arrow glitch).
 */

export const FRAME_ASPECT = 4 / 3
/** High-res output so text/seals stay sharp on the About Me cards */
export const FRAME_OUTPUT_WIDTH = 2400
export const FRAME_OUTPUT_HEIGHT = Math.round(FRAME_OUTPUT_WIDTH / FRAME_ASPECT)
export const FRAME_EXPORT_QUALITY = 0.97

export const STUDIO_BACKGROUNDS = {
  auto: {
    id: 'auto',
    label: 'Match photo background',
    hint: 'Detects the photo’s bg color so sides blend in',
  },
  black: {
    id: 'black',
    label: 'Studio black',
    hint: 'Deep charcoal fill',
    color: { r: 18, g: 18, b: 20 },
  },
  white: {
    id: 'white',
    label: 'Studio white',
    hint: 'Clean bright fill',
    color: { r: 248, g: 248, b: 250 },
  },
}

export const DEFAULT_FRAME_SETTINGS = {
  mode: 'remaster',
  removeBg: false,
  horizontalFit: false,
  zoom: 1,
  studio: 'auto',
  region: null,
}

export function normalizeCertificateImageFrame(frame) {
  if (!frame || typeof frame !== 'object') return null

  const zoom = clamp(Number(frame.zoom ?? frame.fill ?? frame.scale ?? 1), 0.45, 1.55)
  let studio = 'auto'
  if (frame.studio === 'black' || frame.studio === 'white' || frame.studio === 'auto') {
    studio = frame.studio
  } else if (frame.studio === 'brand' || frame.backdrop === 'brand' || frame.backdrop === 'ink') {
    studio = 'black'
  } else if (frame.studio === 'cream' || frame.studio === 'soft' || frame.backdrop === 'paper') {
    studio = 'white'
  }

  return {
    mode: 'remaster',
    removeBg: frame.removeBg === true,
    horizontalFit: frame.horizontalFit === true,
    zoom: Number.isFinite(zoom) ? zoom : DEFAULT_FRAME_SETTINGS.zoom,
    studio,
    region: normalizeRegion(frame.region),
  }
}

function normalizeRegion(region) {
  if (!region || typeof region !== 'object') return null

  const x = Number(region.x)
  const y = Number(region.y)
  const width = Number(region.width)
  const height = Number(region.height)

  if (![x, y, width, height].every((value) => Number.isFinite(value) && value >= 0)) return null
  if (width <= 0.5 || height <= 0.5) return null

  return {
    unit: '%',
    x: clamp(x, 0, 100),
    y: clamp(y, 0, 100),
    width: clamp(width, 0.5, 100),
    height: clamp(height, 0.5, 100),
  }
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

async function resolveImageSrc(src) {
  if (!src) throw new Error('No image to remaster.')
  if (src.startsWith('blob:') || src.startsWith('data:')) return { src, revoke: null }

  const response = await fetch(src, { mode: 'cors' })
  if (!response.ok) {
    throw new Error('Could not load the certificate photo. Try uploading again.')
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  return { src: objectUrl, revoke: () => URL.revokeObjectURL(objectUrl) }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error('Could not load image for remaster.')))
    if (!src.startsWith('blob:') && !src.startsWith('data:')) {
      image.crossOrigin = 'anonymous'
    }
    image.src = src
  })
}

function canvasToFile(canvas, fileName, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(new File([result], fileName, { type: mimeType }))
        else reject(new Error('Could not export the remastered certificate.'))
      },
      mimeType,
      quality,
    )
  })
}

function rgba(color, alpha = 1) {
  return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${alpha})`
}

function luminance(color) {
  return (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255
}

/**
 * Detect opaque subject bounds on a transparent-PNG cutout.
 */
function detectAlphaBounds(image, alphaThreshold = 24) {
  const w = image.naturalWidth || image.width
  const h = image.naturalHeight || image.height
  const sampleW = Math.min(480, w)
  const sampleH = Math.max(1, Math.round((h / w) * sampleW))
  const canvas = document.createElement('canvas')
  canvas.width = sampleW
  canvas.height = sampleH
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return { x: 0, y: 0, width: w, height: h }

  ctx.drawImage(image, 0, 0, sampleW, sampleH)
  const { data } = ctx.getImageData(0, 0, sampleW, sampleH)

  let minX = sampleW
  let minY = sampleH
  let maxX = 0
  let maxY = 0
  let hits = 0

  for (let y = 0; y < sampleH; y += 1) {
    for (let x = 0; x < sampleW; x += 1) {
      const a = data[(y * sampleW + x) * 4 + 3]
      if (a < alphaThreshold) continue
      hits += 1
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }

  if (hits < 40) return { x: 0, y: 0, width: w, height: h }

  const padX = Math.round((maxX - minX) * 0.02)
  const padY = Math.round((maxY - minY) * 0.02)
  minX = Math.max(0, minX - padX)
  minY = Math.max(0, minY - padY)
  maxX = Math.min(sampleW - 1, maxX + padX)
  maxY = Math.min(sampleH - 1, maxY + padY)

  const sx = w / sampleW
  const sy = h / sampleH
  return {
    x: Math.floor(minX * sx),
    y: Math.floor(minY * sy),
    width: Math.max(1, Math.ceil((maxX - minX + 1) * sx)),
    height: Math.max(1, Math.ceil((maxY - minY + 1) * sy)),
  }
}

/**
 * Average subject color (opaque pixels) to decide black vs white studio.
 */
function sampleSubjectTone(image, bounds) {
  const tw = Math.min(240, bounds.width)
  const th = Math.max(1, Math.round((bounds.height / bounds.width) * tw))
  const canvas = document.createElement('canvas')
  canvas.width = tw
  canvas.height = th
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return { r: 80, g: 80, b: 80 }

  ctx.drawImage(
    image,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    0,
    0,
    tw,
    th,
  )
  const { data } = ctx.getImageData(0, 0, tw, th)

  let r = 0
  let g = 0
  let b = 0
  let n = 0

  for (let i = 0; i < data.length; i += 16) {
    const a = data[i + 3]
    if (a < 40) continue
    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
    n += 1
  }

  if (!n) return { r: 80, g: 80, b: 80 }
  return { r: r / n, g: g / n, b: b / n }
}

function resolveStudioColor(studioId, subjectTone, detectedBg = null) {
  if (studioId === 'black') return { ...STUDIO_BACKGROUNDS.black.color }
  if (studioId === 'white') return { ...STUDIO_BACKGROUNDS.white.color }

  // Match photo background — seamless side fill, no black/grey patching
  if (detectedBg && Number.isFinite(detectedBg.r)) {
    return {
      r: clamp(Math.round(detectedBg.r), 0, 255),
      g: clamp(Math.round(detectedBg.g), 0, 255),
      b: clamp(Math.round(detectedBg.b), 0, 255),
    }
  }

  return luminance(subjectTone) > 0.55
    ? { ...STUDIO_BACKGROUNDS.white.color }
    : { ...STUDIO_BACKGROUNDS.black.color }
}

/**
 * Detect the photo background color from corners + edge midpoints.
 * Used so studio side-fill matches the certificate photo.
 */
export function detectBackgroundColor(image) {
  const naturalW = image.naturalWidth || image.width
  const naturalH = image.naturalHeight || image.height
  if (!naturalW || !naturalH) return { r: 40, g: 40, b: 42 }

  const scale = Math.min(1, 360 / Math.max(naturalW, naturalH))
  const w = Math.max(1, Math.round(naturalW * scale))
  const h = Math.max(1, Math.round(naturalH * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return { r: 40, g: 40, b: 42 }

  ctx.drawImage(image, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)

  const patch = Math.max(2, Math.round(Math.min(w, h) * 0.06))
  const samples = [
    averagePatch(data, w, h, 0, 0, patch, patch),
    averagePatch(data, w, h, w - patch, 0, patch, patch),
    averagePatch(data, w, h, 0, h - patch, patch, patch),
    averagePatch(data, w, h, w - patch, h - patch, patch, patch),
    averagePatch(data, w, h, Math.floor(w / 2 - patch / 2), 0, patch, patch),
    averagePatch(data, w, h, Math.floor(w / 2 - patch / 2), h - patch, patch, patch),
    averagePatch(data, w, h, 0, Math.floor(h / 2 - patch / 2), patch, patch),
    averagePatch(data, w, h, w - patch, Math.floor(h / 2 - patch / 2), patch, patch),
  ].filter(Boolean)

  if (!samples.length) return { r: 40, g: 40, b: 42 }

  const sorted = [...samples].sort((a, b) => luminance(a) - luminance(b))
  const start = Math.floor(sorted.length * 0.15)
  const end = Math.ceil(sorted.length * 0.85) || sorted.length
  const core = sorted.slice(start, end)
  const use = core.length ? core : sorted
  const n = use.length

  return {
    r: Math.round(use.reduce((sum, c) => sum + c.r, 0) / n),
    g: Math.round(use.reduce((sum, c) => sum + c.g, 0) / n),
    b: Math.round(use.reduce((sum, c) => sum + c.b, 0) / n),
  }
}

function averagePatch(data, w, h, startX, startY, pw, ph) {
  const x0 = clamp(Math.floor(startX), 0, w - 1)
  const y0 = clamp(Math.floor(startY), 0, h - 1)
  const x1 = clamp(x0 + Math.max(1, pw), 1, w)
  const y1 = clamp(y0 + Math.max(1, ph), 1, h)

  let r = 0
  let g = 0
  let b = 0
  let n = 0

  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const i = (y * w + x) * 4
      if (data[i + 3] < 20) continue
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      n += 1
    }
  }

  if (!n) return null
  return { r: r / n, g: g / n, b: b / n }
}

function fillSolidStudio(ctx, width, height, color, grainProfile = null) {
  ctx.fillStyle = rgba(color, 1)
  ctx.fillRect(0, 0, width, height)

  // Photographic grain so extended fill matches noisy camera backgrounds
  const strength = clamp(grainProfile?.strength ?? 5.5, 2.5, 14)
  const tile = createPhotoGrainTile(192, strength)
  const pattern = ctx.createPattern(tile, 'repeat')
  if (!pattern) return

  ctx.save()
  // soft-light keeps base color while adding real noise texture
  ctx.globalCompositeOperation = 'soft-light'
  ctx.globalAlpha = clamp(0.28 + strength / 28, 0.32, 0.62)
  ctx.fillStyle = pattern
  ctx.fillRect(0, 0, width, height)
  ctx.restore()

  // Second lighter pass for fine sensor-like jitter
  ctx.save()
  ctx.globalCompositeOperation = 'overlay'
  ctx.globalAlpha = clamp(strength / 40, 0.12, 0.28)
  ctx.fillStyle = pattern
  ctx.fillRect(0, 0, width, height)
  ctx.restore()
}

/**
 * Measure noise strength from the photo’s corner backgrounds.
 */
export function measureBackgroundGrain(image) {
  const naturalW = image.naturalWidth || image.width
  const naturalH = image.naturalHeight || image.height
  if (!naturalW || !naturalH) return { strength: 5.5 }

  const scale = Math.min(1, 320 / Math.max(naturalW, naturalH))
  const w = Math.max(1, Math.round(naturalW * scale))
  const h = Math.max(1, Math.round(naturalH * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return { strength: 5.5 }

  ctx.drawImage(image, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)
  const patch = Math.max(4, Math.round(Math.min(w, h) * 0.08))

  const regions = [
    [0, 0],
    [w - patch, 0],
    [0, h - patch],
    [w - patch, h - patch],
  ]

  let varianceSum = 0
  let regionCount = 0

  for (const [sx, sy] of regions) {
    const stats = patchLuminanceStats(data, w, h, sx, sy, patch, patch)
    if (!stats || stats.count < 20) continue
    varianceSum += stats.variance
    regionCount += 1
  }

  if (!regionCount) return { strength: 5.5 }
  const stddev = Math.sqrt(varianceSum / regionCount)
  // Map photo stddev (~2–16) into a usable grain strength
  return { strength: clamp(stddev * 0.95, 3, 12) }
}

function patchLuminanceStats(data, w, h, startX, startY, pw, ph) {
  const x0 = clamp(Math.floor(startX), 0, w - 1)
  const y0 = clamp(Math.floor(startY), 0, h - 1)
  const x1 = clamp(x0 + Math.max(1, pw), 1, w)
  const y1 = clamp(y0 + Math.max(1, ph), 1, h)

  let sum = 0
  let count = 0
  const values = []

  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const i = (y * w + x) * 4
      if (data[i + 3] < 20) continue
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
      values.push(lum)
      sum += lum
      count += 1
    }
  }

  if (count < 8) return null
  const mean = sum / count
  let variance = 0
  for (const value of values) {
    const d = value - mean
    variance += d * d
  }
  variance /= count
  return { mean, variance, count }
}

function createPhotoGrainTile(size, strength) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return canvas

  const imageData = ctx.createImageData(size, size)
  const { data } = imageData
  const amp = clamp(strength * 2.2, 6, 28)

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4
      // Deterministic hash noise (stable previews) with slight chroma split
      const n1 = hashNoise(x, y)
      const n2 = hashNoise(x + 19, y + 37)
      const n3 = hashNoise(x + 53, y + 91)
      const mono = (n1 - 0.5) * 2 * amp
      data[i] = clamp(128 + mono + (n2 - 0.5) * amp * 0.25, 0, 255)
      data[i + 1] = clamp(128 + mono + (n3 - 0.5) * amp * 0.2, 0, 255)
      data[i + 2] = clamp(128 + mono - (n2 - 0.5) * amp * 0.15, 0, 255)
      data[i + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

function hashNoise(x, y) {
  let n = (x * 374761393 + y * 668265263) | 0
  n = (n ^ (n >> 13)) * 1274126177
  n = n ^ (n >> 16)
  return ((n >>> 0) % 10000) / 10000
}

/**
 * Cache cutouts per source so zoom/studio tweaks stay instant after first AI pass.
 */
const cutoutCache = new Map()

async function srcToBlob(src) {
  if (src.startsWith('blob:') || src.startsWith('data:')) {
    const response = await fetch(src)
    return response.blob()
  }
  const response = await fetch(src, { mode: 'cors' })
  if (!response.ok) throw new Error('Could not load photo for background removal.')
  return response.blob()
}

async function getCutoutImage(imageSrc, onProgress) {
  const cacheKey = imageSrc
  const cached = cutoutCache.get(cacheKey)
  if (cached?.image) return cached

  onProgress?.('Removing background… first run may download the AI model.')

  const { removeBackground } = await import('@imgly/background-removal')
  const blob = await srcToBlob(imageSrc)
  const cutoutBlob = await removeBackground(blob, {
    // Full-precision model — better edges, truer colors than quantized variants
    model: 'isnet',
    output: { format: 'image/png', quality: 1, type: 'foreground' },
    progress: (key, current, total) => {
      if (!total) return
      const pct = Math.round((current / total) * 100)
      onProgress?.(`Preparing AI model… ${pct}%`)
    },
  })

  const cutoutUrl = URL.createObjectURL(cutoutBlob)
  const image = await loadImage(cutoutUrl)
  const bounds = detectAlphaBounds(image)
  const entry = { image, bounds, cutoutUrl }
  cutoutCache.set(cacheKey, entry)
  return entry
}

/**
 * Fallback when BG removal fails: tight content crop, no stretch outpaint.
 */
async function getFallbackSubject(imageSrc) {
  const resolved = await resolveImageSrc(imageSrc)
  try {
    const image = await loadImage(resolved.src)
    const bounds = {
      x: 0,
      y: 0,
      width: image.naturalWidth || image.width,
      height: image.naturalHeight || image.height,
    }
    return { image, bounds, cutoutUrl: null, revoke: resolved.revoke }
  } catch (error) {
    resolved.revoke?.()
    throw error
  }
}

/**
 * Flatten cutout onto the studio color so edges are clean and opaque.
 * Prevents “white plate on black bg” patching from leftover alpha fringes.
 */
function flattenSubjectOntoStudio(image, bounds, studioColor) {
  const width = Math.max(1, Math.round(bounds.width))
  const height = Math.max(1, Math.round(bounds.height))

  const srcCanvas = document.createElement('canvas')
  srcCanvas.width = width
  srcCanvas.height = height
  const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true })
  if (!srcCtx) return { canvas: image, width: bounds.width, height: bounds.height, sx: bounds.x, sy: bounds.y }

  srcCtx.clearRect(0, 0, width, height)
  srcCtx.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, width, height)
  const src = srcCtx.getImageData(0, 0, width, height)

  const outCanvas = document.createElement('canvas')
  outCanvas.width = width
  outCanvas.height = height
  const outCtx = outCanvas.getContext('2d', { willReadFrequently: true })
  if (!outCtx) return { canvas: image, width: bounds.width, height: bounds.height, sx: bounds.x, sy: bounds.y }

  const out = outCtx.createImageData(width, height)
  const sr = studioColor.r
  const sg = studioColor.g
  const sb = studioColor.b

  for (let i = 0; i < src.data.length; i += 4) {
    let a = src.data[i + 3] / 255

    // Kill weak halo / fringe pixels that cause a second “mat” around the subject
    if (a < 0.12) a = 0
    else if (a < 0.4) a = (a - 0.12) / (0.4 - 0.12) // smooth ramp

    out.data[i] = Math.round(src.data[i] * a + sr * (1 - a))
    out.data[i + 1] = Math.round(src.data[i + 1] * a + sg * (1 - a))
    out.data[i + 2] = Math.round(src.data[i + 2] * a + sb * (1 - a))
    out.data[i + 3] = 255
  }

  outCtx.putImageData(out, 0, 0)
  return { canvas: outCanvas, width, height, sx: 0, sy: 0 }
}

/**
 * Build a perfect 4:3 remastered certificate File.
 * One clean studio background end-to-end — no nested mats / patching.
 */
export async function createMagicFrameFile(imageSrc, rawSettings = {}, options = {}) {
  const {
    fileName = `certificate-remaster-${Date.now()}.jpg`,
    mimeType = 'image/jpeg',
    quality = FRAME_EXPORT_QUALITY,
    outputWidth = FRAME_OUTPUT_WIDTH,
    outputHeight = FRAME_OUTPUT_HEIGHT,
    onProgress,
  } = options

  const settings = normalizeCertificateImageFrame({ ...DEFAULT_FRAME_SETTINGS, ...rawSettings })

  let subject
  let fallbackRevoke = null

  if (settings.removeBg) {
    try {
      subject = await getCutoutImage(imageSrc, onProgress)
    } catch {
      onProgress?.('AI cutout unavailable — using clean studio compose fallback.')
      const fallback = await getFallbackSubject(imageSrc)
      subject = fallback
      fallbackRevoke = fallback.revoke
    }
  } else {
    const fallback = await getFallbackSubject(imageSrc)
    subject = fallback
    fallbackRevoke = fallback.revoke
  }

  try {
    onProgress?.('Composing clean studio card…')
    const { image, bounds } = subject
    const tone = sampleSubjectTone(image, bounds)

    // Load original once — match bg color + copy its grain so fill doesn’t look flat/generated
    let detectedBg = null
    let grainProfile = { strength: 5.5 }
    onProgress?.('Matching photo background texture…')
    const originalResolved = await resolveImageSrc(imageSrc)
    try {
      const originalImage = await loadImage(originalResolved.src)
      grainProfile = measureBackgroundGrain(originalImage)
      if (settings.studio === 'auto') {
        detectedBg = detectBackgroundColor(originalImage)
      }
    } finally {
      originalResolved.revoke?.()
    }

    const studioColor = resolveStudioColor(settings.studio, tone, detectedBg)

    const canvas = document.createElement('canvas')
    canvas.width = outputWidth
    canvas.height = outputHeight
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) throw new Error('Could not prepare the remaster canvas.')

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Full-bleed fill with photo-matched color + grain
    fillSolidStudio(ctx, outputWidth, outputHeight, studioColor, grainProfile)

    // Flatten subject onto the same studio color so edges never show a second bg
    const flat = settings.removeBg
      ? flattenSubjectOntoStudio(image, bounds, studioColor)
      : { canvas: image, width: bounds.width, height: bounds.height, sx: bounds.x, sy: bounds.y }

    const zoom = clamp(settings.zoom, 0.45, 1.55)
    const srcW = flat.width
    const srcH = flat.height
    const srcAspect = srcW / Math.max(1, srcH)

    let drawW
    let drawH
    let dx
    let dy

    if (settings.horizontalFit) {
      /**
       * Fit the ENTIRE certificate into the wide 4:3 card.
       * Tall awards are scaled down so full height is visible — nothing cut off.
       * Empty sides use the same clean studio color (no second mat).
       */
      const pad = srcAspect < 0.7 ? 0.07 : 0.05
      const maxW = outputWidth * (1 - pad * 2)
      // Slightly less than full height so tall plaques sit “in” the horizontal card
      const heightBudget = srcAspect < 0.65 ? 0.9 : 0.94
      const maxH = outputHeight * (1 - pad * 2) * heightBudget
      const fit = Math.min(maxW / srcW, maxH / srcH) * zoom
      drawW = srcW * fit
      drawH = srcH * fit
      dx = (outputWidth - drawW) / 2
      dy = (outputHeight - drawH) / 2
    } else {
      // Fill the card edge-to-edge (may crop top/bottom on very tall photos)
      const cover = Math.max(outputWidth / srcW, outputHeight / srcH) * zoom
      drawW = srcW * cover
      drawH = srcH * cover
      dx = (outputWidth - drawW) / 2
      dy = (outputHeight - drawH) / 2
    }

    ctx.drawImage(flat.canvas, flat.sx, flat.sy, srcW, srcH, dx, dy, drawW, drawH)

    return canvasToFile(canvas, fileName, mimeType, quality)
  } finally {
    fallbackRevoke?.()
  }
}

/**
 * Preview for the studio dialog. Uses a solid mid-res export (still high JPEG quality).
 */
export async function createMagicFramePreviewDataUrl(imageSrc, rawSettings = {}, previewWidth = 1400, onProgress) {
  const previewHeight = Math.round(previewWidth / FRAME_ASPECT)
  const file = await createMagicFrameFile(imageSrc, rawSettings, {
    fileName: 'preview.jpg',
    quality: 0.94,
    outputWidth: previewWidth,
    outputHeight: previewHeight,
    onProgress,
  })

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not build preview.'))
    reader.readAsDataURL(file)
  })
}

/** Clear cached cutouts (e.g. when dialog closes). */
export function clearMagicFrameCutoutCache() {
  for (const entry of cutoutCache.values()) {
    if (entry?.cutoutUrl?.startsWith('blob:')) URL.revokeObjectURL(entry.cutoutUrl)
  }
  cutoutCache.clear()
}

/**
 * Crop any image to the exact certificate card frame (4:3) using percent crop
 * from react-easy-crop. Output matches design frame dimensions.
 */
export async function cropToCertificateFrame(imageSrc, percentCrop, options = {}) {
  const {
    fileName = `certificate-frame-${Date.now()}.jpg`,
    mimeType = 'image/jpeg',
    quality = FRAME_EXPORT_QUALITY,
    outputWidth = FRAME_OUTPUT_WIDTH,
    outputHeight = FRAME_OUTPUT_HEIGHT,
  } = options

  if (!percentCrop || percentCrop.width <= 0 || percentCrop.height <= 0) {
    throw new Error('Crop frame is missing. Adjust the crop, then try again.')
  }

  const resolved = await resolveImageSrc(imageSrc)

  try {
    const image = await loadImage(resolved.src)
    const imageWidth = image.naturalWidth || image.width
    const imageHeight = image.naturalHeight || image.height

    const sx = Math.max(0, (percentCrop.x / 100) * imageWidth)
    const sy = Math.max(0, (percentCrop.y / 100) * imageHeight)
    const sw = Math.max(1, (percentCrop.width / 100) * imageWidth)
    const sh = Math.max(1, (percentCrop.height / 100) * imageHeight)

    const canvas = document.createElement('canvas')
    canvas.width = outputWidth
    canvas.height = outputHeight
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) throw new Error('Could not prepare the crop canvas.')

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, outputWidth, outputHeight)

    return canvasToFile(canvas, fileName, mimeType, quality)
  } finally {
    resolved.revoke?.()
  }
}
