import {
  careerTimeline as defaultCareerTimeline,
  certificatePlaceholders,
  certificates as defaultCertificates,
  images,
  leadershipRoles as defaultLeadershipRoles,
  profileDetails as defaultProfileDetails,
} from './content'
import { CONTENT_UPDATED_EVENT } from './contentStore'
import { createContentId } from './servicesContentStore'

const ABOUT_STORAGE_KEY = 'drwael-about-content'

function cloneContent(data) {
  return JSON.parse(JSON.stringify(data))
}

function getDefaultCertificates() {
  return defaultCertificates.map((certificate, index) => ({
    ...certificate,
    image: certificatePlaceholders[index % certificatePlaceholders.length],
  }))
}

export function getDefaultAboutContent() {
  return {
    profileDetails: cloneContent(defaultProfileDetails),
    profileImage: images.drWael,
    certificates: cloneContent(getDefaultCertificates()),
    careerTimeline: cloneContent(defaultCareerTimeline),
    leadershipRoles: cloneContent(defaultLeadershipRoles).map((role, index) => ({
      id: `leadership-${index}`,
      ...role,
    })),
  }
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultAboutContent()

  return {
    ...defaults,
    ...saved,
    profileDetails: {
      ...defaults.profileDetails,
      ...saved.profileDetails,
    },
    profileImage: saved.profileImage ?? defaults.profileImage,
    certificates: saved.certificates ?? defaults.certificates,
    careerTimeline: saved.careerTimeline ?? defaults.careerTimeline,
    leadershipRoles: (saved.leadershipRoles ?? defaults.leadershipRoles).map((role, index) => ({
      id: role.id || `leadership-${index}`,
      ...role,
    })),
  }
}

export function loadAboutContent() {
  try {
    const saved = localStorage.getItem(ABOUT_STORAGE_KEY)
    if (saved) {
      return mergeWithDefaults(JSON.parse(saved))
    }
  } catch {
    // fall through
  }

  return getDefaultAboutContent()
}

export function saveAboutContent(data) {
  try {
    localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded')
    }
    throw error
  }

  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
}

export function resetAboutContent() {
  localStorage.removeItem(ABOUT_STORAGE_KEY)
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
}

export { createContentId }

export const TIMELINE_TYPES = ['education', 'clinical', 'academic', 'leadership', 'honor', 'research']

export const emptyCertificate = {
  id: '',
  title: '',
  issuer: '',
  year: '',
  description: '',
  image: '',
  featured: false,
}

export const emptyTimelineEntry = {
  id: '',
  year: '',
  title: '',
  org: '',
  type: 'education',
}

export const emptyLeadershipRole = {
  id: '',
  year: '',
  title: '',
  org: '',
  note: '',
}
