import { site, profileDetails, clinicalExpertise, casesWeServe } from '../data/content'

export const SITE_URL = `https://${site.domain}`

export const TARGET_COUNTRIES = [
  'United States',
  'Canada',
  'Saudi Arabia',
  'Qatar',
  'Bahrain',
  'United Arab Emirates',
  'Oman',
  'Egypt',
  'Jordan',
  'Kuwait',
]

export const NAME_VARIANTS = [
  'Dr. Wael A. Al-Dakroury',
  'Dr. Wael Al-Dakroury',
  'Dr Wael Al Dakroury',
  'Wael Al-Dakroury',
  'Wael Aldakroury',
  'Dr. Wael Aldakroury',
  'وائل الدكروري',
  'د. وائل الدكروري',
  'دكتور وائل الدكروري',
  'الدكتور وائل الدكروري',
]

const DISORDER_KEYWORDS = [
  'autism spectrum disorder speech therapy',
  'ASD communication disorders',
  'ADHD speech and language',
  'developmental language disorder',
  'DLD bilingual children',
  'speech sound disorders',
  'childhood stuttering',
  'fluency disorders',
  'social pragmatic communication disorder',
  'intellectual disability communication',
  'global developmental delay language',
  'specific learning disorder language',
  'childhood apraxia of speech',
  'AAC augmentative communication',
  'bilingual speech therapy',
  'multilingual language disorders',
]

const ENGLISH_KEYWORDS = [
  'speech language pathologist',
  'speech therapist',
  'speech therapy',
  'communication disorders',
  'ASHA Fellow',
  'CCC-SLP',
  'pediatric SLP',
  'speech pathology professor',
  'speech therapy consultation',
  'speech therapy Riyadh',
  'speech therapy USA',
  'speech therapy Canada',
  'speech therapy Saudi Arabia',
  'speech therapy UAE',
  'speech therapy Qatar',
  'speech therapy Egypt',
  ...DISORDER_KEYWORDS,
  ...NAME_VARIANTS,
]

const ARABIC_KEYWORDS = [
  'علاج النطق واللغة',
  'اضطرابات النطق',
  'اضطرابات اللغة',
  'اخصائي نطق ولغة',
  'معالج نطق',
  'علاج تأخر النطق',
  'اضطراب طيف التوحد',
  'فرط الحركة وتشتت الانتباه',
  'اضطراب النطق الاجتماعي',
  'تأخر النمو الشامل',
  'علاج التأتأة',
  'اضطرابات الصوت',
  'تعدد اللغات والنطق',
  'استشارة نطق ولغة',
  'دكتور نطق ولغة',
  'بروفيسور نطق ولغة',
  'زميل جمعية ASHA',
]

const SPANISH_KEYWORDS = [
  'patología del habla y lenguaje',
  'terapia del habla',
  'terapia de lenguaje',
  'logopeda',
  'logopedia infantil',
  'trastornos del lenguaje',
  'trastornos de la comunicación',
  'terapia del habla autismo',
  'trastorno del espectro autista comunicación',
  'TDL trastorno del desarrollo del lenguaje',
  'disartria infantil',
  'terapia de fluidez tartamudez',
  'trastorno fonológico',
  'terapia bilingüe',
  'patólogo del habla',
  'especialista en comunicación',
  'Dr Wael Al Dakroury',
  'terapia del habla Arabia Saudita',
  'terapia del habla EAU',
  'terapia del habla Egipto',
]

export const GLOBAL_KEYWORDS = [...ENGLISH_KEYWORDS, ...ARABIC_KEYWORDS, ...SPANISH_KEYWORDS]

const DEFAULT_DESCRIPTION =
  'Dr. Wael A. Al-Dakroury — ASHA Fellow (F-ASHA), CCC-SLP, bilingual speech-language pathologist, professor & international leader in communication sciences. Expert care for autism, ADHD, language disorders, stuttering & speech sound disorders. Serving families in the USA, Canada, Saudi Arabia, GCC & Middle East. English, Arabic & Spanish-speaking families welcome.'

