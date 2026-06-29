import {
  images,
  profileDetails,
  site,
  trustedCompanies as defaultTrustedCompanies,
  whyChooseUs as defaultWhyChooseUs,
} from './content'
import { createContentId } from './servicesContentStore'
import {
  CONTENT_SECTIONS,
  fetchRemoteSection,
  loadSectionPrimary,
  resetSectionPrimary,
  saveSectionPrimary,
} from './contentSync'
import { isSupabaseConfigured } from '../lib/supabase'

export const HOME_STORAGE_KEY = 'drwael-home-content'

export const defaultCredentialWheelItems = [
  {
    id: 'years-experience',
    short: '30+ Years',
    title: '30+ Years',
    detail: 'Over three decades of dedicated experience in Speech-Language Pathology.',
  },
  {
    id: 'asha-fellow',
    short: 'ASHA Fellow',
    title: 'F-ASHA',
    detail: 'ASHA Fellow — one of the highest honors awarded by the American Speech-Language-Hearing Association.',
  },
  {
    id: 'sessions',
    short: '40K+ Sessions',
    title: '40,000+ Sessions',
    detail: 'Speech and language therapy sessions delivered across diverse clinical settings.',
  },
  {
    id: 'evaluations',
    short: '3K+ Evals',
    title: '3,000+ Evaluations',
    detail: 'Comprehensive diagnostic evaluations completed for children and families.',
  },
  {
    id: 'nationalities',
    short: '50+ Nations',
    title: '50+ Nationalities',
    detail: 'Served children and families representing more than fifty nationalities worldwide.',
  },
  {
    id: 'professor',
    short: 'Professor',
    title: 'Clinical Educator',
    detail: 'Associate Professor and clinical educator in graduate Speech-Language Pathology programs.',
  },
  {
    id: 'sig-editor',
    short: 'SIG Editor',
    title: 'SIG 17 Editor',
    detail: 'Editor of Perspectives of the ASHA Special Interest Groups (SIG 17).',
  },
  {
    id: 'ambassador',
    short: 'Ambassador',
    title: 'ASHA Ambassador',
    detail: 'ASHA International Ambassador advancing global communication sciences.',
  },
  {
    id: 'mentor',
    short: 'Global Mentor',
    title: 'Speaker & Mentor',
    detail: 'International speaker, consultant, and professional mentor to clinicians worldwide.',
  },
]

function cloneContent(data) {
  return JSON.parse(JSON.stringify(data))
}

export function getDefaultHomeContent() {
  return {
    hero: {
      backgroundImage: images.heroBanner,
      backgroundImageMobile: images.heroMobileVertical,
      subtitle: site.title,
      name: profileDetails.name,
      description:
        'Over 30 years of clinical excellence, ASHA Fellow. Helping children with autism, ADHD, and language disorders find their voice through compassionate, evidence-based care in English and Arabic.',
      primaryCta: { label: 'Contact Us Now', href: '#contact' },
      secondaryCta: { label: 'View Services', href: '#approach' },
    },
    affiliations: cloneContent(defaultTrustedCompanies),
    whyChooseUs: {
      ...cloneContent(defaultWhyChooseUs),
      image: images.whyTrust,
    },
    credentialWheel: {
      tagline: 'A Career Dedicated to Communication, Education, and Impact',
      items: cloneContent(defaultCredentialWheelItems),
    },
  }
}

function migrateImagePath(url, legacyPath, nextPath) {
  if (!url) return url

  const [base, query] = url.split('?')
  if (base !== legacyPath) return url

  return query ? `${nextPath}?${query}` : nextPath
}

function migrateWhyChooseUs(saved, defaults) {
  if (!saved) return defaults

  return {
    label: saved.label ?? defaults.label,
    title: saved.title ?? defaults.title,
    image: migrateImagePath(
      saved.image ?? defaults.image,
      '/images/family.jpg',
      '/images/whytrust.jpg',
    ),
    paragraphs: saved.paragraphs != null ? saved.paragraphs : defaults.paragraphs,
  }
}

