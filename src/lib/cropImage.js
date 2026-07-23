/**
 * Resolve any image source into a same-origin-friendly blob URL when needed.
 * Remote URLs are fetched first so canvas export is not blocked by CORS.
 */
async function resolveImageSrc(src) {
  if (!src) throw new Error('No image to crop.')
  if (src.startsWith('blob:') || src.startsWith('data:')) return { src, revoke: null }

  const response = await fetch(src, { mode: 'cors' })
  if (!response.ok) {
    throw new Error('Could not load the existing image for adjusting. Try replacing it.')
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  return { src: objectUrl, revoke: () => URL.revokeObjectURL(objectUrl) }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error('Could not load image for cropping.')))
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
        else reject(new Error('Could not export the cropped image.'))
      },
      mimeType,
      quality,
    )
  })
}

/**
 * Draw a source rect into an output canvas using object-fit: cover for a target aspect.
 */
function drawCoverCrop(ctx, image, source, outputWidth, outputHeight) {
  const sourceAspect = source.width / source.height
  const outputAspect = outputWidth / outputHeight

  let sx = source.x
  let sy = source.y
  let sw = source.width
  let sh = source.height

  if (sourceAspect > outputAspect) {
    const fittedWidth = sh * outputAspect
    sx += (sw - fittedWidth) / 2
    sw = fittedWidth
  } else if (sourceAspect < outputAspect) {
    const fittedHeight = sw / outputAspect
    sy += (sh - fittedHeight) / 2
    sh = fittedHeight
  }

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, outputWidth, outputHeight)
}

/**
 * Crop from a loaded <img> element using react-image-crop pixel coordinates
 * (relative to the displayed size — scaled to natural pixels for export).
 * Optional aspect locks the exported file to the card ratio (cover-fit).
 */
export async function getCroppedImageFileFromElement(image, pixelCrop, options = {}) {
  const {
    fileName = `cropped-${Date.now()}.jpg`,
    mimeType = 'image/jpeg',
    quality = 0.92,
    aspect,
  } = options

  if (!image || !pixelCrop?.width || !pixelCrop?.height) {
    throw new Error('Could not prepare the cropped image.')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  const source = {
    x: Math.max(0, pixelCrop.x * scaleX),
    y: Math.max(0, pixelCrop.y * scaleY),
    width: Math.max(1, pixelCrop.width * scaleX),
    height: Math.max(1, pixelCrop.height * scaleY),
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not prepare the cropped image.')

  if (aspect && aspect > 0) {
    const baseWidth = Math.max(1, Math.round(source.width))
    canvas.width = baseWidth
    canvas.height = Math.max(1, Math.round(baseWidth / aspect))
    drawCoverCrop(ctx, image, source, canvas.width, canvas.height)
  } else {
    canvas.width = Math.max(1, Math.round(source.width))
    canvas.height = Math.max(1, Math.round(source.height))
    ctx.drawImage(
      image,
      source.x,
      source.y,
      source.width,
      source.height,
      0,
      0,
      canvas.width,
      canvas.height,
    )
  }

  return canvasToFile(canvas, fileName, mimeType, quality)
}

/**
 * Create a cropped File from an image URL and a pixel crop in natural image space.
 */
export async function getCroppedImageFile(imageSrc, pixelCrop, options = {}) {
  const {
    fileName = `cropped-${Date.now()}.jpg`,
    mimeType = 'image/jpeg',
    quality = 0.92,
  } = options

  const resolved = await resolveImageSrc(imageSrc)

  try {
    const image = await loadImage(resolved.src)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Could not prepare the cropped image.')
    }

    const imageWidth = image.naturalWidth || image.width
    const imageHeight = image.naturalHeight || image.height

    const sourceX = Math.max(0, Math.min(imageWidth, pixelCrop.x))
    const sourceY = Math.max(0, Math.min(imageHeight, pixelCrop.y))
    const sourceWidth = Math.max(1, Math.min(imageWidth - sourceX, pixelCrop.width))
    const sourceHeight = Math.max(1, Math.min(imageHeight - sourceY, pixelCrop.height))

    canvas.width = Math.max(1, Math.round(sourceWidth))
    canvas.height = Math.max(1, Math.round(sourceHeight))

    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height)

    return canvasToFile(canvas, fileName, mimeType, quality)
  } finally {
    resolved.revoke?.()
  }
}
