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

/** Services page detail cards */
export const SERVICE_PAGE_ASPECT = 5 / 4
/** Homepage service preview cards — square fills the small side image cleanly */
export const SERVICE_HOME_ASPECT = 1

/**
 * Derive output pixel size for any card aspect (width × height).
 */
export function frameSizeForAspect(aspect = FRAME_ASPECT, width = FRAME_OUTPUT_WIDTH) {
  const safeAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : FRAME_ASPECT
  const safeWidth = Number.isFinite(width) && width > 0 ? Math.round(width) : FRAME_OUTPUT_WIDTH
  return {
    width: safeWidth,
    height: Math.max(1, Math.round(safeWidth / safeAspect)),
  }
}

export const STUDIO_BACKGROUNDS = {
  auto: {
    id: 'auto',
    label: 'Keep photo',
    hint: 'Match the photo’s own background exactly',
  },
  black: {
    id: 'black',
    label: 'Black',
    hint: 'Dark clean background',
    color: { r: 18, g: 18, b: 20 },
  },
  white: {
    id: 'white',
    label: 'White',
    hint: 'Bright clean background',
    color: { r: 248, g: 248, b: 250 },
  },
}

/** Selectable Improve photo modes (applied before framing). */
export const IMPROVE_PRESETS = {
  center: {
    id: 'center',
    label: 'Center only',
    hint: 'Frame & center — exact original colors',
    light: 0,
    clarity: 0,
    vivid: 0,
  },
  light: {
    id: 'light',
    label: 'Fix light',
    hint: 'Gentle exposure — keeps natural color',
    light: 1,
    clarity: 0,
    vivid: 0,
  },
  clarity: {
    id: 'clarity',
    label: 'Clear details',
    hint: 'Sharper seals & text — no color shift',
    light: 0,
    clarity: 1,
    vivid: 0,
  },
  balanced: {
    id: 'balanced',
    label: 'Balanced',
    hint: 'Light + clarity — recommended',
    light: 1,
    clarity: 1,
    vivid: 0,
  },
  vivid: {
    id: 'vivid',
    label: 'Vivid',
    hint: 'Richer color for dull phone photos',
    light: 1,
    clarity: 0.7,
    vivid: 1,
  },
}

export const IMPROVE_STRENGTHS = {
  subtle: { id: 'subtle', label: 'Subtle', factor: 0.55 },
  normal: { id: 'normal', label: 'Normal', factor: 1 },
  strong: { id: 'strong', label: 'Strong', factor: 1.45 },
}

export const DEFAULT_FRAME_SETTINGS = {
  mode: 'remaster',
  removeBg: false,
  horizontalFit: false,
  improved: false,
  zoom: 1,
  studio: 'auto',
  improvePreset: 'balanced',
  improveStrength: 'normal',
  region: null,
  frameCrop: null,
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

  const frameCrop = normalizePercentCrop(frame.frameCrop)

  return {
    mode: 'remaster',
    removeBg: frame.removeBg === true,
    horizontalFit: frame.horizontalFit === true || frame.improved === true,
    improved: frame.improved === true || frame.horizontalFit === true,
    zoom: Number.isFinite(zoom) ? zoom : DEFAULT_FRAME_SETTINGS.zoom,
    studio,
    improvePreset: normalizeImprovePreset(frame.improvePreset),
    improveStrength: normalizeImproveStrength(frame.improveStrength),
    region: normalizeRegion(frame.region),
    frameCrop,
  }
}

function normalizeImprovePreset(value) {
  if (value && IMPROVE_PRESETS[value]) return value
  return DEFAULT_FRAME_SETTINGS.improvePreset
}

function normalizeImproveStrength(value) {
  if (value && IMPROVE_STRENGTHS[value]) return value
  return DEFAULT_FRAME_SETTINGS.improveStrength
}

