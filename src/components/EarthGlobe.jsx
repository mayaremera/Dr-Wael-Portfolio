import { useEffect, useRef } from 'react'
import { loadGlobeLandPoints } from '../lib/globeLandPoints.js'
import {
  pickNearestMarker,
  project,
  separateMarkerPositions,
} from '../lib/globeProjection.js'

const AUTO_ROTATE_SPEED = 0.0014
const DRAG_SENSITIVITY = 0.0028
const MOMENTUM_DECAY = 0.965
const KEY_ROTATE_STEP = 0.05
const GLOBE_PX = 1020
const GLOBE_MAX_PX = 1150
const HOVER_RADIUS = 62
const DRAG_THRESHOLD = 6

const BRAND_SOFT = 'rgba(45, 106, 122, 0.55)'
const LAND = 'rgba(72, 140, 155, 0.92)'
const LAND_DIM = 'rgba(45, 106, 122, 0.45)'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function drawGlobe(ctx, size, landPoints, phi, theta) {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.38 * 1.05

  ctx.clearRect(0, 0, size, size)

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.clip()

  const sphere = ctx.createRadialGradient(
    cx - radius * 0.32,
    cy - radius * 0.38,
    radius * 0.06,
    cx + radius * 0.12,
    cy + radius * 0.18,
    radius * 1.05,
  )
  sphere.addColorStop(0, 'rgba(88, 158, 172, 0.32)')
  sphere.addColorStop(0.42, BRAND_SOFT)
  sphere.addColorStop(0.78, 'rgba(22, 48, 58, 0.72)')
  sphere.addColorStop(1, 'rgba(8, 16, 24, 0.88)')
  ctx.fillStyle = sphere
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)

  const projectedLand = landPoints
    .map(([lat, lng]) => {
      const point = project(lat, lng, phi, theta, size)
      return { ...point, lat, lng }
    })
    .filter((point) => point.visible)
    .sort((a, b) => a.depth - b.depth)

  for (const point of projectedLand) {
    const alpha = 0.35 + point.depth * 0.65
    ctx.fillStyle = point.depth > 0.35 ? LAND : LAND_DIM
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.arc(point.x, point.y, 1.15 + point.depth * 0.8, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalAlpha = 1
  ctx.restore()

  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(72, 140, 155, 0.14)'
  ctx.lineWidth = 1
  ctx.stroke()
}

export default function EarthGlobe({
  locations,
  selectedId,
  hoveredId,
  onMarkerClick,
  onMarkerHover,
  onActiveAnchorChange,
  className = '',
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const wrapRef = useRef(null)
  const markerRefs = useRef({})
  const markerPositionsRef = useRef([])
  const phiRef = useRef(0)
  const thetaRef = useRef(0.22)
  const pointerInteracting = useRef(null)
  const pointerDownRef = useRef(null)
  const velocityRef = useRef(0)
  const sizeRef = useRef(GLOBE_PX)
  const landPointsRef = useRef([])

  const locationsRef = useRef(locations)
  const selectedIdRef = useRef(selectedId)
  const hoveredIdRef = useRef(hoveredId)
  const onMarkerHoverRef = useRef(onMarkerHover)
  const onMarkerClickRef = useRef(onMarkerClick)
  const onActiveAnchorChangeRef = useRef(onActiveAnchorChange)

  locationsRef.current = locations
  selectedIdRef.current = selectedId
  hoveredIdRef.current = hoveredId
  onMarkerHoverRef.current = onMarkerHover
  onMarkerClickRef.current = onMarkerClick
  onActiveAnchorChangeRef.current = onActiveAnchorChange

  useEffect(() => {
    let cancelled = false
    loadGlobeLandPoints().then((points) => {
      if (!cancelled) landPointsRef.current = points
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
    let frameId = 0
    let destroyed = false
    let tabHidden = document.hidden

    const readSize = () => {
      const rect = container.getBoundingClientRect()
      const measured = Math.floor(Math.min(rect.width, rect.height))
      return measured > 100 ? Math.min(measured, GLOBE_MAX_PX) : GLOBE_PX
    }

    const resizeCanvas = (size) => {
      sizeRef.current = size
      container.style.width = `${size}px`
      container.style.height = `${size}px`
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const getMarkerClientAnchor = (id) => {
      const layout = markerPositionsRef.current.find((item) => item.id === id)
      if (!layout || !containerRef.current) return null

      const rect = containerRef.current.getBoundingClientRect()
      return {
        x: rect.left + (layout.displayX ?? layout.x),
        y: rect.top + (layout.displayY ?? layout.y),
      }
    }

    const setHover = (id) => {
      if (selectedIdRef.current !== null) return
      if (hoveredIdRef.current === id) return
      hoveredIdRef.current = id
      onMarkerHoverRef.current(id)
    }

    const localPointer = (event) => {
      const rect = container.getBoundingClientRect()
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }

    const updateMarkers = (phi, theta, size) => {
      const raw = locationsRef.current.flatMap((loc) => {
        const lat = Number(loc.lat)
        const lng = Number(loc.lng)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return []

        const point = project(lat, lng, phi, theta, size)
        return [{
          id: loc.id,
          country: loc.country,
          x: point.x,
          y: point.y,
          visible: point.visible,
          depth: point.depth,
        }]
      })

      const visible = raw.filter((point) => point.visible)
      const separated = separateMarkerPositions(visible, Math.max(18, size * 0.022))
      markerPositionsRef.current = separated

      for (const point of raw) {
        const el = markerRefs.current[point.id]
        if (!el) continue

        const layout = separated.find((item) => item.id === point.id)
        const displayX = layout?.displayX ?? point.x
        const displayY = layout?.displayY ?? point.y
        const active =
          selectedIdRef.current === point.id ||
          hoveredIdRef.current === point.id

        el.style.left = `${displayX}px`
        el.style.top = `${displayY}px`
        el.style.opacity = point.visible ? '1' : '0'
        el.style.visibility = point.visible ? 'visible' : 'hidden'
        el.style.transform = `translate(-50%, -50%) scale(${active ? 1.15 : 1})`
        el.style.zIndex = String(active ? 30 : 10 + Math.round(point.depth * 10))
      }
    }

    const updatePointerTarget = (localX, localY) => {
      const nearest = pickNearestMarker(markerPositionsRef.current, localX, localY, HOVER_RADIUS)
      setHover(nearest)
      container.style.cursor = nearest ? 'pointer' : 'grab'
    }

    const tick = () => {
      if (destroyed) return

      if (!tabHidden) {
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
      }

      const size = sizeRef.current
      drawGlobe(ctx, size, landPointsRef.current, phiRef.current, thetaRef.current)
      updateMarkers(phiRef.current, thetaRef.current, size)

      const activeId = selectedIdRef.current ?? hoveredIdRef.current
      onActiveAnchorChangeRef.current?.(activeId ? getMarkerClientAnchor(activeId) : null)

      frameId = requestAnimationFrame(tick)
    }

    const handleResize = () => {
      resizeCanvas(readSize())
    }

    resizeCanvas(readSize())
    frameId = requestAnimationFrame(tick)

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    const handleVisibility = () => {
      tabHidden = document.hidden
    }

    const handlePointerDown = (event) => {
      pointerDownRef.current = { x: event.clientX, y: event.clientY }
      pointerInteracting.current = event.clientX
      velocityRef.current = 0
      container.style.cursor = 'grabbing'
    }

    const handlePointerMove = (event) => {
      if (pointerInteracting.current === null) return

      const delta = event.clientX - pointerInteracting.current
      pointerInteracting.current = event.clientX
      phiRef.current += delta * DRAG_SENSITIVITY
      velocityRef.current = delta * DRAG_SENSITIVITY * 0.85
    }

    const handlePointerUp = (event) => {
      const down = pointerDownRef.current
      pointerInteracting.current = null
      pointerDownRef.current = null

      if (down) {
        const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y)
        if (moved <= DRAG_THRESHOLD) {
          const { x, y } = localPointer(event)
          const nearest = pickNearestMarker(markerPositionsRef.current, x, y, HOVER_RADIUS)
          if (nearest) {
            onMarkerClickRef.current(nearest)
            container.style.cursor = 'pointer'
            return
          }
        }
      }

      if (selectedIdRef.current !== null) {
        container.style.cursor = 'pointer'
        return
      }

      const { x, y } = localPointer(event)
      updatePointerTarget(x, y)
    }

    const handleContainerPointerMove = (event) => {
      if (pointerInteracting.current !== null) return
      const { x, y } = localPointer(event)
      updatePointerTarget(x, y)
    }

    const handleContainerPointerLeave = () => {
      if (pointerInteracting.current !== null) return
      if (selectedIdRef.current !== null) return
      setHover(null)
      container.style.cursor = 'grab'
    }

    document.addEventListener('visibilitychange', handleVisibility)
    container.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('pointermove', handleContainerPointerMove)
    container.addEventListener('pointerleave', handleContainerPointerLeave)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      destroyed = true
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('pointermove', handleContainerPointerMove)
      container.removeEventListener('pointerleave', handleContainerPointerLeave)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      container.style.cursor = ''
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

  return (
    <div ref={wrapRef} className={`globe-stage relative w-full ${className}`}>
      <div
        ref={containerRef}
        className="globe-canvas-wrap relative mx-auto cursor-grab touch-none select-none"
        style={{
          width: GLOBE_PX,
          height: GLOBE_PX,
          maxWidth: `min(99vw, ${GLOBE_MAX_PX}px)`,
          maxHeight: `min(99vw, ${GLOBE_MAX_PX}px)`,
        }}
      >
        <canvas ref={canvasRef} className="globe-canvas" aria-hidden="true" />

        {locations.map((loc) => (
          <button
            key={loc.id}
            ref={(node) => {
              if (node) markerRefs.current[loc.id] = node
              else delete markerRefs.current[loc.id]
            }}
            type="button"
            className="globe-marker-btn"
            style={{ opacity: 0 }}
            tabIndex={-1}
            aria-label={`${loc.country} — ${loc.eventCount} events across ${loc.regions?.length ?? 1} region${(loc.regions?.length ?? 1) === 1 ? '' : 's'}`}
            aria-pressed={selectedId === loc.id}
          >
            <span
              className={`globe-marker-dot ${loc.hasOngoingEvents ? 'is-ongoing' : ''} ${selectedId === loc.id ? 'is-active' : ''} ${hoveredId === loc.id ? 'is-hovered' : ''}`}
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
