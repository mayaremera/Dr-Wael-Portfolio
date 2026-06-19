import {
  images,
  profileDetails,
  promoVideo as defaultPromoVideo,
  site,
  trustedCompanies as defaultTrustedCompanies,
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
    promoVideo: cloneContent(defaultPromoVideo),
    credentialWheel: {
      tagline: 'A Career Dedicated to Communication, Education, and Impact',
      items: cloneContent(defaultCredentialWheelItems),
    },
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
    promoVideo: {
      ...defaults.promoVideo,
      ...saved.promoVideo,
      cta: { ...defaults.promoVideo.cta, ...saved.promoVideo?.cta },
      secondary: { ...defaults.promoVideo.secondary, ...saved.promoVideo?.secondary },
    },
    credentialWheel: {
      ...defaults.credentialWheel,
      ...saved.credentialWheel,
      items: saved.credentialWheel?.items?.length
        ? saved.credentialWheel.items.map((item, index) => ({
            ...defaults.credentialWheel.items[index],
            ...item,
          }))
        : defaults.credentialWheel.items,
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

export const emptyCredentialWheelItem = {
  id: '',
  short: '',
  title: '',
  detail: '',
}