function normalizePercentCrop(crop) {
  if (!crop || typeof crop !== 'object') return null
  const x = Number(crop.x)
  const y = Number(crop.y)
  const width = Number(crop.width)
  const height = Number(crop.height)
  if (![x, y, width, height].every((value) => Number.isFinite(value))) return null
  if (width <= 0 || height <= 0) return null
  return {
    x: clamp(x, 0, 100),
    y: clamp(y, 0, 100),
    width: clamp(width, 0.5, 100),
    height: clamp(height, 0.5, 100),
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
        else reject(new Error('Could not save the certificate photo.'))
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
 * Uses median + outlier rejection so seals/coins don’t tint the fill.
 */
export function detectBackgroundColor(image) {
  const naturalW = image.naturalWidth || image.width
  const naturalH = image.naturalHeight || image.height
  if (!naturalW || !naturalH) return { r: 40, g: 40, b: 42 }

  const scale = Math.min(1, 420 / Math.max(naturalW, naturalH))
  const w = Math.max(1, Math.round(naturalW * scale))
  const h = Math.max(1, Math.round(naturalH * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return { r: 40, g: 40, b: 42 }

  ctx.drawImage(image, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)

  const patch = Math.max(2, Math.round(Math.min(w, h) * 0.05))
  const ring = Math.max(patch, Math.round(Math.min(w, h) * 0.12))
  const samples = []

  // Dense edge ring — true backdrop lives here on award photos
  for (let y = 0; y < h; y += Math.max(1, Math.floor(h / 48))) {
    for (let x = 0; x < w; x += Math.max(1, Math.floor(w / 48))) {
      const onEdge = x < ring || x >= w - ring || y < ring || y >= h - ring
      if (!onEdge) continue
      const i = (y * w + x) * 4
      if (data[i + 3] < 20) continue
      samples.push({ r: data[i], g: data[i + 1], b: data[i + 2] })
    }
  }

  // Corner / edge patches as anchors
  const patches = [
    averagePatch(data, w, h, 0, 0, patch, patch),
    averagePatch(data, w, h, w - patch, 0, patch, patch),
    averagePatch(data, w, h, 0, h - patch, patch, patch),
    averagePatch(data, w, h, w - patch, h - patch, patch, patch),
    averagePatch(data, w, h, Math.floor(w / 2 - patch / 2), 0, patch, patch),
    averagePatch(data, w, h, Math.floor(w / 2 - patch / 2), h - patch, patch, patch),
    averagePatch(data, w, h, 0, Math.floor(h / 2 - patch / 2), patch, patch),
    averagePatch(data, w, h, w - patch, Math.floor(h / 2 - patch / 2), patch, patch),
  ].filter(Boolean)
  for (const p of patches) samples.push(p)

  return dominantBackgroundFromSamples(samples)
}

/**
 * Background color from pixels outside the detected certificate/content bounds.
 * Best match for “Keep photo” studio fill.
 */
function detectBackgroundAroundContent(canvas, bounds) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return detectBackgroundColor(canvas)

  const { width, height } = canvas
  const sampleW = Math.min(420, width)
  const sampleH = Math.max(1, Math.round((height / width) * sampleW))
  const sample = document.createElement('canvas')
  sample.width = sampleW
  sample.height = sampleH
  const sctx = sample.getContext('2d', { willReadFrequently: true })
  if (!sctx) return detectBackgroundColor(canvas)

  sctx.drawImage(canvas, 0, 0, sampleW, sampleH)
  const { data } = sctx.getImageData(0, 0, sampleW, sampleH)

  const sx = sampleW / width
  const sy = sampleH / height
  // Expand exclusion so subject fringe / shadows don’t tint the bg
  const pad = Math.round(Math.min(sampleW, sampleH) * 0.03)
  const ex0 = Math.max(0, Math.floor(bounds.x * sx) - pad)
  const ey0 = Math.max(0, Math.floor(bounds.y * sy) - pad)
  const ex1 = Math.min(sampleW, Math.ceil((bounds.x + bounds.width) * sx) + pad)
  const ey1 = Math.min(sampleH, Math.ceil((bounds.y + bounds.height) * sy) + pad)

  const samples = []
  const step = Math.max(1, Math.floor(Math.min(sampleW, sampleH) / 90))
  for (let y = 0; y < sampleH; y += step) {
    for (let x = 0; x < sampleW; x += step) {
      if (x >= ex0 && x < ex1 && y >= ey0 && y < ey1) continue
      const i = (y * sampleW + x) * 4
      if (data[i + 3] < 20) continue
      samples.push({ r: data[i], g: data[i + 1], b: data[i + 2] })
    }
  }

  if (samples.length < 24) return detectBackgroundColor(canvas)
  return dominantBackgroundFromSamples(samples)
}

function medianOf(values) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

/**
 * Pick the true backdrop color: median, then reject chroma outliers (seals, logos).
 */
function dominantBackgroundFromSamples(samples) {
  if (!samples?.length) return { r: 40, g: 40, b: 42 }

  let mr = medianOf(samples.map((s) => s.r))
  let mg = medianOf(samples.map((s) => s.g))
  let mb = medianOf(samples.map((s) => s.b))

  // Keep samples close to the median — drops coin blues/greens/golds
  const filtered = samples.filter((s) => {
    const dr = s.r - mr
    const dg = s.g - mg
    const db = s.b - mb
    return Math.sqrt(dr * dr + dg * dg + db * db) <= 36
  })

  const use = filtered.length >= Math.max(12, samples.length * 0.25) ? filtered : samples
  mr = medianOf(use.map((s) => s.r))
  mg = medianOf(use.map((s) => s.g))
  mb = medianOf(use.map((s) => s.b))

  return {
    r: clamp(Math.round(mr), 0, 255),
    g: clamp(Math.round(mg), 0, 255),
    b: clamp(Math.round(mb), 0, 255),
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
 * Uses a hard alpha cut to avoid soft-matte ghosting / double-text blur.
 */
function flattenSubjectOntoStudio(image, bounds, studioColor) {
  const width = Math.max(1, Math.round(bounds.width))
  const height = Math.max(1, Math.round(bounds.height))

  const srcCanvas = document.createElement('canvas')
  srcCanvas.width = width
  srcCanvas.height = height
  const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true })
  if (!srcCtx) return { canvas: image, width: bounds.width, height: bounds.height, sx: bounds.x, sy: bounds.y }

  srcCtx.imageSmoothingEnabled = false
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
    const a = src.data[i + 3] / 255
    // Hard cut — soft fringes from AI mattes cause halos and smeared text
    if (a < 0.42) {
      out.data[i] = sr
      out.data[i + 1] = sg
      out.data[i + 2] = sb
      out.data[i + 3] = 255
      continue
    }

    let r = src.data[i]
    let g = src.data[i + 1]
    let b = src.data[i + 2]

    // Despill light fringe colors toward studio so edges stay crisp
    if (a < 0.85) {
      const t = (a - 0.42) / (0.85 - 0.42)
      r = Math.round(r * t + sr * (1 - t))
      g = Math.round(g * t + sg * (1 - t))
      b = Math.round(b * t + sb * (1 - t))
    }

    out.data[i] = r
    out.data[i + 1] = g
    out.data[i + 2] = b
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
    cleanStudio = false,
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

    // Load original once — match bg color (+ optional grain so fill doesn’t look flat)
    let detectedBg = null
    let grainProfile = cleanStudio ? { strength: 0 } : { strength: 5.5 }
    onProgress?.('Matching photo background…')
    const originalResolved = await resolveImageSrc(imageSrc)
    try {
      const originalImage = await loadImage(originalResolved.src)
      if (!cleanStudio) {
        grainProfile = measureBackgroundGrain(originalImage)
      }
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

    // Full-bleed studio fill (no grain on Improve — grain softens fine text)
    if (cleanStudio || grainProfile.strength <= 0) {
      ctx.fillStyle = `rgb(${Math.round(studioColor.r)}, ${Math.round(studioColor.g)}, ${Math.round(studioColor.b)})`
      ctx.fillRect(0, 0, outputWidth, outputHeight)
    } else {
      fillSolidStudio(ctx, outputWidth, outputHeight, studioColor, grainProfile)
    }

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

    // Prefer crisp pixels when we are not heavily downscaling
    const scale = Math.min(drawW / srcW, drawH / srcH)
    ctx.imageSmoothingEnabled = scale < 0.98
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(flat.canvas, flat.sx, flat.sy, srcW, srcH, dx, dy, drawW, drawH)

    return canvasToFile(canvas, fileName, mimeType, quality)
  } finally {
    fallbackRevoke?.()
  }
}

/**
 * Draw image onto a working canvas at its native size (capped for memory).
 */
function imageToWorkingCanvas(image, maxEdge = 3200) {
  const srcW = image.naturalWidth || image.width
  const srcH = image.naturalHeight || image.height
  const scale = Math.min(1, maxEdge / Math.max(srcW, srcH))
  const width = Math.max(1, Math.round(srcW * scale))
  const height = Math.max(1, Math.round(srcH * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true, alpha: false })
  if (!ctx) throw new Error('Could not prepare the photo canvas.')

  ctx.imageSmoothingEnabled = scale < 0.999
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(image, 0, 0, width, height)
  return canvas
}

function resolveImproveProfile(presetId, strengthId) {
  const preset = IMPROVE_PRESETS[presetId] || IMPROVE_PRESETS.balanced
  const strength = IMPROVE_STRENGTHS[strengthId] || IMPROVE_STRENGTHS.normal
  const f = strength.factor
  return {
    preset,
    strength,
    lightMix: clamp(preset.light * 0.42 * f, 0, 0.78),
    clarityAmount: clamp(preset.clarity * 0.16 * f, 0, 0.38),
    vividAmount: clamp(preset.vivid * 0.12 * f, 0, 0.28),
  }
}

/**
 * Soft exposure fix — blends toward auto-levels so colors stay natural.
 */
function applySoftLightFix(canvas, mix) {
  if (mix <= 0.001) return
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  const { width, height } = canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  const samples = []
  for (let i = 0; i < data.length; i += 48) {
    samples.push(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2])
  }
  samples.sort((a, b) => a - b)
  const lo = samples[Math.floor(samples.length * 0.03)] ?? 0
  const hi = samples[Math.floor(samples.length * 0.97)] ?? 255
  const range = Math.max(28, hi - lo)

  for (let i = 0; i < data.length; i += 4) {
    const r0 = data[i]
    const g0 = data[i + 1]
    const b0 = data[i + 2]
    const r1 = ((r0 - lo) / range) * 255
    const g1 = ((g0 - lo) / range) * 255
    const b1 = ((b0 - lo) / range) * 255
    data[i] = clamp(Math.round(r0 * (1 - mix) + r1 * mix), 0, 255)
    data[i + 1] = clamp(Math.round(g0 * (1 - mix) + g1 * mix), 0, 255)
    data[i + 2] = clamp(Math.round(b0 * (1 - mix) + b1 * mix), 0, 255)
  }

  ctx.putImageData(imageData, 0, 0)
}

/**
 * Edge clarity for seals/text — luminance push only (no color fry).
 */
function applyDetailClarity(canvas, amount) {
  if (amount <= 0.001) return
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  const { width, height } = canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const copy = new Uint8ClampedArray(data)
  const threshold = 14

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = (y * width + x) * 4
      const lum = 0.2126 * copy[i] + 0.7152 * copy[i + 1] + 0.0722 * copy[i + 2]
      const surround =
        (0.2126 * copy[i - 4] +
          0.7152 * copy[i - 3] +
          0.0722 * copy[i - 2] +
          (0.2126 * copy[i + 4] + 0.7152 * copy[i + 5] + 0.0722 * copy[i + 6]) +
          (0.2126 * copy[i - width * 4] +
            0.7152 * copy[i - width * 4 + 1] +
            0.0722 * copy[i - width * 4 + 2]) +
          (0.2126 * copy[i + width * 4] +
            0.7152 * copy[i + width * 4 + 1] +
            0.0722 * copy[i + width * 4 + 2])) /
        4
      const delta = lum - surround
      if (Math.abs(delta) < threshold) continue
      const adj = delta * amount
      data[i] = clamp(Math.round(copy[i] + adj), 0, 255)
      data[i + 1] = clamp(Math.round(copy[i + 1] + adj), 0, 255)
      data[i + 2] = clamp(Math.round(copy[i + 2] + adj), 0, 255)
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

/**
 * Mild midtone saturation for dull phone photos — leaves near-grays alone.
 */
function applySoftVivid(canvas, amount) {
  if (amount <= 0.001) return
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  const { width, height } = canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const chroma = max - min
    if (chroma < 10) continue
    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
    // Soft midtone gate — avoid blowing highlights / crushing shadows
    const mid = 1 - Math.abs(gray - 128) / 128
    const sat = 1 + amount * mid
    data[i] = clamp(Math.round(gray + (r - gray) * sat), 0, 255)
    data[i + 1] = clamp(Math.round(gray + (g - gray) * sat), 0, 255)
    data[i + 2] = clamp(Math.round(gray + (b - gray) * sat), 0, 255)
  }

  ctx.putImageData(imageData, 0, 0)
}

function applyImproveEnhancements(canvas, profile, onProgress) {
  if (profile.lightMix > 0) {
    onProgress?.('Fixing light…')
    applySoftLightFix(canvas, profile.lightMix)
  }
  if (profile.vividAmount > 0) {
    onProgress?.('Refreshing color…')
    applySoftVivid(canvas, profile.vividAmount)
  }
  if (profile.clarityAmount > 0) {
    onProgress?.('Clearing details…')
    applyDetailClarity(canvas, profile.clarityAmount)
  }
}

/**
 * Find the award content bounds by scanning for pixels that differ from edge background.
 */
function detectContentBounds(canvas) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    return { x: 0, y: 0, width: canvas.width, height: canvas.height }
  }

  const { width, height } = canvas
  const sampleW = Math.min(480, width)
  const sampleH = Math.max(1, Math.round((height / width) * sampleW))
  const sample = document.createElement('canvas')
  sample.width = sampleW
  sample.height = sampleH
  const sctx = sample.getContext('2d', { willReadFrequently: true })
  if (!sctx) return { x: 0, y: 0, width, height }

  sctx.drawImage(canvas, 0, 0, sampleW, sampleH)
  const { data } = sctx.getImageData(0, 0, sampleW, sampleH)

  // Estimate background from border ring
  let br = 0
  let bg = 0
  let bb = 0
  let bn = 0
  const border = Math.max(2, Math.round(Math.min(sampleW, sampleH) * 0.04))
  for (let y = 0; y < sampleH; y += 1) {
    for (let x = 0; x < sampleW; x += 1) {
      if (x >= border && x < sampleW - border && y >= border && y < sampleH - border) continue
      const i = (y * sampleW + x) * 4
      br += data[i]
      bg += data[i + 1]
      bb += data[i + 2]
      bn += 1
    }
  }
  if (!bn) return { x: 0, y: 0, width, height }
  br /= bn
  bg /= bn
  bb /= bn

  const threshold = 28
  let minX = sampleW
  let minY = sampleH
  let maxX = 0
  let maxY = 0
  let hits = 0

  for (let y = 0; y < sampleH; y += 1) {
    for (let x = 0; x < sampleW; x += 1) {
      const i = (y * sampleW + x) * 4
      const dr = data[i] - br
      const dg = data[i + 1] - bg
      const db = data[i + 2] - bb
      const dist = Math.sqrt(dr * dr + dg * dg + db * db)
      if (dist < threshold) continue
      hits += 1
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }

  if (hits < 40) return { x: 0, y: 0, width, height }

  const pad = Math.round(Math.min(sampleW, sampleH) * 0.015)
  minX = Math.max(0, minX - pad)
  minY = Math.max(0, minY - pad)
  maxX = Math.min(sampleW - 1, maxX + pad)
  maxY = Math.min(sampleH - 1, maxY + pad)

  const scaleX = width / sampleW
  const scaleY = height / sampleH
  const x = Math.floor(minX * scaleX)
  const y = Math.floor(minY * scaleY)
  const w = Math.ceil((maxX - minX + 1) * scaleX)
  const h = Math.ceil((maxY - minY + 1) * scaleY)

  return {
    x: clamp(x, 0, width - 1),
    y: clamp(y, 0, height - 1),
    width: clamp(w, 1, width - x),
    height: clamp(h, 1, height - y),
  }
}

/**
 * Keep photo: match the photo’s own background, center the subject,
 * and fill any card padding with that exact backdrop so it fits seamlessly.
 */
function composeCenteredKeepPhoto(sourceCanvas, bounds, outputWidth, outputHeight) {
  const srcW = sourceCanvas.width
  const srcH = sourceCanvas.height
  const matchedBg = detectBackgroundAroundContent(sourceCanvas, bounds)

  const canvas = document.createElement('canvas')
  canvas.width = outputWidth
  canvas.height = outputHeight
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) throw new Error('Could not prepare the card canvas.')

  ctx.fillStyle = `rgb(${matchedBg.r}, ${matchedBg.g}, ${matchedBg.b})`
  ctx.fillRect(0, 0, outputWidth, outputHeight)

  // Scale so the certificate fills the card; draw the full photo so its
  // real background blends into the matched fill (no hard color seam).
  const pad = 0.035
  const maxW = outputWidth * (1 - pad * 2)
  const maxH = outputHeight * (1 - pad * 2)
  const fit = Math.min(maxW / Math.max(1, bounds.width), maxH / Math.max(1, bounds.height))

  const drawW = srcW * fit
  const drawH = srcH * fit
  const contentCx = bounds.x + bounds.width / 2
  const contentCy = bounds.y + bounds.height / 2
  const dx = outputWidth / 2 - contentCx * fit
  const dy = outputHeight / 2 - contentCy * fit

  ctx.imageSmoothingEnabled = fit < 0.98
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(sourceCanvas, 0, 0, srcW, srcH, dx, dy, drawW, drawH)

  return canvas
}

