import {
  SITE_ACADEMIC,
  SITE_EMAIL,
  SITE_IMAGE_PATH,
  SITE_JOB_TITLE,
  SITE_LANGUAGES,
  SITE_NAME,
  SITE_PHONE,
  SITE_SOCIAL,
  SITE_URL,
  toTelHref,
} from '../data/siteIdentity.js'

export { SITE_URL }

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
  'Dr. Wael A. El-Dakroury',
  'Dr. Wael El-Dakroury',
  'Dr Wael El Dakroury',
  'Wael El-Dakroury',
  'Wael Eldakroury',
  'Dr. Wael Eldakroury',
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

const CLINICAL_AREAS = [
  'Developmental Language Disorder',
  'Speech Sound Disorders',
  'Autism Spectrum Disorder',
  'Childhood Stuttering & Fluency Disorders',
  'Social Communication & Pragmatic Language Disorders',
  'Bilingual & Multilingual Language Development',
  'Language Learning Difficulties',
  'School-Age Language & Literacy Challenges',
  'Parent Coaching & Family Training',
]

const THERAPY_SERVICES = [
  'Screening',
  'Family Counseling',
  'Assessment',
  'Therapy',
  'Family Training',
  'Professional Training',
]

const CONDITIONS_TREATED = [
  'Autism Spectrum Disorder',
  'Attention Deficit Hyperactivity Disorder',
  'Intellectual Developmental Disorder',
  'Specific Learning Disorder',
  'Global Developmental Delay',
  'Social (Pragmatic) Communication Disorder',
]

const EDUCATION = [
  'PhD — Queen Margaret University, Edinburgh',
  'MA — San Jose State University, California',
]

const ROLES = [
  'Director, Communication Disorders Dept. — Psych Care Complex, Riyadh',
  'Associate Professor, Faculty of Medicine — Alfaisal University, Riyadh',
  'ASHA International SLP Ambassador (2024–2026)',
  'Chief Editor, ASHA SIG17 Perspectives (2026–2028)',
  'Member, IALP Child Language Committee (2025–2031)',
  'Honorary President — EACSL (Egyptian Association for Comm. Sciences)',
  'Editorial Board, JSLHR Language Section (2023–2025)',
]

const CREDENTIALS = ['Ph.D.', 'CCC-SLP', 'ASHA Fellow (F-ASHA)']

const PERSON_BIO =
  'Dr. Wael is an internationally recognized speech-language pathologist with 30+ years of experience. He directs the Communication Disorders Department at Psych Care Complex, Riyadh, serves as Associate Professor at Alfaisal University, and was named ASHA Fellow.'

const PERSON_BIO_EXTENDED = [
  PERSON_BIO,
  'Named ASHA Fellow (F-ASHA) — one of the highest honors awarded by the American Speech-Language-Hearing Association — he is also a clinical educator in graduate Speech-Language Pathology programs.',
  'He offers bilingual care in English and Arabic, specializing in autism, ADHD, language disorders, speech sound disorders, and fluency, with evidence-based, family-centered support at every step.',
  'As an international speaker, consultant, and professional mentor, he collaborates with universities, healthcare organizations, and professional associations worldwide — advancing communication sciences through clinical excellence, education, and leadership.',
]

const SERVICES_INTRO =
  'Our speech-language services are here to help your child express themselves clearly and confidently—at home, in school, and in everyday life.'

const CASES_INTRO =
  "Evidence-based assessment and intervention, informed by cultural and linguistic awareness and tailored to each child's individual communication needs. We provide comprehensive speech-language pathology services for children with a wide range of communication disorders in both English and Arabic."

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about-me', label: 'About Dr. Wael' },
  { href: '/services', label: 'Bilingual Speech-Language Pathology Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/in-the-field', label: 'In the Field' },
  { href: '/contact', label: 'Contact' },
]

const BREADCRUMB_LABELS = {
  '/about-me': 'About Me',
  '/services': 'Services',
  '/gallery': 'Gallery',
  '/in-the-field': 'In the Field',
  '/contact': 'Contact',
}

const PATH_ALIASES = {
  '/cases': '/services',
  '/video-gallery': '/gallery',
}

