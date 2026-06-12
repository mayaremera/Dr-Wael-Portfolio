const DEG = Math.PI / 180

/** Match cobe's lat/lng → unit-sphere conversion. */
export function latLngToUnit(lat, lng) {
  const phi = lat * DEG
  const lambda = lng * DEG - Math.PI
  const cosPhi = Math.cos(phi)
  return {
    x: -cosPhi * Math.cos(lambda),
    y: Math.sin(phi),
    z: cosPhi * Math.sin(lambda),
  }
}

export function rotateY(v, angle) {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return {
    x: c * v.x + s * v.z,
    y: v.y,
    z: -s * v.x + c * v.z,
  }
}

export function rotateX(v, angle) {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return {
    x: v.x,
    y: c * v.y - s * v.z,
    z: s * v.y + c * v.z,
  }
}

export function project(lat, lng, phi, theta, size, scale = 1.05) {
  let v = latLngToUnit(lat, lng)
  v = rotateY(v, phi)
  v = rotateX(v, theta)

  const radius = size * 0.4 * scale
  const x = size / 2 + v.x * radius
  const y = size / 2 - v.y * radius

  return {
    x,
    y,
    visible: v.z > 0.02,
    depth: v.z,
  }
}

/** Push overlapping markers apart so clusters stay clickable. */
export function separateMarkerPositions(positions, minDistance = 24, iterations = 10) {
  const separated = positions.map((point) => ({
    ...point,
    displayX: point.x,
    displayY: point.y,
  }))

  for (let pass = 0; pass < iterations; pass += 1) {
    for (let i = 0; i < separated.length; i += 1) {
      for (let j = i + 1; j < separated.length; j += 1) {
        const a = separated[i]
        const b = separated[j]
        const dx = b.displayX - a.displayX
        const dy = b.displayY - a.displayY
        const distance = Math.hypot(dx, dy) || 0.001

        if (distance >= minDistance) continue

        const push = (minDistance - distance) / 2
        const nx = dx / distance
        const ny = dy / distance
        a.displayX -= nx * push
        a.displayY -= ny * push
        b.displayX += nx * push
        b.displayY += ny * push
      }
    }
  }

  return separated
}

/** Pick the closest visible marker to a pointer — works even when dots overlap. */
export function pickNearestMarker(positions, localX, localY, radius = 36) {
  let nearestId = null
  let nearestDistance = radius

  for (const point of positions) {
    if (!point.visible) continue

    const distance = Math.hypot(localX - point.displayX, localY - point.displayY)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestId = point.id
    }
  }

  return nearestId
}