/**
 * Cover-fill for small service cards: zoom on the subject and fill the frame
 * edge-to-edge (no pillarbox / letterbox bars). Biases slightly upward for faces.
 */
function composeCoverFillCard(sourceCanvas, bounds, outputWidth, outputHeight) {
  const srcW = sourceCanvas.width
  const srcH = sourceCanvas.height
  const targetAspect = outputWidth / Math.max(1, outputHeight)

  const cx = bounds.x + bounds.width / 2
  // Prefer upper subject area so heads stay in frame on small cards
  const cy = bounds.y + bounds.height * 0.38

  const subjectPad = 0.05
  let needW = Math.max(1, bounds.width * (1 + subjectPad * 2))
  let needH = Math.max(1, bounds.height * (1 + subjectPad * 2))

  if (needW / needH > targetAspect) {
    needH = needW / targetAspect
  } else {
    needW = needH * targetAspect
  }

  // If the subject window is larger than the photo, shrink to max cover of source
  const fitScale = Math.min(srcW / needW, srcH / needH)
  if (fitScale < 1) {
    needW *= fitScale
    needH *= fitScale
  }

  // Small-card punch-in: if subject is tiny in a large photo, don't stay zoomed out
  const minFill = Math.min(srcW, srcH) * 0.42
  if (Math.min(needW, needH) < minFill && fitScale >= 1) {
    const boost = minFill / Math.min(needW, needH)
    const boostedW = needW * boost
    const boostedH = needH * boost
    if (boostedW <= srcW && boostedH <= srcH) {
      needW = boostedW
      needH = boostedH
    }
  }

  let cropX = cx - needW / 2
  let cropY = cy - needH / 2
  cropX = clamp(cropX, 0, Math.max(0, srcW - needW))
  cropY = clamp(cropY, 0, Math.max(0, srcH - needH))

  const canvas = document.createElement('canvas')
  canvas.width = outputWidth
  canvas.height = outputHeight
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) throw new Error('Could not prepare the card canvas.')

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(sourceCanvas, cropX, cropY, needW, needH, 0, 0, outputWidth, outputHeight)
  return canvas
}

