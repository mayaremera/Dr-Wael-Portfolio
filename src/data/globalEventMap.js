import engagementsSource from './globeEngagementsSource.json'

export const globalPresenceMap = {
  label: 'Global Presence',
  title: 'A World of Conferences & Engagements',
  description:
    'Dr. Wael has presented seminars, keynotes, and workshops across Saudi Arabia, the Gulf, Europe, and North America — from ASHA conventions to regional autism and speech-language pathology conferences. Spin the globe and explore.',
}

const milestone = (id, period, date, type, title, location, note) => ({
  id,
  period,
  date,
  type,
  title,
  location,
  note,
  isMilestone: true,
})

function eventsToMilestones(regionId, events = []) {
  return events.map((event, index) =>
    milestone(
      `${regionId}-${index}`,
      event.period,
      event.date,
      event.type,
      event.title,
      event.location,
      event.note ?? '',
    ),
  )
}

function normalizeRegion(region) {
  const milestones =
    region.milestones?.length > 0
      ? region.milestones.map((entry) => ({ ...entry, isMilestone: true }))
      : eventsToMilestones(region.id, region.events ?? [])

  return {
    id: region.id,
    name: region.name,
    role: region.role ?? '',
    milestones,
  }
}

export function normalizeGlobeCountry(country) {
  if (!country) return country

  const regions = (country.regions ?? []).map(normalizeRegion)

  if (regions.length === 0 && (country.city || country.milestones?.length)) {
    regions.push(
      normalizeRegion({
        id: country.id,
        name: country.city || country.country,
        role: country.role ?? '',
        milestones: country.milestones ?? [],
      }),
    )
  }

  return {
    id: country.id,
    country: country.country,
    lat: Number(country.lat),
    lng: Number(country.lng),
    flag: country.flag,
    role: country.role ?? '',
    regions,
  }
}

export function normalizeGlobeCountries(locations = []) {
  if (!locations.length) return []

  const hasRegions = locations.some((entry) => Array.isArray(entry.regions) && entry.regions.length > 0)
  if (hasRegions) {
    return locations.map(normalizeGlobeCountry)
  }

  const grouped = new Map()
  for (const entry of locations) {
    const key = entry.country || entry.id
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: entry.id,
        country: entry.country,
        lat: entry.lat,
        lng: entry.lng,
        flag: entry.flag,
        role: entry.role ?? '',
        regions: [],
      })
    }

    const country = grouped.get(key)
    country.regions.push(
      normalizeRegion({
        id: entry.id,
        name: entry.city || entry.country,
        role: entry.role ?? '',
        milestones: entry.milestones ?? [],
      }),
    )
  }

  return Array.from(grouped.values()).map(normalizeGlobeCountry)
}

export const mapLocations = normalizeGlobeCountries(engagementsSource.countries ?? engagementsSource.locations ?? [])

const LOCATION_HINTS = [
  { match: /orlando|florida/i, id: 'united-states' },
  { match: /boston|massachusetts/i, id: 'united-states' },
  { match: /denver|colorado/i, id: 'united-states' },
  { match: /seattle|washington state/i, id: 'united-states' },
  { match: /philadelphia/i, id: 'united-states' },
  { match: /washington.*d\.?c|d\.?c\.|asha convention.*washington/i, id: 'united-states' },
  { match: /vancouver/i, id: 'canada' },
  { match: /edinburgh|scotland/i, id: 'united-kingdom' },
  { match: /dublin|ireland|ialp/i, id: 'ireland' },
  { match: /estoril|lisbon|portugal/i, id: 'portugal' },
  { match: /vienna|austria/i, id: 'austria' },
  { match: /helsinki|finland/i, id: 'finland' },
  { match: /berlin|germany/i, id: 'germany' },
  { match: /antalya|turki|turkey|türkiye/i, id: 'turkey' },
  { match: /alexandria|egypt/i, id: 'egypt' },
  { match: /jeddah|jish|madina|medina|khobar|dammam|riyadh|alfaisal|king faisal|king fahad|king abdul|king salman|sarc|military hospital|building skills|psych care|prince sultan|prince nourah|prince salman|yanmo|saudi|ksa/i, id: 'saudi-arabia' },
  { match: /dubai|uae|emirates|abu dhabi/i, id: 'uae' },
  { match: /bahrain|manama/i, id: 'bahrain' },
  { match: /doha|qatar/i, id: 'qatar' },
  { match: /oman|muscat/i, id: 'oman' },
  { match: /kuwait/i, id: 'kuwait' },
  { match: /jordan|amman/i, id: 'jordan' },
  { match: /asha|united states|usa|u\.s\.|america/i, id: 'united-states' },
  { match: /canada/i, id: 'canada' },
  { match: /united kingdom|britain|uk\b/i, id: 'united-kingdom' },
]

export function inferMapLocationId(location = '', locations = mapLocations) {
  const hint = LOCATION_HINTS.find(({ match }) => match.test(location))
  if (hint && locations.some((entry) => entry.id === hint.id)) {
    return hint.id
  }

  const normalized = location.toLowerCase()
  const matched = locations.find((entry) => {
    if (normalized.includes(entry.country.toLowerCase())) return true

    return entry.regions?.some(
      (region) =>
        normalized.includes(region.name.toLowerCase()) ||
        region.milestones?.some((item) => normalized.includes(item.location.toLowerCase())),
    )
  })

  return matched?.id ?? locations[0]?.id ?? 'saudi-arabia'
}

export function isOngoingEvent(event) {
  return event.isUpcoming === true || event.date === 'Ongoing' || event.period === 'Present'
}

export function locationToAngles(lat, lng) {
  return {
    phi: Math.PI + (lng * Math.PI) / 180,
    theta: (-lat * Math.PI) / 360,
  }
}

function buildRegionWithEvents(region, linkedEvents = []) {
  const events = [...linkedEvents, ...(region.milestones ?? [])]
  return {
    ...region,
    eventCount: events.length,
    events,
    hasOngoingEvents: events.some(isOngoingEvent),
  }
}

export function buildMapLocationsWithEvents(activity) {
  const sourceLocations = normalizeGlobeCountries(
    activity.globe?.locations?.length ? activity.globe.locations : mapLocations,
  )

  const liveEvents = [
    ...(activity.upcoming ?? []).map((event) => ({ ...event, isUpcoming: true })),
    ...(activity.recent ?? []).map((event) => ({ ...event, isUpcoming: false })),
  ]

  return sourceLocations.map((country) => {
    const linkedEvents = liveEvents.filter(
      (event) => inferMapLocationId(event.location, sourceLocations) === country.id,
    )

    const regions = (country.regions ?? []).map((region) => buildRegionWithEvents(region))
    const allEvents = [...linkedEvents, ...regions.flatMap((region) => region.events)]

    return {
      ...country,
      regions,
      eventCount: allEvents.length,
      events: allEvents,
      hasOngoingEvents: allEvents.some(isOngoingEvent),
    }
  })
}

export function getHomeBase(locations = mapLocations) {
  return locations.find((loc) => loc.id === 'saudi-arabia') ?? locations[0]
}
