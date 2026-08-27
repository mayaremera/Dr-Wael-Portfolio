/**
 * After Vite build, write static HTML shells for each public route so crawlers
 * get correct title/description/canonical/JSON-LD without waiting on JS.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const indexPath = join(distDir, 'index.html')
const SITE_URL = 'https://drwaeldk.com'
const SITE_PHONE_DISPLAY = '+1 321-509-6224'
const SITE_PHONE_TEL = '+13215096224'
const SITE_EMAIL = 'info@drwaeldk.com'
const SITE_NAME = 'Dr. Wael A. Al-Dakroury'
const OG_IMAGE = `${SITE_URL}/images/dr-wael.jpeg`

const PAGE_SEO = {
  '/': {
    title: 'Dr. Wael Al-Dakroury | ASHA Fellow Speech-Language Pathologist & Professor',
    description:
      'Dr. Wael A. Al-Dakroury — ASHA Fellow (F-ASHA), CCC-SLP, bilingual speech-language pathologist, professor & international leader in communication sciences. Expert care for autism, ADHD, language disorders, stuttering & speech sound disorders. Serving families in the USA, Canada, Saudi Arabia, GCC & Middle East. English, Arabic & Spanish-speaking families welcome.',
    heading: 'Dr. Wael A. Al-Dakroury — Speech-Language Pathologist & ASHA Fellow',
    body:
      'Consultant bilingual speech-language pathologist and associate professor specializing in autism, ADHD, developmental language disorder, speech sound disorders, stuttering, and pragmatic communication. Serving families in the United States, Canada, Saudi Arabia, UAE, Qatar, Bahrain, Oman, Egypt, Jordan, and Kuwait.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  '/about-me': {
    title: 'About Dr. Wael Al-Dakroury | ASHA Fellow, Professor & SLP Leader',
    description:
      'Biography of Dr. Wael A. Al-Dakroury — Ph.D., CCC-SLP, ASHA Fellow, Associate Professor, Director of Communication Disorders. 30+ years in speech-language pathology, ASHA SIG17 Chief Editor, IALP committee member, honorary president EACSL.',
    heading: 'About Dr. Wael A. Al-Dakroury',
    body:
      'Learn about Dr. Wael A. Al-Dakroury’s biography, credentials, qualifications, and professional background as an ASHA Fellow (F-ASHA), CCC-SLP, associate professor, and international leader in speech-language pathology and communication sciences.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  '/services': {
    title: 'Speech & Language Therapy Services | Autism, ADHD, DLD & More — Dr. Wael Al-Dakroury',
    description:
      'Evidence-based speech & language therapy for autism (ASD), ADHD, developmental language disorder (DLD), speech sound disorders, stuttering, pragmatic communication & global developmental delay. Screening, assessment, therapy, family training & professional workshops. Bilingual English & Arabic.',
    heading: 'Bilingual Speech-Language Pathology Services',
    body:
      'Clinical services and areas of specialization with Dr. Wael A. Al-Dakroury, including screening, assessment, therapy, family training, and professional workshops for autism, ADHD, developmental language disorder, speech sound disorders, stuttering, and pragmatic communication.',
    priority: '0.95',
    changefreq: 'monthly',
  },
  '/gallery': {
    title: 'Gallery | Dr. Wael Al-Dakroury — Lectures, Ceremonies & Clinical Highlights',
    description:
      'Watch Dr. Wael Al-Dakroury in lectures, ASHA conferences, award ceremonies & clinical settings. Video library and photo gallery showcasing decades of contribution to speech-language pathology worldwide.',
    heading: 'Gallery — Lectures, Ceremonies & Clinical Highlights',
    body:
      'Video library and photo gallery featuring Dr. Wael Al-Dakroury in lectures, ASHA conferences, award ceremonies, and clinical settings.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  '/in-the-field': {
    title: 'In the Field | Dr. Wael Al-Dakroury — Conferences, ASHA & Global SLP Leadership',
    description:
      "Dr. Wael Al-Dakroury's global engagements — ASHA panels, university lectures, international conferences, leadership meetings & professional training across the USA, Canada, Saudi Arabia, GCC, Egypt & the Middle East.",
    heading: 'In the Field — Conferences & Global SLP Leadership',
    body:
      'Global professional engagements with Dr. Wael Al-Dakroury, including conferences, university lectures, leadership meetings, and training across the USA, Canada, Saudi Arabia, GCC, Egypt, and the Middle East.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  '/contact': {
    title: 'Contact Dr. Wael Al-Dakroury | Book Speech & Language Consultation',
    description:
      'Contact Dr. Wael A. Al-Dakroury for speech & language consultation, professional speaking, clinical supervision & family appointments. Reach via phone, email or contact form. English & Arabic. Serving USA, Canada, Saudi Arabia, UAE, Qatar, Bahrain, Oman, Egypt, Jordan & Kuwait.',
    heading: 'Contact Dr. Wael A. Al-Dakroury',
    body:
      'Contact Dr. Wael A. Al-Dakroury to book a speech and language consultation, ask a question, or arrange professional speaking and clinical supervision. Reach by phone, email, or contact form in English or Arabic.',
    priority: '0.85',
    changefreq: 'monthly',
  },
}

const PUBLIC_ROUTES = Object.keys(PAGE_SEO)

const BREADCRUMB_LABELS = {
  '/about-me': 'About Me',
  '/services': 'Services',
  '/gallery': 'Gallery',
  '/in-the-field': 'In the Field',
  '/contact': 'Contact',
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function absoluteUrl(path) {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

function replaceMetaByName(html, name, content) {
  const re = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*/?>`, 'i')
  const tag = `<meta name="${name}" content="${escapeHtml(content)}" />`
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function replaceMetaByProperty(html, property, content) {
  const re = new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]*"\\s*/?>`, 'i')
  const tag = `<meta property="${property}" content="${escapeHtml(content)}" />`
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function replaceLinkCanonical(html, href) {
  const re = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function replaceHreflang(html, href) {
  return html
    .replace(/hreflang="en" href="[^"]*"/g, `hreflang="en" href="${escapeHtml(href)}"`)
    .replace(/hreflang="ar" href="[^"]*"/g, `hreflang="ar" href="${escapeHtml(href)}"`)
    .replace(/hreflang="es" href="[^"]*"/g, `hreflang="es" href="${escapeHtml(href)}"`)
    .replace(/hreflang="x-default" href="[^"]*"/g, `hreflang="x-default" href="${escapeHtml(href)}"`)
}

function replaceTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
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

function buildJsonLd(path) {
  const seo = PAGE_SEO[path]
  const canonical = absoluteUrl(path)

  const person = {
    '@type': ['Person', 'Physician'],
    '@id': `${SITE_URL}/#person`,
    name: SITE_NAME,
    jobTitle: 'Consultant Bilingual Speech Language Pathologist & Associate Professor',
    url: `${SITE_URL}/`,
    image: OG_IMAGE,
    email: SITE_EMAIL,
    telephone: SITE_PHONE_TEL,
    knowsLanguage: ['English', 'Arabic', 'Spanish'],
    medicalSpecialty: 'Speech-Language Pathology',
    award: 'ASHA Fellow (F-ASHA)',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_PHONE_TEL,
      email: SITE_EMAIL,
      contactType: 'customer service',
      availableLanguage: ['English', 'Arabic', 'Spanish'],
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

  const webPage = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: seo.title,
    description: seo.description,
    inLanguage: 'en',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE },
  }

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: buildBreadcrumbs(path),
  }

  const graph = [website, person, webPage, breadcrumb]

  if (path === '/services') {
    graph.push({
      '@type': 'MedicalBusiness',
      '@id': `${SITE_URL}/#practice`,
      name: `${SITE_NAME} — Bilingual Speech-Language Pathology Services`,
      description: seo.description,
      url: `${SITE_URL}/services`,
      image: OG_IMAGE,
      telephone: SITE_PHONE_TEL,
      email: SITE_EMAIL,
      medicalSpecialty: 'Speech-Language Pathology',
      availableLanguage: ['English', 'Arabic', 'Spanish'],
      founder: { '@id': `${SITE_URL}/#person` },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: SITE_PHONE_TEL,
        email: SITE_EMAIL,
        contactType: 'customer service',
        availableLanguage: ['English', 'Arabic', 'Spanish'],
      },
    })
  }

  if (path === '/contact') {
    graph.push({
      '@type': 'ContactPage',
      '@id': `${canonical}#contact`,
      url: canonical,
      name: seo.title,
      description: seo.description,
      mainEntity: { '@id': `${SITE_URL}/#person` },
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

function replaceJsonLd(html, path) {
  const json = JSON.stringify(buildJsonLd(path), null, 2)
  const tag = `    <script type="application/ld+json">\n${json}\n    </script>`
  const re = /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i
  if (re.test(html)) return html.replace(re, tag)
  return html.replace('</head>', `${tag}\n  </head>`)
}

function replaceNoscript(html, path) {
  const seo = PAGE_SEO[path]
  const canonical = absoluteUrl(path)
  const noscript = `    <noscript>
      <header>
        <h1>${escapeHtml(seo.heading)}</h1>
        <p>${escapeHtml(seo.body)}</p>
        <p>${escapeHtml(seo.description)}</p>
        <p>
          Official website: <a href="${escapeHtml(canonical)}">${escapeHtml(canonical)}</a>.
          Contact: <a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a>,
          <a href="tel:${SITE_PHONE_TEL}">${SITE_PHONE_DISPLAY}</a>.
        </p>
        <nav aria-label="Site navigation">
          <a href="/">Home</a> |
          <a href="/about-me">About Dr. Wael</a> |
          <a href="/services">Bilingual Speech-Language Pathology Services</a> |
          <a href="/gallery">Gallery</a> |
          <a href="/in-the-field">In the Field</a> |
          <a href="/contact">Contact</a>
        </nav>
      </header>
    </noscript>`

  const re = /<noscript>[\s\S]*?<\/noscript>/i
  if (re.test(html)) return html.replace(re, noscript)
  return html.replace('<div id="root"></div>', `${noscript}\n    <div id="root"></div>`)
}

function applyPageSeo(html, path) {
  const seo = PAGE_SEO[path]
  const canonical = absoluteUrl(path)
  let next = html
  next = replaceTitle(next, seo.title)
  next = replaceMetaByName(next, 'description', seo.description)
  next = replaceMetaByName(next, 'twitter:title', seo.title)
  next = replaceMetaByName(next, 'twitter:description', seo.description)
  next = replaceMetaByName(next, 'twitter:image', OG_IMAGE)
  next = replaceMetaByProperty(next, 'og:title', seo.title)
  next = replaceMetaByProperty(next, 'og:description', seo.description)
  next = replaceMetaByProperty(next, 'og:url', canonical)
  next = replaceMetaByProperty(next, 'og:image', OG_IMAGE)
  next = replaceLinkCanonical(next, canonical)
  next = replaceHreflang(next, canonical)
  next = replaceJsonLd(next, path)
  next = replaceNoscript(next, path)
  return next
}

function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = PUBLIC_ROUTES.map((path) => {
    const loc = absoluteUrl(path)
    const seo = PAGE_SEO[path]
    const hreflang = `
    <xhtml:link rel="alternate" hreflang="en" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="es" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${seo.changefreq}</changefreq>
    <priority>${seo.priority}</priority>${hreflang}
  </url>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`

  writeFileSync(join(distDir, 'sitemap.xml'), xml)
  writeFileSync(join(root, 'public/sitemap.xml'), xml)
}

if (!existsSync(indexPath)) {
  console.error('prerender-seo: dist/index.html missing — run vite build first')
  process.exit(1)
}

const baseHtml = readFileSync(indexPath, 'utf8')

for (const path of PUBLIC_ROUTES) {
  const html = applyPageSeo(baseHtml, path)
  if (path === '/') {
    writeFileSync(indexPath, html)
    continue
  }

  const outFile = join(distDir, path.slice(1), 'index.html')
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, html)
}

writeSitemap()
console.log(`prerender-seo: wrote ${PUBLIC_ROUTES.length} routes + sitemap.xml`)
