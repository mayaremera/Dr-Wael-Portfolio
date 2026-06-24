import {
  careerImpact as defaultCareerImpact,
  careerTimeline as defaultCareerTimeline,
  certificatePlaceholders,
  certificates as defaultCertificates,
  images,
  leadershipRoles as defaultLeadershipRoles,
  profileDetails as defaultProfileDetails,
} from './content'
import { academicServices as defaultAcademicServices } from './academicServices'
import { refereedPublications as defaultRefereedPublications } from './refereedPublications'
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

const TIMELINE_DUPLICATE_IDS = new Set(['asha-ambassador', 'sig17-editor', 'ialp', 'eacsl', 'jslhr'])

function mergeAcademicServices(saved, defaults) {
  const normalized = normalizeAcademicServices(saved ?? defaults)
  const hasInternational = normalized.categories.some((category) => category.id === 'international')

  if (hasInternational) return normalized

  const internationalCategory = (defaults.categories ?? []).find((category) => category.id === 'international')
  if (!internationalCategory) return normalized

  return {
    ...normalized,
    categories: [internationalCategory, ...normalized.categories],
  }
}

function normalizeCareerTimeline(items = []) {
  return items.filter((item) => !TIMELINE_DUPLICATE_IDS.has(item.id))
}

function normalizeAcademicServices(data) {
  const source = data ?? defaultAcademicServices

  return {
    label: source.label ?? defaultAcademicServices.label,
    title: source.title ?? defaultAcademicServices.title,
    intro: source.intro ?? defaultAcademicServices.intro,
    categories: (source.categories ?? defaultAcademicServices.categories).map((category, categoryIndex) => ({
      id: category.id || createContentId(category.label || `academic-category-${categoryIndex}`),
      label: category.label || '',
      items: (category.items ?? []).map((item, itemIndex) => ({
        id: item.id || createContentId(item.title || `academic-item-${categoryIndex}-${itemIndex}`),
        title: item.title || '',
        org: item.org || '',
        period: item.period ?? null,
        description: item.description ?? null,
        ...(item.link?.href ? { link: { href: item.link.href, label: item.link.label || 'Learn more' } } : {}),
        ...(item.journals?.length ? { journals: [...item.journals] } : {}),
        ...(item.workshops?.length ? { workshops: item.workshops.map((workshop) => ({ ...workshop })) } : {}),
      })),
    })),
  }
}

function normalizeRefereedPublications(data) {
  const source = data ?? defaultRefereedPublications

  return {
    label: source.label ?? defaultRefereedPublications.label,
    title: source.title ?? defaultRefereedPublications.title,
    intro: source.intro ?? defaultRefereedPublications.intro,
    papers: (source.papers ?? defaultRefereedPublications.papers).map((paper, index) => ({
      id: paper.id || createContentId(paper.title || `paper-${index}`),
      year: paper.year ?? '',
      authors: paper.authors || '',
      title: paper.title || '',
      venue: paper.venue || '',
      details: paper.details ?? '',
      doi: paper.doi ?? null,
      type: paper.type || 'Journal',
    })),
  }
}

export function getDefaultAboutContent() {
  return {
    profileDetails: cloneContent(defaultProfileDetails),
    profileImage: images.drWael,
    careerImpact: cloneContent(defaultCareerImpact),
    academicServices: normalizeAcademicServices(defaultAcademicServices),
    refereedPublications: normalizeRefereedPublications(defaultRefereedPublications),
    certificates: cloneContent(getDefaultCertificates()),
    careerTimeline: normalizeCareerTimeline(cloneContent(defaultCareerTimeline)),
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
    academicServices: mergeAcademicServices(
      saved.academicServices ?? defaults.academicServices,
      normalizeAcademicServices(defaultAcademicServices),
    ),
    refereedPublications: normalizeRefereedPublications(saved.refereedPublications ?? defaults.refereedPublications),
    certificates: saved.certificates ?? defaults.certificates,
    careerTimeline: normalizeCareerTimeline(saved.careerTimeline ?? defaults.careerTimeline).map((item, index) => ({
      id: item.id || `timeline-${index}`,
      ...item,
    })),
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

export const emptyAcademicCategory = {
  id: '',
  label: '',
  items: [],
}

export const emptyAcademicServiceItem = {
  id: '',
  title: '',
  org: '',
  period: '',
  description: '',
  link: { href: '', label: '' },
  journals: [],
  workshops: [],
}

export const emptyPublication = {
  id: '',
  year: '',
  authors: '',
  title: '',
  venue: '',
  details: '',
  doi: '',
  type: 'Journal',
}

export function createAcademicCategoryId(label = 'category') {
  return createContentId(label)
}

export function createAcademicServiceItemId(title = 'item') {
  return createContentId(title)
}
