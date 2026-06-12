import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

const BRAND_RGB = [0.102, 0.302, 0.361]
const ACCENT_RGB = [0.941, 0.541, 0.365]
const GLOW_RGB = [0.176, 0.416, 0.478]

const AUTO_ROTATE_SPEED = 0.0014
const DRAG_SENSITIVITY = 0.0028
const MOMENTUM_DECAY = 0.965
const MARKER_LERP = 0.1
const KEY_ROTATE_STEP = 0.05

function lerp(current, target, amount) {
  return current + (target - current) * amount
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getTargetMarkerSize(loc, selectedId, hoveredId) {
  if (loc.id === selectedId) return 0.065
  if (loc.id === hoveredId) return 0.05
  return 0.035
}

function buildAnimatedMarkers(locations, selectedId, hoveredId, sizesRef) {
  return locations.map((loc) => {
    const isActive = loc.id === selectedId
    const isHovered = loc.id === hoveredId
    const targetSize = getTargetMarkerSize(loc, selectedId, hoveredId)
    const currentSize = sizesRef.current[loc.id] ?? targetSize
    const nextSize = lerp(currentSize, targetSize, MARKER_LERP)
    sizesRef.current[loc.id] = nextSize

    return {
      location: [loc.lat, loc.lng],
      size: nextSize,
      id: loc.id,
      color: isActive ? ACCENT_RGB : isHovered ? GLOW_RGB : ACCENT_RGB,
    }
  })
}

export default function EarthGlobe({
  locations,
  selectedId,
  hoveredId,
  onMarkerClick,
  onMarkerHover,
  className = '',
}) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const globeRef = useRef(null)
  const phiRef = useRef(0)
  const thetaRef = useRef(0.22)
  const pointerInteracting = useRef(null)
  const velocityRef = useRef(0)
  const markerSizesRef = useRef({})
  const sizeRef = useRef(600)

  const locationsRef = useRef(locations)
  const selectedIdRef = useRef(selectedId)
  const hoveredIdRef = useRef(hoveredId)

  locationsRef.current = locations
  selectedIdRef.current = selectedId
  hoveredIdRef.current = hoveredId

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      sizeRef.current = Math.min(rect.width, rect.height, 920)
    }

    updateSize()

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
    const size = sizeRef.current

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.35,
      mapSamples: 24000,
      mapBrightness: 10,
      mapBaseBrightness: 0.05,
      baseColor: BRAND_RGB,
      markerColor: ACCENT_RGB,
      glowColor: GLOW_RGB,
      markerElevation: 0.025,
      scale: 1.05,
      offset: [0, 0],
      markers: buildAnimatedMarkers(locationsRef.current, selectedIdRef.current, hoveredIdRef.current, markerSizesRef),
    })

    globeRef.current = globe

    let frameId = 0

    const animate = () => {
      const currentLocations = locationsRef.current
      const currentSelected = selectedIdRef.current
      const currentHovered = hoveredIdRef.current
      const isPaused =
        currentHovered !== null || currentSelected !== null || pointerInteracting.current !== null

      if (!isPaused) {
        if (Math.abs(velocityRef.current) > 0.00005) {
          phiRef.current += velocityRef.current
          velocityRef.current *= MOMENTUM_DECAY
        } else {
          velocityRef.current = 0
          phiRef.current += AUTO_ROTATE_SPEED
        }
      } else {
        velocityRef.current = 0
      }

      thetaRef.current = clamp(thetaRef.current, -0.55, 0.55)

      globe.update({
        phi: phiRef.current,
        theta: thetaRef.current,
        markers: buildAnimatedMarkers(currentLocations, currentSelected, currentHovered, markerSizesRef),
        arcs: [],
      })

      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)

    const resizeObserver = new ResizeObserver(() => {
      updateSize()
      const nextSize = sizeRef.current
      globe.update({
        width: nextSize * dpr,
        height: nextSize * dpr,
      })
    })
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      globe.destroy()
      globeRef.current = null
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

      const tag = event.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const section = wrapRef.current?.closest('#global-presence')
      if (!section) return

      const rect = section.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return

      event.preventDefault()
      const direction = event.key === 'ArrowRight' ? 1 : -1
      phiRef.current += KEY_ROTATE_STEP * direction
      velocityRef.current = KEY_ROTATE_STEP * direction * 0.6
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handlePointerDown = (event) => {
    pointerInteracting.current = event.clientX
    velocityRef.current = 0
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerUp = (event) => {
    pointerInteracting.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (pointerInteracting.current !== null) {
      const delta = event.clientX - pointerInteracting.current
      pointerInteracting.current = event.clientX
      const rotation = delta * DRAG_SENSITIVITY
      phiRef.current += rotation
      velocityRef.current = rotation * 0.85
    }
  }

  return (
    <div ref={wrapRef} className={`globe-stage relative ${className}`}>
      <div className="globe-glow pointer-events-none absolute inset-0 rounded-full" aria-hidden="true" />

      <div
        className="globe-canvas-wrap relative mx-auto aspect-square w-full max-w-[min(92vw,920px)] touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerMove={handlePointerMove}
      >
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />

        {locations.map((loc) => (
          <button
            key={loc.id}
            type="button"
            className="globe-marker-btn"
            style={{
              positionAnchor: `--cobe-${loc.id}`,
              opacity: `var(--cobe-visible-${loc.id}, 0)`,
              transform: `translate(-50%, -50%) scale(calc(0.65 + var(--cobe-visible-${loc.id}, 0) * 0.35))`,
              zIndex: selectedId === loc.id || hoveredId === loc.id ? 20 : 10,
            }}
            aria-label={`${loc.country}, ${loc.city} — ${loc.eventCount} events`}
            aria-pressed={selectedId === loc.id}
            onClick={() => onMarkerClick(loc.id)}
            onMouseEnter={() => onMarkerHover(loc.id)}
            onMouseLeave={() => onMarkerHover(null)}
            onFocus={() => onMarkerHover(loc.id)}
            onBlur={() => onMarkerHover(null)}
          >
            <span
              className={`globe-marker-dot ${selectedId === loc.id ? 'is-active' : ''} ${hoveredId === loc.id ? 'is-hovered' : ''}`}
            />
            <span className="globe-marker-label">{loc.country}</span>
          </button>
        ))}
      </div>

      <p className="pointer-events-none mt-4 text-center text-[0.65rem] font-medium tracking-[0.2em] text-white/40 uppercase">
        Drag or use arrow keys to spin · Hover or tap a marker for events
      </p>
    </div>
  )
}
