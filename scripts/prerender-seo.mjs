/**
 * After Vite build, write static HTML shells for each public route so crawlers
 * get correct title/description/canonical, JSON-LD, and page-specific content
 * without waiting on JS.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  PAGE_SEO,
  PUBLIC_ROUTES,
  SITE_URL,
  buildJsonLd,
  getPageSeo,
  renderCrawlerNoscript,
} from '../src/lib/pageSeo.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const indexPath = join(distDir, 'index.html')

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
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

function replaceJsonLd(html, data) {
  const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c')
  const tag = `<script id="seo-json-ld" type="application/ld+json">\n${json}\n    </script>`
  const withId = /<script id="seo-json-ld"[^>]*>[\s\S]*?<\/script>/i
  if (withId.test(html)) return html.replace(withId, tag)
  const anyLd = /<script type="application\/ld\+json">[\s\S]*?<\/script>/i
  if (anyLd.test(html)) return html.replace(anyLd, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function replaceNoscript(html, inner) {
  const tag = `<noscript>\n${inner}\n    </noscript>`
  const re = /<noscript>[\s\S]*?<\/noscript>/i
  return re.test(html) ? html.replace(re, tag) : html.replace('<div id="root"></div>', `${tag}\n    <div id="root"></div>`)
}

function applyPageSeo(html, path) {
  const seo = getPageSeo(path)
  let next = html
  next = replaceTitle(next, seo.title)
  next = replaceMetaByName(next, 'description', seo.description)
  next = replaceMetaByName(next, 'keywords', seo.keywords)
  next = replaceMetaByName(next, 'twitter:title', seo.title)
  next = replaceMetaByName(next, 'twitter:description', seo.description)
  next = replaceMetaByName(next, 'twitter:image', seo.image)
  next = replaceMetaByProperty(next, 'og:title', seo.title)
  next = replaceMetaByProperty(next, 'og:description', seo.description)
  next = replaceMetaByProperty(next, 'og:url', seo.canonical)
  next = replaceMetaByProperty(next, 'og:image', seo.image)
  next = replaceLinkCanonical(next, seo.canonical)
  next = replaceHreflang(next, seo.canonical)
  next = replaceJsonLd(next, buildJsonLd(path))
  next = replaceNoscript(next, renderCrawlerNoscript(path))
  return next
}

function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = PUBLIC_ROUTES.map((path) => {
    const seo = getPageSeo(path)
    const page = PAGE_SEO[path]
    const loc = seo.canonical
    const hreflang = `
    <xhtml:link rel="alternate" hreflang="en" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="es" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${hreflang}
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

let notFoundHtml = replaceTitle(baseHtml, 'Page not found | Dr. Wael Al-Dakroury')
notFoundHtml = replaceMetaByName(notFoundHtml, 'robots', 'noindex, nofollow')
notFoundHtml = replaceMetaByName(notFoundHtml, 'googlebot', 'noindex, nofollow')
notFoundHtml = notFoundHtml.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, '')
writeFileSync(join(distDir, '404.html'), notFoundHtml)

writeSitemap()
console.log(`prerender-seo: wrote ${PUBLIC_ROUTES.length} routes + sitemap.xml (${SITE_URL})`)
