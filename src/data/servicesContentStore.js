import {
  casesWeServe as defaultCasesWeServe,
  clinicalSpecializations as defaultClinicalSpecializations,
  speechLanguageServices as defaultSpeechLanguageServices,
  testimonials as defaultTestimonials,
  testimonialsSection as defaultTestimonialsSection,
  therapyConcepts as defaultTherapyConcepts,
} from './content'
import { CONTENT_UPDATED_EVENT } from './contentStore'

const SERVICES_STORAGE_KEY = 'drwael-services-content'

function cloneContent(data) {
  return JSON.parse(JSON.stringify(data))
}

export function getDefaultServicesContent() {
  return {
    speechLanguageServices: cloneContent(defaultSpeechLanguageServices),
    therapyConcepts: cloneContent(defaultTherapyConcepts),
    casesWeServe: cloneContent(defaultCasesWeServe),
    clinicalSpecializations: cloneContent(defaultClinicalSpecializations),
    testimonialsSection: cloneContent(defaultTestimonialsSection),
    testimonials: cloneContent(defaultTestimonials),
  }
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultServicesContent()

  return {
    ...defaults,
    ...saved,
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
    therapyConcepts: saved.therapyConcepts ?? defaults.therapyConcepts,
    clinicalSpecializations: saved.clinicalSpecializations ?? defaults.clinicalSpecializations,
    testimonials: saved.testimonials ?? defaults.testimonials,
  }
}

export function loadServicesContent() {
  try {
    const saved = localStorage.getItem(SERVICES_STORAGE_KEY)
    if (saved) {
      return mergeWithDefaults(JSON.parse(saved))
    }
  } catch {
    // fall through to defaults
  }

  return getDefaultServicesContent()
}

export function saveServicesContent(data) {
  try {
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded')
    }
    throw error
  }

  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
}

export function resetServicesContent() {
  localStorage.removeItem(SERVICES_STORAGE_KEY)
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
}

export function createContentId(title = 'item') {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 24)

  return `${slug || 'item'}-${Date.now()}`
}

export const FILTER_GROUPS = ['Neurodevelopmental', 'Language', 'Speech', 'Apraxia', 'Fluency']

export const emptyTherapyConcept = {
  id: '',
  image: '',
  title: '',
  subtitle: '',
  summary: '',
  paragraphs: [''],
  bullets: [],
  ctaLabel: 'Book a Session',
}

export const emptyClinicalCase = {
  id: '',
  filterGroup: 'Neurodevelopmental',
  category: '',
  title: '',
  abbr: '',
  image: '',
  excerpt: '',
  paragraphs: [''],
  therapyAreas: [''],
  bilingualNote: '',
}

export const emptyTestimonial = {
  id: '',
  name: '',
  location: '',
  image: '',
  quote: '',
}
