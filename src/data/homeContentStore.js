import {
  images,
  profileDetails,
  promoVideo as defaultPromoVideo,
  site,
  trustedCompanies as defaultTrustedCompanies,
  video as defaultWatchVideo,
  whyChooseUs as defaultWhyChooseUs,
} from './content'
import { createContentId } from './servicesContentStore'
import {
  CONTENT_SECTIONS,
  loadSectionPrimary,
  resetSectionPrimary,
  saveSectionPrimary,
} from './contentSync'

export const HOME_STORAGE_KEY = 'drwael-home-content'

function cloneContent(data) {
  return JSON.parse(JSON.stringify(data))
}

export function getDefaultHomeContent() {
  return {
    hero: {
      backgroundImage: images.heroBanner,
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
      image: images.family,
    },
    watchVideo: cloneContent(defaultWatchVideo),
    promoVideo: cloneContent(defaultPromoVideo),
  }
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultHomeContent()

  return {
    ...defaults,
    ...saved,
    hero: {
      ...defaults.hero,
      ...saved.hero,
      primaryCta: { ...defaults.hero.primaryCta, ...saved.hero?.primaryCta },
      secondaryCta: { ...defaults.hero.secondaryCta, ...saved.hero?.secondaryCta },
    },
    affiliations: {
      ...defaults.affiliations,
      ...saved.affiliations,
      companies: saved.affiliations?.companies?.length
        ? saved.affiliations.companies.map((company, index) => ({
            ...defaults.affiliations.companies[index],
            ...company,
          }))
        : defaults.affiliations.companies,
    },
    whyChooseUs: {
      ...defaults.whyChooseUs,
      ...saved.whyChooseUs,
      paragraphs: saved.whyChooseUs?.paragraphs?.length
        ? saved.whyChooseUs.paragraphs
        : defaults.whyChooseUs.paragraphs,
    },
    watchVideo: {
      ...defaults.watchVideo,
      ...saved.watchVideo,
      paragraphs: saved.watchVideo?.paragraphs?.length
        ? saved.watchVideo.paragraphs
        : defaults.watchVideo.paragraphs,
    },
    promoVideo: {
      ...defaults.promoVideo,
      ...saved.promoVideo,
      cta: { ...defaults.promoVideo.cta, ...saved.promoVideo?.cta },
      secondary: { ...defaults.promoVideo.secondary, ...saved.promoVideo?.secondary },
    },
  }
}

export function loadHomeContent() {
  return getDefaultHomeContent()
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
}
