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
  'د. وائل الدكروري السعودية',
  'دكتور وائل الدكروري السعودية',
  'دكتور وائل الدكروري الرياض',
  'وائل الدكروري الرياض',
  'وائل الدكروري السعودية',
]

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

const PERSON_BIO_AR =
  'الدكتور وائل الدكروري أخصائي نطق ولغة معترف به دولياً بخبرة تزيد عن 30 عاماً. يدير قسم اضطرابات التواصل في مجمع العناية النفسية بالرياض، ويعمل أستاذاً مشاركاً في جامعة الفيصل، وهو زميل جمعية ASHA.'

const PERSON_BIO_EXTENDED = [
  PERSON_BIO,
  PERSON_BIO_AR,
  'Named ASHA Fellow (F-ASHA) — one of the highest honors awarded by the American Speech-Language-Hearing Association — he is also a clinical educator in graduate Speech-Language Pathology programs.',
  'He offers bilingual care in English and Arabic, specializing in autism, ADHD, language disorders, speech sound disorders, and fluency, with evidence-based, family-centered support at every step.',
  'يقدم رعاية ثنائية اللغة بالعربية والإنجليزية، مع تخصص في التوحد واضطراب فرط الحركة وتشتت الانتباه واضطرابات اللغة والنطق والطلاقة، بدعم قائم على الأدلة وموجه للأسرة.',
  'As an international speaker, consultant, and professional mentor, he collaborates with universities, healthcare organizations, and professional associations worldwide — advancing communication sciences through clinical excellence, education, and leadership.',
]

const HOME_TITLE =
  'دكتور وائل الدكروري | Dr. Wael Al-Dakroury — ASHA Fellow Speech-Language Pathologist'
