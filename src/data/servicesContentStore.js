import {
  casesWeServe as defaultCasesWeServe,
  clinicalSpecializations as defaultClinicalSpecializations,
  speechLanguageServices as defaultSpeechLanguageServices,
  testimonials as defaultTestimonials,
  testimonialsSection as defaultTestimonialsSection,
  therapyConcepts as defaultTherapyConcepts,
} from './content'
import {
  CONTENT_SECTIONS,
  loadSectionPrimary,
  resetSectionPrimary,
  saveSectionPrimary,
} from './contentSync'

export const SERVICES_STORAGE_KEY = 'drwael-services-content'
export const CLINICAL_CASES_FEATURED_COUNT = 10

function cloneContent(data) {
  return JSON.parse(JSON.stringify(data))
}

export function getDefaultServicesContent() {
  return {
    speechLanguageServices: cloneContent(defaultSpeechLanguageServices),
    therapyConcepts: cloneContent(defaultTherapyConcepts),
    casesWeServe: cloneContent(defaultCasesWeServe),
    clinicalSpecializations: cloneContent(defaultClinicalSpecializations),
    clinicalCasesFeaturedIds: Array(CLINICAL_CASES_FEATURED_COUNT).fill(''),
    testimonialsSection: cloneContent(defaultTestimonialsSection),
    testimonials: cloneContent(defaultTestimonials),
  }
}

function migrateImagePath(url, legacyPath, nextPath) {
  if (!url) return url

  const [base, query] = url.split('?')
  if (base !== legacyPath) return url

  return query ? `${nextPath}?${query}` : nextPath
}

const THERAPY_CONCEPT_ORDER = [
  'screening',
  'counseling',
  'assessment',
  'treatment',
  'family-training',
  'professional-training',
]

function reorderTherapyConcepts(concepts) {
  if (!concepts?.length) return concepts

  const byId = new Map(concepts.map((concept) => [concept.id, concept]))
  const ordered = THERAPY_CONCEPT_ORDER.map((id) => byId.get(id)).filter(Boolean)
  const remainder = concepts.filter((concept) => !THERAPY_CONCEPT_ORDER.includes(concept.id))

  return [...ordered, ...remainder]
}

function migrateTherapyConcept(concept) {
  if (concept.id === 'family-training') {
    return {
      ...concept,
      image: migrateImagePath(concept.image, '/images/family.jpg', '/images/familytraining.jpg'),
    }
  }

  return concept
}

function migrateTherapyConcepts(saved, defaults) {
  if (saved == null) return defaults
  if (!saved.length) return []
  return reorderTherapyConcepts(saved.map(migrateTherapyConcept))
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultServicesContent()
  const validCaseIds = new Set((saved.clinicalSpecializations ?? defaults.clinicalSpecializations).map((item) => item.id))

  return {
    speechLanguageServices: {
      ...defaults.speechLanguageServices,
      ...saved.speechLanguageServices,
    },
    casesWeServe: {
      ...defaults.casesWeServe,
      ...saved.casesWeServe,
    },
    testimonialsSection: {
      ...defaults.testimonialsSection,
      ...saved.testimonialsSection,
    },
    therapyConcepts: migrateTherapyConcepts(saved.therapyConcepts, defaults.therapyConcepts),
    clinicalSpecializations:
      saved.clinicalSpecializations != null
        ? saved.clinicalSpecializations
        : defaults.clinicalSpecializations,
    clinicalCasesFeaturedIds: Array.from({ length: CLINICAL_CASES_FEATURED_COUNT }, (_, index) => {
      const id = (saved.clinicalCasesFeaturedIds ?? [])[index]
      return typeof id === 'string' && id && validCaseIds.has(id) ? id : ''
    }),
    testimonials: saved.testimonials != null ? saved.testimonials : defaults.testimonials,
  }
}

function normalizeClinicalCasesFeaturedIds(savedIds) {
  const source = Array.isArray(savedIds) ? savedIds : []
  return Array.from({ length: CLINICAL_CASES_FEATURED_COUNT }, (_, index) =>
    typeof source[index] === 'string' ? source[index] : '',
  )
}

export function resolveClinicalCasesDisplayOrder(cases, featuredIds) {
  const pool = cases ?? []
  const byId = new Map(pool.map((item) => [item.id, item]))
  const selectedIds = normalizeClinicalCasesFeaturedIds(featuredIds)
  const hasSelection = selectedIds.some((id) => id && byId.has(id))

  if (!hasSelection) {
    return pool
  }

  const used = new Set()
  const featured = []

  for (const id of selectedIds) {
    if (id && byId.has(id) && !used.has(id)) {
      featured.push(byId.get(id))
      used.add(id)
      continue
    }

    const fallback = pool.find((item) => !used.has(item.id))
    if (fallback) {
      featured.push(fallback)
      used.add(fallback.id)
    }
  }

  const remainder = pool.filter((item) => !used.has(item.id))
  return [...featured, ...remainder]
}

export function loadServicesContent() {
  return getDefaultServicesContent()
}

export async function loadServicesContentRemote() {
  return loadSectionPrimary({
    section: CONTENT_SECTIONS.SERVICES,
    storageKey: SERVICES_STORAGE_KEY,
    mergeWithDefaults,
    getDefaults: getDefaultServicesContent,
  })
}

export async function saveServicesContent(data) {
  return saveSectionPrimary({
    section: CONTENT_SECTIONS.SERVICES,
    storageKey: SERVICES_STORAGE_KEY,
    data,
  })
}

export async function resetServicesContent() {
  return resetSectionPrimary({
    section: CONTENT_SECTIONS.SERVICES,
    storageKey: SERVICES_STORAGE_KEY,
  })
}

export function createContentId(title = 'item') {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 24)

  return `${slug || 'item'}-${Date.now()}`
}

export const FILTER_GROUPS = ['Neurodevelopmental', 'Learning', 'Developmental', 'Communication']

export const emptyTherapyConcept = {
  id: '',
  image: '',
  title: '',
  subtitle: '',
  summary: '',
  paragraphs: [''],
  bullets: [],
  ctaLabel: 'Book a Session',
  pageOnly: true,
}

export const emptyClinicalCase = {
  id: '',
  filterGroup: 'Neurodevelopmental',
  category: '',
  title: '',
  abbr: '',
  image: '',
  excerpt: '',
  homepageExcerpt: '',
  paragraphs: [''],
  therapyAreas: [''],
}

export const emptyTestimonial = {
  id: '',
  name: '',
  location: '',
  image: '',
  quote: '',
}
