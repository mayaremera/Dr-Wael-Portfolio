import { useEffect } from 'react'
import { buildJsonLd, getPageSeo, SITE_URL } from '../lib/seo'

const SEO_JSON_LD_ID = 'seo-json-ld'
const SEO_MANAGED_ATTR = 'data-seo-managed'

function upsertMeta(selector, create) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = create()
    element.setAttribute(SEO_MANAGED_ATTR, 'true')
    document.head.appendChild(element)
  }
  return element
}

function setMetaName(name, content) {
  if (!content) return
  const element = upsertMeta(`meta[name="${name}"]`, () => {
    const meta = document.createElement('meta')
    meta.name = name
    return meta
  })
  element.content = content
}

function setMetaProperty(property, content) {
  if (!content) return
  const element = upsertMeta(`meta[property="${property}"]`, () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', property)
    return meta
  })
  element.content = content
}

function setLink(rel, href, extra = {}) {
  if (!href) return

  let selector = `link[rel="${rel}"]`
  if (extra.hreflang) selector += `[hreflang="${extra.hreflang}"]`

  const element = upsertMeta(selector, () => {
    const link = document.createElement('link')
    link.rel = rel
    if (extra.hreflang) link.hreflang = extra.hreflang
    if (extra.type) link.type = extra.type
    return link
  })

  element.href = href
}

function setJsonLd(data) {
  let script = document.getElementById(SEO_JSON_LD_ID)
  if (!script) {
    script = document.createElement('script')
    script.id = SEO_JSON_LD_ID
    script.type = 'application/ld+json'
    script.setAttribute(SEO_MANAGED_ATTR, 'true')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

function applySeo(pathname) {
  const seo = getPageSeo(pathname)
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/')

  if (isDashboard) {
    document.title = 'Dashboard | Dr. Wael Al-Dakroury'
    setMetaName('robots', 'noindex, nofollow')
    return
  }

  document.documentElement.lang = 'en'
  document.title = seo.title

  setMetaName('description', seo.description)
  setMetaName('keywords', seo.keywords)
  setMetaName('author', 'Dr. Wael A. Al-Dakroury')
  setMetaName('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
  setMetaName('googlebot', 'index, follow')
  setMetaName('application-name', 'Dr. Wael Al-Dakroury SLP')
  setMetaName('theme-color', '#1a4d5c')

  setMetaProperty('og:type', 'website')
  setMetaProperty('og:site_name', 'Dr. Wael A. Al-Dakroury')
  setMetaProperty('og:title', seo.title)
  setMetaProperty('og:description', seo.description)
  setMetaProperty('og:url', seo.canonical)
  setMetaProperty('og:image', seo.image)
  setMetaProperty('og:image:alt', 'Dr. Wael A. Al-Dakroury — Speech-Language Pathologist & ASHA Fellow')
  setMetaProperty('og:locale', seo.locale)
  seo.alternateLocales.forEach((locale) => {
    setMetaProperty('og:locale:alternate', locale)
  })

  setMetaName('twitter:card', 'summary_large_image')
  setMetaName('twitter:title', seo.title)
  setMetaName('twitter:description', seo.description)
  setMetaName('twitter:image', seo.image)

  setLink('canonical', seo.canonical)

  setLink('alternate', seo.canonical, { hreflang: 'en' })
  setLink('alternate', seo.canonical, { hreflang: 'ar' })
  setLink('alternate', seo.canonical, { hreflang: 'es' })
  setLink('alternate', seo.canonical, { hreflang: 'x-default' })

  setJsonLd(buildJsonLd(pathname))
}

export function useSeo(pathname) {
  useEffect(() => {
    applySeo(pathname)
  }, [pathname])
}

export function getDefaultSeoTags() {
  return getPageSeo('/')
}

export { SITE_URL }