export const PAGE_SEO = {
  '/': {
    title: 'Dr. Wael Al-Dakroury | ASHA Fellow Speech-Language Pathologist & Professor',
    description:
      'Official website of Dr. Wael A. Al-Dakroury — ASHA Fellow (F-ASHA), CCC-SLP, bilingual speech-language pathologist, associate professor, and international leader in communication sciences. Learn about his work, clinical services, and how to book a consultation.',
    keywords: [
      ...GLOBAL_KEYWORDS,
      'best speech therapist',
      'international speech pathologist',
      'ASHA International Ambassador',
    ],
    changefreq: 'weekly',
    priority: '1.0',
    crawler: {
      heading: 'Dr. Wael A. Al-Dakroury — Speech-Language Pathologist & ASHA Fellow',
      paragraphs: [
        `${SITE_JOB_TITLE}. Official website of Dr. Wael A. Al-Dakroury, offering bilingual speech-language pathology care in English and Arabic for children and families.`,
        PERSON_BIO,
        'He specializes in autism, ADHD, language disorders, speech sound disorders, and fluency, with evidence-based, family-centered support. Families in the United States, Canada, Saudi Arabia, UAE, Qatar, Bahrain, Oman, Egypt, Jordan, and Kuwait are welcome.',
      ],
    },
  },
  '/about-me': {
    title: 'About Dr. Wael Al-Dakroury | Biography, Credentials & Experience',
    description:
      'Biography of Dr. Wael A. Al-Dakroury — Ph.D., CCC-SLP, ASHA Fellow, Associate Professor at Alfaisal University, and Director of the Communication Disorders Department at Psych Care Complex, Riyadh. Education, credentials, leadership roles, and 30+ years of clinical and academic experience.',
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
    changefreq: 'monthly',
    priority: '0.9',
    crawler: {
      heading: 'About Dr. Wael A. Al-Dakroury',
      paragraphs: PERSON_BIO_EXTENDED,
      lists: [
        { title: 'Credentials', items: CREDENTIALS },
        { title: 'Education', items: EDUCATION },
        { title: 'Professional roles', items: ROLES },
      ],
    },
  },
  '/services': {
    title: 'Speech & Language Therapy Services | Dr. Wael Al-Dakroury',
    description:
      'Bilingual speech-language pathology services from Dr. Wael Al-Dakroury: screening, assessment, therapy, family counseling, family training, and professional workshops. Clinical care for autism, ADHD, DLD, speech sound disorders, stuttering, pragmatic communication, and related childhood communication needs.',
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
    changefreq: 'monthly',
    priority: '0.95',
    crawler: {
      heading: 'Bilingual Speech-Language Pathology Services',
      paragraphs: [SERVICES_INTRO, CASES_INTRO],
      lists: [
        { title: 'Clinical services', items: THERAPY_SERVICES },
        { title: 'Conditions we understand and treat', items: CONDITIONS_TREATED },
      ],
    },
  },
  '/gallery': {
    title: 'Gallery | Dr. Wael Al-Dakroury — Lectures, Ceremonies & Clinical Highlights',
    description:
      'Video library and photo gallery from Dr. Wael Al-Dakroury’s lectures, ASHA conferences, award ceremonies, and clinical settings — snapshots from sessions, training, and professional events.',
    keywords: [
      ...GLOBAL_KEYWORDS,
      'speech pathology lectures',
      'ASHA conference videos',
      'autism research award',
      'SLP professional videos',
      'communication sciences gallery',
    ],
    changefreq: 'weekly',
    priority: '0.8',
    crawler: {
      heading: 'Gallery — Insights and Moments from Practice',
      paragraphs: [
        'Photos from clinical work, training sessions, and professional events, plus videos from lectures, conferences, and award ceremonies featuring Dr. Wael Al-Dakroury.',
      ],
    },
  },
  '/in-the-field': {
    title: 'In the Field | Dr. Wael Al-Dakroury — Conferences, ASHA & Global SLP Leadership',
    description:
      'Global engagements of Dr. Wael Al-Dakroury — conferences, university lectures, ASHA panels, leadership meetings, and professional training across the USA, Canada, Saudi Arabia, GCC, Egypt, and the Middle East.',
    keywords: [
      ...GLOBAL_KEYWORDS,
      'ASHA Connect',
      'international SLP speaker',
      'speech pathology conference',
      'university guest lecture SLP',
      'global communication sciences',
      'professional development SLP',
    ],
    changefreq: 'weekly',
    priority: '0.8',
    crawler: {
      heading: 'In the Field — Conferences, Lectures & Global Leadership',
      paragraphs: [
        'Conferences, lectures, meetings, and professional engagements: a snapshot of where Dr. Wael is contributing now and highlights from recent months.',
        'Current and recent leadership roles include ASHA Fellow (F-ASHA), Editor of Perspectives SIG 17, ASHA International Ambassador, Member of the IALP Child Language Committee, and recipient of the ASHA Certificate of Recognition for International Achievement.',
      ],
    },
  },
  '/contact': {
    title: 'Contact Dr. Wael Al-Dakroury | Book a Speech & Language Consultation',
    description:
      'Contact Dr. Wael A. Al-Dakroury to book a speech and language consultation, ask a question, or inquire about professional speaking, clinical supervision, or family appointments. Reach the practice by phone, email, or the contact form.',
    keywords: [
      ...GLOBAL_KEYWORDS,
      'book speech therapy consultation',
      'contact speech language pathologist',
      'SLP appointment Riyadh',
      'speech therapy inquiry',
      'professional consultation SLP',
    ],
    changefreq: 'monthly',
    priority: '0.85',
    crawler: {
      heading: 'Contact Dr. Wael A. Al-Dakroury',
      paragraphs: [
        'Parents, colleagues, and institutions are welcome. Reach out to book a session or ask a question.',
        `Email: ${SITE_EMAIL}. Phone: ${SITE_PHONE}.`,
        'Psych Care Complex — Communication Disorders Department, Riyadh, Saudi Arabia.',
      ],
    },
  },
}

