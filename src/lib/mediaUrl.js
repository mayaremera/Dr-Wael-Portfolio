export function withCacheBust(url) {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return url

  const [base] = url.split('?')
  return `${base}?v=${Date.now()}`
}