function migrateAffiliationCompany(company, defaults) {
  const defaultCambridge = defaults.affiliations.companies.find((entry) => entry.id === 'cambridge')
  const usesLegacyCambridgeAssets =
    company.id === 'cambridge' &&
    (company.logoLayout === 'split' ||
      company.badgeLogo ||
      company.logo?.includes('trusted8banner'))

  if (usesLegacyCambridgeAssets && defaultCambridge) {
    return {
      ...company,
      logo: defaultCambridge.logo,
      badgeLogo: defaultCambridge.badgeLogo ?? '',
      badgeLabel: defaultCambridge.badgeLabel ?? '',
      logoLayout: defaultCambridge.logoLayout ?? '',
      logoFit: defaultCambridge.logoFit ?? 'cover',
    }
  }

  return company
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultHomeContent()
  const { promoVideo: _legacyPromoVideo, ...savedWithoutPromo } = saved ?? {}

  return {
    ...defaults,
    ...savedWithoutPromo,
    hero: {
      ...defaults.hero,
      ...saved.hero,
      primaryCta: { ...defaults.hero.primaryCta, ...saved.hero?.primaryCta },
      secondaryCta: { ...defaults.hero.secondaryCta, ...saved.hero?.secondaryCta },
    },
    affiliations: {
      title: saved.affiliations?.title ?? defaults.affiliations.title,
      subtitle: saved.affiliations?.subtitle ?? defaults.affiliations.subtitle,
      viewAllLabel: saved.affiliations?.viewAllLabel ?? defaults.affiliations.viewAllLabel,
      viewAllHref: saved.affiliations?.viewAllHref ?? defaults.affiliations.viewAllHref,
      companies:
        saved.affiliations?.companies != null
          ? saved.affiliations.companies.map((company) => migrateAffiliationCompany(company, defaults))
          : defaults.affiliations.companies,
    },
    whyChooseUs: migrateWhyChooseUs(saved.whyChooseUs, defaults.whyChooseUs),
    credentialWheel: {
      ...defaults.credentialWheel,
      ...saved.credentialWheel,
      tagline: saved.credentialWheel?.tagline ?? defaults.credentialWheel.tagline,
      items:
        saved.credentialWheel?.items != null
          ? saved.credentialWheel.items
          : defaults.credentialWheel.items,
    },
  }
}

export function loadHomeContent() {
  return getDefaultHomeContent()
}

/** Merges remote home data and strips legacy promoVideo (now stored under gallery). */
export function mergeHomeContent(saved = {}) {
  const { promoVideo: _legacy, ...rest } = saved
  return mergeWithDefaults(rest)
}

function patchHomeContent(base, patch) {
  const next = { ...base }

  for (const key of Object.keys(patch)) {
    const patchValue = patch[key]
    const baseValue = base?.[key]

    if (
      patchValue != null &&
      typeof patchValue === 'object' &&
      !Array.isArray(patchValue) &&
      baseValue != null &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
    ) {
      next[key] = { ...baseValue, ...patchValue }
    } else {
      next[key] = patchValue
    }
  }

  return next
}

async function buildHomeSavePayload(patch) {
  if (!isSupabaseConfigured) {
    return patchHomeContent(getDefaultHomeContent(), patch)
  }

  const remote = await fetchRemoteSection(CONTENT_SECTIONS.HOME)
  const base = remote ?? getDefaultHomeContent()
  return patchHomeContent(base, patch)
}

export async function loadHomeContentRemote() {
  return loadSectionPrimary({
    section: CONTENT_SECTIONS.HOME,
    storageKey: HOME_STORAGE_KEY,
    mergeWithDefaults,
    getDefaults: getDefaultHomeContent,
  })
}

export async function saveHomeContent(data) {
  return saveSectionPrimary({
    section: CONTENT_SECTIONS.HOME,
    storageKey: HOME_STORAGE_KEY,
    data,
  })
}

/** Saves only the provided home subsections on top of the latest Supabase row. */
export async function saveHomeContentPartial(patch) {
  const payload = await buildHomeSavePayload(patch)
  return saveHomeContent(payload)
}

export async function resetHomeContent() {
  return resetSectionPrimary({
    section: CONTENT_SECTIONS.HOME,
    storageKey: HOME_STORAGE_KEY,
  })
}

export { createContentId }

export const emptyAffiliation = {
  id: '',
  name: '',
  shortName: '',
  role: '',
  logo: '',
  badgeLogo: '',
  badgeLabel: '',
  logoFit: '',
  logoLayout: '',
}

export const emptyCredentialWheelItem = {
  id: '',
  short: '',
  title: '',
  detail: '',
}