const HOME_DESCRIPTION =
  'الموقع الرسمي للدكتور وائل الدكروري (السعودية / الرياض) — زميل ASHA، أخصائي نطق ولغة واستاذ مشارك. Official website of Dr. Wael A. Al-Dakroury — ASHA Fellow (F-ASHA), CCC-SLP, bilingual speech-language pathologist and associate professor in Riyadh, Saudi Arabia.'

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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    keywords: [
      'دكتور وائل الدكروري',
      'Dr Wael Al Dakroury',
      'speech language pathologist',
      'ASHA Fellow',
      'علاج النطق واللغة',
      'أخصائي نطق ولغة الرياض',
      'bilingual SLP',
      'Riyadh speech therapy',
    ],
    changefreq: 'weekly',
    priority: '1.0',
    crawler: {
      heading: 'دكتور وائل الدكروري | Dr. Wael A. Al-Dakroury — Speech-Language Pathologist & ASHA Fellow',
      paragraphs: [
        `${SITE_JOB_TITLE}. Official website of Dr. Wael A. Al-Dakroury, offering bilingual speech-language pathology care in English and Arabic for children and families.`,
        PERSON_BIO,
        PERSON_BIO_AR,
        'He specializes in autism, ADHD, language disorders, speech sound disorders, and fluency, with evidence-based, family-centered support. Families in the United States, Canada, Saudi Arabia, UAE, Qatar, Bahrain, Oman, Egypt, Jordan, and Kuwait are welcome.',
        'يتخصص في التوحد واضطرابات اللغة والنطق والطلاقة، ويخدم العائلات في السعودية والخليج والولايات المتحدة وكندا ومصر والأردن.',
      ],
    },
  },
  '/about-me': {
    title: 'عن الدكتور وائل الدكروري | About Dr. Wael Al-Dakroury — Biography & Credentials',
    description:
      'السيرة الذاتية للدكتور وائل الدكروري — زميل ASHA، أستاذ مشارك في جامعة الفيصل، ومدير قسم اضطرابات التواصل في مجمع العناية النفسية بالرياض، السعودية. Biography, credentials, education, and 30+ years of clinical and academic experience.',
    keywords: [
      'دكتور وائل الدكروري',
      'ASHA Fellow biography',
      'Alfaisal University professor',
      'Psych Care Complex Riyadh',
      'سيرة الدكتور وائل الدكروري',
      'Queen Margaret University PhD',
      'CCC-SLP',
      'speech pathology professor',
    ],
    changefreq: 'monthly',
    priority: '0.9',
    crawler: {
      heading: 'عن الدكتور وائل الدكروري | About Dr. Wael A. Al-Dakroury',
      paragraphs: PERSON_BIO_EXTENDED,
      lists: [
        { title: 'Credentials / المؤهلات', items: CREDENTIALS },
        { title: 'Education / التعليم', items: EDUCATION },
        { title: 'Professional roles / المناصب المهنية', items: ROLES },
      ],
    },
  },
  '/services': {
    title: 'خدمات علاج النطق واللغة | Speech Therapy Services — Dr. Wael Al-Dakroury',
    description:
      'خدمات علاج النطق واللغة ثنائية اللغة مع الدكتور وائل الدكروري في الرياض والسعودية: تقييم، علاج، إرشاد أسري، وتدريب مهني. Bilingual speech-language pathology services: screening, assessment, therapy, family counseling, family training, and professional workshops for autism, ADHD, DLD, speech sound disorders, stuttering, and pragmatic communication.',
    keywords: [
      'خدمات علاج النطق الرياض',
      'speech therapy services',
      'autism speech therapy',
      'ADHD language therapy',
      'family counseling SLP',
      'bilingual speech therapy',
      'developmental language disorder',
      'علاج النطق الرياض',
    ],
    changefreq: 'monthly',
    priority: '0.95',
    crawler: {
      heading: 'خدمات علاج النطق واللغة | Bilingual Speech-Language Pathology Services',
      paragraphs: [
        SERVICES_INTRO,
        CASES_INTRO,
        'نقدم خدمات تقييم وعلاج اضطرابات التواصل للأطفال باللغة العربية والإنجليزية، مع دعم موجّه للأسرة في السعودية والخليج.',
      ],
      lists: [
        { title: 'Clinical services / الخدمات السريرية', items: THERAPY_SERVICES },
        { title: 'Conditions we understand and treat / الحالات التي نتعامل معها', items: CONDITIONS_TREATED },
      ],
    },
  },
  '/gallery': {
    title: 'المعرض | Gallery — Dr. Wael Al-Dakroury Lectures & Clinical Highlights',
    description:
      'معرض صور وفيديو للدكتور وائل الدكروري من محاضرات ومؤتمرات ASHA وفعاليات مهنية. Video library and photo gallery from lectures, ASHA conferences, award ceremonies, and clinical settings.',
    keywords: [
      'Dr Wael Al Dakroury gallery',
      'ASHA conference videos',
      'speech pathology lectures',
      'معرض الدكتور وائل الدكروري',
      'SLP professional videos',
      'clinical highlights',
    ],
    changefreq: 'weekly',
    priority: '0.8',
    crawler: {
      heading: 'المعرض | Gallery — Insights and Moments from Practice',
      paragraphs: [
        'Photos from clinical work, training sessions, and professional events, plus videos from lectures, conferences, and award ceremonies featuring Dr. Wael Al-Dakroury.',
        'صور ومقاطع من العمل السريري والتدريب والمؤتمرات المهنية للدكتور وائل الدكروري.',
      ],
    },
  },
  '/in-the-field': {
    title: 'في الميدان | In the Field — Dr. Wael Al-Dakroury Global SLP Leadership',
    description:
      'مشاركات الدكتور وائل الدكروري العالمية — مؤتمرات ومحاضرات وقيادة مهنية في السعودية والخليج والولايات المتحدة وكندا ومصر. Global engagements: conferences, university lectures, ASHA panels, leadership meetings, and professional training.',
    keywords: [
      'ASHA International Ambassador',
      'international SLP speaker',
      'speech pathology conference',
      'في الميدان وائل الدكروري',
      'university guest lecture SLP',
      'global communication sciences',
    ],
    changefreq: 'weekly',
    priority: '0.8',
    crawler: {
      heading: 'في الميدان | In the Field — Conferences, Lectures & Global Leadership',
      paragraphs: [
        'Conferences, lectures, meetings, and professional engagements: a snapshot of where Dr. Wael is contributing now and highlights from recent months.',
        'Current and recent leadership roles include ASHA Fellow (F-ASHA), Editor of Perspectives SIG 17, ASHA International Ambassador, Member of the IALP Child Language Committee, and recipient of the ASHA Certificate of Recognition for International Achievement.',
        'يشمل نشاطه الميداني مؤتمرات ومحاضرات واجتماعات قيادية في السعودية والخليج والولايات المتحدة وكندا ومصر والشرق الأوسط.',
      ],
    },
  },
  '/contact': {
    title: 'تواصل مع الدكتور وائل الدكروري | Contact Dr. Wael Al-Dakroury',
    description:
      'تواصل مع الدكتور وائل الدكروري عبر الهاتف أو البريد أو نموذج طلب الموعد — الرياض، السعودية. Contact Dr. Wael A. Al-Dakroury by phone, email, or the on-page appointment request form for consultation, speaking, clinical supervision, or family appointments.',
    keywords: [
      'تواصل الدكتور وائل الدكروري',
      'contact speech language pathologist',
      'حجز موعد نطق ولغة الرياض',
      'SLP appointment Riyadh',
      'speech therapy inquiry',
      'book speech therapy consultation',
    ],
    changefreq: 'monthly',
    priority: '0.85',
    crawler: {
      heading: 'تواصل مع الدكتور وائل الدكروري | Contact Dr. Wael A. Al-Dakroury',
      paragraphs: [
        'Parents, colleagues, and institutions are welcome. Use the on-page appointment request form, or reach out by phone or email to book a session or ask a question.',
        'يسعد الدكتور وائل الدكروري باستقبال استفسارات الأهالي والزملاء والمؤسسات عبر نموذج طلب الموعد أو الهاتف أو البريد الإلكتروني.',
        `Email: ${SITE_EMAIL}. Phone: ${SITE_PHONE}.`,
        'Psych Care Complex — Communication Disorders Department, Riyadh, Saudi Arabia.',
        'مجمع العناية النفسية — قسم اضطرابات التواصل، الرياض، المملكة العربية السعودية.',
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
      alternateLocales: ['ar_SA'],
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
    alternateLocales: ['ar_SA'],
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
    description: `${PERSON_BIO} ${PERSON_BIO_AR}`,
    url: `${SITE_URL}/`,
    image: seo.image,
    email,
    telephone: phoneTel,
    knowsLanguage: SITE_LANGUAGES,
    nationality: {
      '@type': 'Country',
      name: 'Saudi Arabia',
    },
    homeLocation: {
      '@type': 'Place',
      name: 'Riyadh, Saudi Arabia',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Riyadh',
        addressCountry: 'SA',
      },
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
      areaServed: ['SA', 'AE', 'QA', 'BH', 'OM', 'KW', 'EG', 'JO', 'US', 'CA'],
      url: `${SITE_URL}/contact`,
    },
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: ['دكتور وائل الدكروري', 'الدكتور وائل الدكروري', 'Dr Wael Al Dakroury'],
    description: PAGE_SEO['/'].description,
    inLanguage: ['en', 'ar'],
    publisher: { '@id': `${SITE_URL}/#person` },
  }

  const practice = {
    '@type': 'MedicalBusiness',
    '@id': `${SITE_URL}/#practice`,
    name: `${SITE_NAME} — Bilingual Speech-Language Pathology Services`,
    alternateName: 'خدمات علاج النطق واللغة — الدكتور وائل الدكروري',
    description: CASES_INTRO,
    url: `${SITE_URL}/services`,
    image: seo.image,
    telephone: phoneTel,
    email,
    availableLanguage: SITE_LANGUAGES,
    areaServed,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Riyadh',
      addressCountry: 'SA',
    },
    founder: { '@id': `${SITE_URL}/#person` },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: phoneTel,
      email,
      availableLanguage: SITE_LANGUAGES,
      areaServed: ['SA', 'AE', 'QA', 'BH', 'OM', 'KW', 'EG', 'JO', 'US', 'CA'],
      url: `${SITE_URL}/contact`,
    },
  }

  const webPage = {
    '@type': 'WebPage',
    '@id': `${seo.canonical}#webpage`,
    url: seo.canonical,
    name: seo.title,
    description: seo.description,
    inLanguage: ['en', 'ar'],
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
    .map((paragraph) => {
      const isArabic = /[\u0600-\u06FF]/.test(paragraph)
      const attrs = isArabic ? ' lang="ar" dir="rtl"' : ''
      return `        <p${attrs}>${escapeHtml(paragraph)}</p>`
    })
    .join('\n')
  const nav = NAV_LINKS.map((link) => `          <a href="${link.href}">${escapeHtml(link.label)}</a>`).join(' |\n')
  const pageUrlLine =
    path === '/'
      ? `        <p>
          Contact: <a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a>,
          <a href="tel:${toTelHref(SITE_PHONE)}">${SITE_PHONE}</a>.
        </p>`
      : `        <p>
          Page: <a href="${escapeHtml(seo.canonical)}">${escapeHtml(seo.canonical)}</a>.
          Contact: <a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a>,
          <a href="tel:${toTelHref(SITE_PHONE)}">${SITE_PHONE}</a>.
        </p>`

  return `      <header>
        <h1>${escapeHtml(page.crawler.heading)}</h1>
${paragraphs}
${lists}
${pageUrlLine}
        <nav aria-label="Site navigation">
${nav}
        </nav>
      </header>`
}
