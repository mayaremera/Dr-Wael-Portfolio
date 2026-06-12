import globeMapDataUrl from './globeMapDataUrl.js'

let cachedPoints = null
let loadingPromise = null

function sampleLandPoints(image) {
  const offscreen = document.createElement('canvas')
  offscreen.width = image.width
  offscreen.height = image.height
  const ctx = offscreen.getContext('2d')
  if (!ctx) return []

  ctx.drawImage(image, 0, 0)
  const { data, width, height } = ctx.getImageData(0, 0, offscreen.width, offscreen.height)
  const points = []
  const step = 2

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const index = (y * width + x) * 4
      const brightness = data[index] / 255
      if (brightness < 0.12) continue

      const lng = (x / width) * 360 - 180
      const lat = 90 - (y / height) * 180
      points.push([lat, lng])
    }
  }

  return points
}

export function loadGlobeLandPoints() {
  if (cachedPoints) return Promise.resolve(cachedPoints)
  if (loadingPromise) return loadingPromise

  loadingPromise = new Promise((resolve) => {
    const image = new Image()
    image.onload = () => {
      cachedPoints = sampleLandPoints(image)
      resolve(cachedPoints)
    }
    image.onerror = () => {
      cachedPoints = []
      resolve(cachedPoints)
    }
    image.src = globeMapDataUrl
  })

  return loadingPromise
}