export const PUBLIC_ROUTES = Object.keys(PAGE_SEO)

export function absoluteUrl(path = '/') {
  if (path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path}`
}

export function resolvePublicPath(pathname) {
  const raw = pathname === '/cases' || pathname === '/video-gallery' ? PATH_ALIASES[pathname] : pathname
  return raw === '/' || !raw ? '/' : raw.replace(/\/+$/, '') || '/'
}

export function isPublicPath(pathname) {
  return Boolean(PAGE_SEO[resolvePublicPath(pathname)])
}

function joinKeywords(keywords) {
  return [...new Set(keywords)].join(', ')
}

export function getPageSeo(pathname) {
  const path = resolvePublicPath(pathname)
  const config = PAGE_SEO[path]

  if (!config) {
    return {
      path,
      isNotFound: true,
      canonical: absoluteUrl(path),
      title: 'Page not found | Dr. Wael Al-Dakroury',
      description: 'This page does not exist on the official website of Dr. Wael A. Al-Dakroury.',
      keywords: '',
      image: absoluteUrl(SITE_IMAGE_PATH),
      locale: 'en_US',
      alternateLocales: ['ar_SA', 'es_ES', 'en_CA'],
      robots: 'noindex, nofollow',
    }
  }

  return {
    path,
    isNotFound: false,
    canonical: absoluteUrl(path),
    title: config.title,
    description: config.description,
    keywords: joinKeywords(config.keywords),
    image: absoluteUrl(SITE_IMAGE_PATH),
    locale: 'en_US',
    alternateLocales: ['ar_SA', 'es_ES', 'en_CA'],
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    changefreq: config.changefreq,
    priority: config.priority,
  }
}

function cleanProfileUrl(url) {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'mibextid', 's', 't', 'invite', 'ev'].forEach(
      (param) => parsed.searchParams.delete(param),
    )
    const search = parsed.searchParams.toString()
    return `${parsed.origin}${parsed.pathname}${search ? `?${search}` : ''}`.replace(/\/$/, '')
  } catch {
    return url
  }
}

function buildSameAs() {
  return [
    ...Object.values(SITE_SOCIAL),
    SITE_ACADEMIC.googleScholar,
    SITE_ACADEMIC.researchGate,
    SITE_ACADEMIC.orcid,
  ]
    .map(cleanProfileUrl)
    .filter(Boolean)
}

function buildBreadcrumbs(path) {
  const items = [{ name: 'Home', path: '/' }]

  if (path !== '/' && BREADCRUMB_LABELS[path]) {
    items.push({ name: BREADCRUMB_LABELS[path], path })
  }

  return items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  }))
}

export function buildJsonLd(pathname, contact = {}) {
  const seo = getPageSeo(pathname)
  const phone = String(contact.phone || SITE_PHONE).trim() || SITE_PHONE
  const email = String(contact.email || SITE_EMAIL).trim() || SITE_EMAIL
  const phoneTel = toTelHref(phone)
  const areaServed = TARGET_COUNTRIES.map((name) => ({
    '@type': 'Country',
    name,
  }))

  const person = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: SITE_NAME,
    alternateName: NAME_VARIANTS,
    givenName: 'Wael',
    familyName: 'Al-Dakroury',
    honorificPrefix: 'Dr.',
    jobTitle: SITE_JOB_TITLE,
    description: PERSON_BIO,
    url: `${SITE_URL}/`,
    image: seo.image,
    email,
    telephone: phoneTel,
    knowsLanguage: SITE_LANGUAGES,
    nationality: {
      '@type': 'Country',
      name: 'Saudi Arabia',
    },
    alumniOf: EDUCATION.map((entry) => ({
      '@type': 'EducationalOrganization',
      name: entry.includes('—') ? entry.split('—')[1].trim() : entry,
    })),
    award: CREDENTIALS.filter((credential) => credential.includes('ASHA')),
    memberOf: ROLES.map((role) => ({
      '@type': 'Organization',
      name: role.split('—').pop()?.trim() || role,
    })),
    knowsAbout: CLINICAL_AREAS,
    areaServed,
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
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: phoneTel,
      email,
      availableLanguage: SITE_LANGUAGES,
      url: `${SITE_URL}/contact`,
    },
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: PAGE_SEO['/'].description,
    inLanguage: ['en', 'ar', 'es'],
    publisher: { '@id': `${SITE_URL}/#person` },
  }

  const practice = {
    '@type': 'MedicalBusiness',
    '@id': `${SITE_URL}/#practice`,
    name: `${SITE_NAME} — Bilingual Speech-Language Pathology Services`,
    description: CASES_INTRO,
    url: `${SITE_URL}/services`,
    image: seo.image,
    telephone: phoneTel,
    email,
    availableLanguage: SITE_LANGUAGES,
    areaServed,
    founder: { '@id': `${SITE_URL}/#person` },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: phoneTel,
      email,
      availableLanguage: SITE_LANGUAGES,
      url: `${SITE_URL}/contact`,
    },
  }

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
    itemListElement: buildBreadcrumbs(seo.path),
  }

  const graph = [website, person, practice, webPage, breadcrumb]

  if (seo.path === '/about-me') {
    graph.push({
      '@type': 'ProfilePage',
      '@id': `${seo.canonical}#profile`,
      url: seo.canonical,
      name: seo.title,
      description: seo.description,
      mainEntity: { '@id': `${SITE_URL}/#person` },
    })
  }

  if (seo.path === '/services') {
    graph.push({
      '@type': 'MedicalWebPage',
      '@id': `${seo.canonical}#medical`,
      url: seo.canonical,
      name: seo.title,
      description: seo.description,
      about: CONDITIONS_TREATED.map((name) => ({
        '@type': 'MedicalCondition',
        name,
      })),
      lastReviewed: '2026-08-12',
      reviewedBy: { '@id': `${SITE_URL}/#person` },
    })
  }

  if (seo.path === '/contact') {
    graph.push({
      '@type': 'ContactPage',
      '@id': `${seo.canonical}#contact`,
      url: seo.canonical,
      name: seo.title,
      description: seo.description,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function renderList(list) {
  const items = list.items.map((item) => `            <li>${escapeHtml(item)}</li>`).join('\n')
  return `          <h2>${escapeHtml(list.title)}</h2>
          <ul>
${items}
          </ul>`
}

export function renderCrawlerNoscript(pathname) {
  const path = resolvePublicPath(pathname)
  const page = PAGE_SEO[path] ?? PAGE_SEO['/']
  const seo = getPageSeo(path)
  const lists = page.crawler.lists?.map(renderList).join('\n') ?? ''
  const paragraphs = page.crawler.paragraphs
    .map((paragraph) => `        <p>${escapeHtml(paragraph)}</p>`)
    .join('\n')
  const nav = NAV_LINKS.map((link) => `          <a href="${link.href}">${escapeHtml(link.label)}</a>`).join(' |\n')

  return `      <header>
        <h1>${escapeHtml(page.crawler.heading)}</h1>
${paragraphs}
${lists}
        <p>
          Official website: <a href="${SITE_URL}/">${SITE_URL}/</a>.
          This page: <a href="${escapeHtml(seo.canonical)}">${escapeHtml(seo.canonical)}</a>.
          Contact: <a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a>,
          <a href="tel:${toTelHref(SITE_PHONE)}">${SITE_PHONE}</a>.
        </p>
        <nav aria-label="Site navigation">
${nav}
        </nav>
      </header>`
}