const PAGE_SEO = {
  '/': {
    title: 'Dr. Wael Al-Dakroury | ASHA Fellow Speech-Language Pathologist & Professor',
    description: DEFAULT_DESCRIPTION,
    keywords: [
      ...GLOBAL_KEYWORDS,
      'best speech therapist',
      'international speech pathologist',
      'ASHA International Ambassador',
    ],
  },
  '/about-me': {
    title: 'About Dr. Wael Al-Dakroury | ASHA Fellow, Professor & SLP Leader',
    description:
      'Biography of Dr. Wael A. Al-Dakroury — Ph.D., CCC-SLP, ASHA Fellow, Associate Professor, Director of Communication Disorders. 30+ years in speech-language pathology, ASHA SIG17 Chief Editor, IALP committee member, honorary president EACSL.',
    keywords: [
      ...GLOBAL_KEYWORDS,
      'ASHA Fellow biography',
      'speech pathology professor',
      'Queen Margaret University PhD',
      'San Jose State University SLP',
      'Alfaisal University professor',
      'Psych Care Complex Riyadh',
      'IALP child language committee',
      'EACSL honorary president',
    ],
  },
  '/services': {
    title: 'Speech & Language Therapy Services | Autism, ADHD, DLD & More — Dr. Wael Al-Dakroury',
    description:
      'Evidence-based speech & language therapy for autism (ASD), ADHD, developmental language disorder (DLD), speech sound disorders, stuttering, pragmatic communication & global developmental delay. Screening, assessment, therapy, family training & professional workshops. Bilingual English & Arabic.',
    keywords: [
      ...GLOBAL_KEYWORDS,
      'speech therapy services',
      'language assessment children',
      'autism speech therapy services',
      'parent coaching speech therapy',
      'family training communication',
      'professional SLP workshops',
      'school age language therapy',
      'clinical supervision SLP',
    ],
  },
  '/video-gallery': {
    title: 'Videos & Gallery | Dr. Wael Al-Dakroury — Lectures, Ceremonies & Clinical Highlights',
    description:
      'Watch Dr. Wael Al-Dakroury in lectures, ASHA conferences, award ceremonies & clinical settings. Video library and photo gallery showcasing decades of contribution to speech-language pathology worldwide.',
    keywords: [
      ...GLOBAL_KEYWORDS,
      'speech pathology lectures',
      'ASHA conference videos',
      'autism research award',
      'SLP professional videos',
      'communication sciences gallery',
    ],
  },
  '/in-the-field': {
    title: 'In the Field | Dr. Wael Al-Dakroury — Conferences, ASHA & Global SLP Leadership',
    description:
      'Dr. Wael Al-Dakroury\'s global engagements — ASHA panels, university lectures, international conferences, leadership meetings & professional training across the USA, Canada, Saudi Arabia, GCC, Egypt & the Middle East.',
    keywords: [
      ...GLOBAL_KEYWORDS,
      'ASHA Connect',
      'international SLP speaker',
      'speech pathology conference',
      'university guest lecture SLP',
      'global communication sciences',
      'professional development SLP',
    ],
  },
  '/contact': {
    title: 'Contact Dr. Wael Al-Dakroury | Book Speech & Language Consultation',
    description:
      'Contact Dr. Wael A. Al-Dakroury for speech & language consultation, professional speaking, clinical supervision & family appointments. Reach via phone, email or contact form. English & Arabic. Serving USA, Canada, Saudi Arabia, UAE, Qatar, Bahrain, Oman, Egypt, Jordan & Kuwait.',
    keywords: [
      ...GLOBAL_KEYWORDS,
      'book speech therapy consultation',
      'contact speech language pathologist',
      'SLP appointment Riyadh',
      'speech therapy inquiry',
      'professional consultation SLP',
    ],
  },
}

export const PUBLIC_ROUTES = Object.keys(PAGE_SEO)

