import {
  careerImpact as defaultCareerImpact,
  careerTimeline as defaultCareerTimeline,
  certificatePlaceholders,
  certificates as defaultCertificates,
  images,
  leadershipRoles as defaultLeadershipRoles,
  profileDetails as defaultProfileDetails,
} from './content'
import {
  CONTENT_SECTIONS,
  loadSectionPrimary,
  resetSectionPrimary,
  saveSectionPrimary,
} from './contentSync'
import { createContentId } from './servicesContentStore'

export const ABOUT_STORAGE_KEY = 'drwael-about-content'

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
    careerImpact: cloneContent(defaultCareerImpact),
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
      credentials: saved.profileDetails?.credentials?.length
        ? saved.profileDetails.credentials
        : defaults.profileDetails.credentials,
      bio: saved.profileDetails?.bio?.length ? saved.profileDetails.bio : defaults.profileDetails.bio,
      bioExtended: saved.profileDetails?.bioExtended?.length
        ? saved.profileDetails.bioExtended
        : defaults.profileDetails.bioExtended,
    },
    profileImage: saved.profileImage ?? defaults.profileImage,
    careerImpact: {
      ...defaults.careerImpact,
      ...saved.careerImpact,
      stats: saved.careerImpact?.stats?.length ? saved.careerImpact.stats : defaults.careerImpact.stats,
    },
    certificates: saved.certificates ?? defaults.certificates,
    careerTimeline: saved.careerTimeline ?? defaults.careerTimeline,
    leadershipRoles: (saved.leadershipRoles ?? defaults.leadershipRoles).map((role, index) => ({
      id: role.id || `leadership-${index}`,
      ...role,
    })),
  }
}

export function loadAboutContent() {
  return getDefaultAboutContent()
}

export async function loadAboutContentRemote() {
  return loadSectionPrimary({
    section: CONTENT_SECTIONS.ABOUT,
    storageKey: ABOUT_STORAGE_KEY,
    mergeWithDefaults,
    getDefaults: getDefaultAboutContent,
  })
}

export async function saveAboutContent(data) {
  return saveSectionPrimary({
    section: CONTENT_SECTIONS.ABOUT,
    storageKey: ABOUT_STORAGE_KEY,
    data,
  })
}

export async function resetAboutContent() {
  return resetSectionPrimary({
    section: CONTENT_SECTIONS.ABOUT,
    storageKey: ABOUT_STORAGE_KEY,
  })
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