/**
 * Place the subject into a studio card (white/black) — contain / letterbox.
 */
function composeLetterboxedCard(sourceCanvas, bounds, studioColor, outputWidth, outputHeight) {
  const canvas = document.createElement('canvas')
  canvas.width = outputWidth
  canvas.height = outputHeight
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) throw new Error('Could not prepare the card canvas.')

  ctx.fillStyle = `rgb(${Math.round(studioColor.r)}, ${Math.round(studioColor.g)}, ${Math.round(studioColor.b)})`
  ctx.fillRect(0, 0, outputWidth, outputHeight)

  const srcW = Math.max(1, bounds.width)
  const srcH = Math.max(1, bounds.height)
  const pad = 0.03
  const maxW = outputWidth * (1 - pad * 2)
  const maxH = outputHeight * (1 - pad * 2)
  const fit = Math.min(maxW / srcW, maxH / srcH)
  const drawW = srcW * fit
  const drawH = srcH * fit
  const dx = (outputWidth - drawW) / 2
  const dy = (outputHeight - drawH) / 2

  ctx.imageSmoothingEnabled = fit < 0.98
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(sourceCanvas, bounds.x, bounds.y, srcW, srcH, dx, dy, drawW, drawH)

  return canvas
}

/**
 * One-click Improve for the editor:
 * optional light/clarity/vivid, then center the subject in the card.
 */