function absoluteUrl(path = '/') {
  if (path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path}`
}

function joinKeywords(keywords) {
  return [...new Set(keywords)].join(', ')
}

export function getPageSeo(pathname) {
  const path = pathname === '/cases' ? '/services' : pathname
  const config = PAGE_SEO[path] ?? PAGE_SEO['/']

  return {
    path,
    canonical: absoluteUrl(path === '/' ? '/' : path),
    title: config.title,
    description: config.description,
    keywords: joinKeywords(config.keywords),
    image: absoluteUrl('/images/dr-wael.jpeg'),
    locale: 'en_US',
    alternateLocales: ['ar_SA', 'es_ES', 'en_CA'],
  }
}

function buildSameAs() {
  return Object.values(site.social).filter((url) => url && !url.endsWith('/'))
}

function buildMedicalConditions() {
  return clinicalExpertise.areas.map((area) => area.name)
}

export function buildJsonLd(pathname) {
  const seo = getPageSeo(pathname)
  const phoneTel = site.phone.replace(/\s/g, '')

  const person = {
    '@type': ['Person', 'Physician'],
    '@id': `${SITE_URL}/#person`,
    name: site.name,
    alternateName: NAME_VARIANTS,
    givenName: 'Wael',
    familyName: 'Al-Dakroury',
    honorificPrefix: 'Dr.',
    jobTitle: site.title,
    description: profileDetails.bio[0],
    url: `${SITE_URL}/`,
    image: seo.image,
    email: site.email,
    telephone: phoneTel,
    knowsLanguage: ['English', 'Arabic', 'Spanish'],
    nationality: {
      '@type': 'Country',
      name: 'Saudi Arabia',
    },
    alumniOf: profileDetails.education.map((entry) => ({
      '@type': 'EducationalOrganization',
      name: entry.includes('—') ? entry.split('—')[1].trim() : entry,
    })),
    award: profileDetails.credentials.filter((c) => c.includes('ASHA')),
    memberOf: profileDetails.roles.map((role) => ({
      '@type': 'Organization',
      name: role.split('—').pop()?.trim() || role,
    })),
    medicalSpecialty: 'Speech-Language Pathology',
    knowsAbout: buildMedicalConditions(),
    areaServed: TARGET_COUNTRIES.map((name) => ({
      '@type': 'Country',
      name,
    })),
    sameAs: buildSameAs(),
    worksFor: [
      {
        '@type': 'Organization',
        name: 'Psych Care Complex',
        address: { '@type': 'PostalAddress', addressLocality: 'Riyadh', addressCountry: 'SA' },
      },
      {
        '@type': 'Organization',
        name: 'Alfaisal University',
        address: { '@type': 'PostalAddress', addressLocality: 'Riyadh', addressCountry: 'SA' },
      },
    ],
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: site.name,
    description: DEFAULT_DESCRIPTION,
    inLanguage: ['en', 'ar', 'es'],
    publisher: { '@id': `${SITE_URL}/#person` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const practice = {
    '@type': 'MedicalBusiness',
    '@id': `${SITE_URL}/#practice`,
    name: `${site.name} — Speech & Language Services`,
    description: casesWeServe.intro,
    url: `${SITE_URL}/services`,
    image: seo.image,
    telephone: phoneTel,
    email: site.email,
    medicalSpecialty: 'Speech-Language Pathology',
    availableLanguage: ['English', 'Arabic', 'Spanish'],
    areaServed: TARGET_COUNTRIES.map((name) => ({
      '@type': 'Country',
      name,
    })),
    founder: { '@id': `${SITE_URL}/#person` },
    parentOrganization: { '@id': `${SITE_URL}/#person` },
  }

  const breadcrumbItems = buildBreadcrumbs(seo.path)

  const webPage = {
    '@type': 'WebPage',
    '@id': `${seo.canonical}#webpage`,
    url: seo.canonical,
    name: seo.title,
    description: seo.description,
    inLanguage: 'en',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    primaryImageOfPage: { '@type': 'ImageObject', url: seo.image },
  }

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${seo.canonical}#breadcrumb`,
    itemListElement: breadcrumbItems,
  }

  const graph = [website, person, practice, webPage, breadcrumb]

  if (seo.path === '/services') {
    graph.push({
      '@type': 'MedicalWebPage',
      '@id': `${seo.canonical}#medical`,
      url: seo.canonical,
      name: seo.title,
      description: seo.description,
      about: buildMedicalConditions().map((name) => ({
        '@type': 'MedicalCondition',
        name,
      })),
      lastReviewed: '2026-06-23',
      reviewedBy: { '@id': `${SITE_URL}/#person` },
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

function buildBreadcrumbs(path) {
  const items = [{ name: 'Home', path: '/' }]

  const labels = {
    '/about-me': 'About Me',
    '/services': 'Services',
    '/video-gallery': 'Video & Gallery',
    '/in-the-field': 'In the Field',
    '/contact': 'Contact',
  }

  if (path !== '/' && labels[path]) {
    items.push({ name: labels[path], path })
  }

  return items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  }))
}
