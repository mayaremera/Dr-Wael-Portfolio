/**
 * After Vite build, write static HTML shells for each public route so crawlers
 * get correct title/description/canonical without waiting on JS.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const indexPath = join(distDir, 'index.html')
const SITE_URL = 'https://drwaelslp.com'

const PAGE_SEO = {
  '/': {
    title: 'Dr. Wael Al-Dakroury | ASHA Fellow Speech-Language Pathologist & Professor',
    description:
      'Dr. Wael A. Al-Dakroury — ASHA Fellow (F-ASHA), CCC-SLP, bilingual speech-language pathologist, professor & international leader in communication sciences. Expert care for autism, ADHD, language disorders, stuttering & speech sound disorders. Serving families in the USA, Canada, Saudi Arabia, GCC & Middle East. English, Arabic & Spanish-speaking families welcome.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  '/about-me': {
    title: 'About Dr. Wael Al-Dakroury | ASHA Fellow, Professor & SLP Leader',
    description:
      'Biography of Dr. Wael A. Al-Dakroury — Ph.D., CCC-SLP, ASHA Fellow, Associate Professor, Director of Communication Disorders. 30+ years in speech-language pathology, ASHA SIG17 Chief Editor, IALP committee member, honorary president EACSL.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  '/services': {
    title: 'Speech & Language Therapy Services | Autism, ADHD, DLD & More — Dr. Wael Al-Dakroury',
    description:
      'Evidence-based speech & language therapy for autism (ASD), ADHD, developmental language disorder (DLD), speech sound disorders, stuttering, pragmatic communication & global developmental delay. Screening, assessment, therapy, family training & professional workshops. Bilingual English & Arabic.',
    priority: '0.95',
    changefreq: 'monthly',
  },
  '/gallery': {
    title: 'Gallery | Dr. Wael Al-Dakroury — Lectures, Ceremonies & Clinical Highlights',
    description:
      'Watch Dr. Wael Al-Dakroury in lectures, ASHA conferences, award ceremonies & clinical settings. Video library and photo gallery showcasing decades of contribution to speech-language pathology worldwide.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  '/in-the-field': {
    title: 'In the Field | Dr. Wael Al-Dakroury — Conferences, ASHA & Global SLP Leadership',
    description:
      "Dr. Wael Al-Dakroury's global engagements — ASHA panels, university lectures, international conferences, leadership meetings & professional training across the USA, Canada, Saudi Arabia, GCC, Egypt & the Middle East.",
    priority: '0.8',
    changefreq: 'weekly',
  },
  '/contact': {
    title: 'Contact Dr. Wael Al-Dakroury | Book Speech & Language Consultation',
    description:
      'Contact Dr. Wael A. Al-Dakroury for speech & language consultation, professional speaking, clinical supervision & family appointments. Reach via phone, email or contact form. English & Arabic. Serving USA, Canada, Saudi Arabia, UAE, Qatar, Bahrain, Oman, Egypt, Jordan & Kuwait.',
    priority: '0.85',
    changefreq: 'monthly',
  },
}

const PUBLIC_ROUTES = Object.keys(PAGE_SEO)
const OG_IMAGE = `${SITE_URL}/images/dr-wael.jpeg`

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
  return next
}

function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = PUBLIC_ROUTES.map((path) => {
    const loc = absoluteUrl(path)
    const seo = PAGE_SEO[path]
    const hreflang =
      path === '/'
        ? `
    <xhtml:link rel="alternate" hreflang="en" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="es" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`
        : ''

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