export async function improveCertificatePhoto(imageSrc, options = {}) {
  const {
    studio = 'auto',
    clearBackground = false,
    improvePreset = DEFAULT_FRAME_SETTINGS.improvePreset,
    improveStrength = DEFAULT_FRAME_SETTINGS.improveStrength,
    aspect = FRAME_ASPECT,
    /** 'cover' = fill card edge-to-edge (services); 'contain' = keep full subject (certificates) */
    fillMode = 'contain',
    onProgress,
    fileName = `certificate-improved-${Date.now()}.jpg`,
    quality = 0.98,
  } = options

  const size = frameSizeForAspect(aspect, options.outputWidth || FRAME_OUTPUT_WIDTH)
  const outputWidth = options.outputWidth || size.width
  const outputHeight = options.outputHeight || size.height

  const studioId = studio === 'white' || studio === 'black' || studio === 'auto' ? studio : 'auto'
  const profile = resolveImproveProfile(improvePreset, improveStrength)
  const useCover = fillMode === 'cover'

  // Opt-in cutout path (can still soft-edge some plaques — off by default)
  if (clearBackground) {
    onProgress?.('Clearing background…')
    return createMagicFrameFile(
      imageSrc,
      {
        removeBg: true,
        horizontalFit: true,
        zoom: 1,
        studio: studioId,
      },
      {
        fileName,
        onProgress,
        cleanStudio: true,
        quality,
        outputWidth,
        outputHeight,
      },
    )
  }

  onProgress?.('Loading photo…')
  const resolved = await resolveImageSrc(imageSrc)
  try {
    const image = await loadImage(resolved.src)
    const working = imageToWorkingCanvas(image)

    applyImproveEnhancements(working, profile, onProgress)

    onProgress?.(useCover ? 'Filling card frame…' : 'Matching photo background…')
    const bounds = detectContentBounds(working)

    let card
    if (useCover) {
      card = composeCoverFillCard(working, bounds, outputWidth, outputHeight)
    } else if (studioId === 'auto') {
      card = composeCenteredKeepPhoto(working, bounds, outputWidth, outputHeight)
    } else {
      const studioColor = resolveStudioColor(studioId, sampleSubjectTone(working, bounds), null)
      card = composeLetterboxedCard(working, bounds, studioColor, outputWidth, outputHeight)
    }

    return canvasToFile(card, fileName, 'image/jpeg', quality)
  } finally {
    resolved.revoke?.()
  }
}

/**
 * Preview for the studio dialog. Uses a solid mid-res export (still high JPEG quality).
 */
export async function createMagicFramePreviewDataUrl(
  imageSrc,
  rawSettings = {},
  previewWidth = 1400,
  onProgress,
  aspect = FRAME_ASPECT,
) {
  const size = frameSizeForAspect(aspect, previewWidth)
  const file = await createMagicFrameFile(imageSrc, rawSettings, {
    fileName: 'preview.jpg',
    quality: 0.94,
    outputWidth: size.width,
    outputHeight: size.height,
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
 * Crop any image to the exact card frame using percent crop from react-easy-crop.
 * Output matches the requested aspect / design frame dimensions.
 */
export async function cropToCertificateFrame(imageSrc, percentCrop, options = {}) {
  const {
    fileName = `certificate-frame-${Date.now()}.jpg`,
    mimeType = 'image/jpeg',
    quality = FRAME_EXPORT_QUALITY,
    aspect = FRAME_ASPECT,
  } = options

  const size = frameSizeForAspect(aspect, options.outputWidth || FRAME_OUTPUT_WIDTH)
  const outputWidth = options.outputWidth || size.width
  const outputHeight = options.outputHeight || size.height

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
