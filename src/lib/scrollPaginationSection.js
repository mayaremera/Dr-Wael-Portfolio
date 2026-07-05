/**
 * Keeps the paginated section in view after a page change. When a shorter page
 * renders, the browser keeps the same scroll position and can show unrelated
 * content — this scrolls the section anchor back to a stable viewport position.
 */
export function scrollPaginationSectionIntoView(target, { behavior = 'smooth' } = {}) {
  const element = target?.current ?? target
  if (!element || typeof window === 'undefined') return

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior, block: 'start' })
    })
  })
}
