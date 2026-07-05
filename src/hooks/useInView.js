import { useEffect, useRef, useState } from 'react'

export function useInView({ rootMargin = '160px 0px', once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, once])

  return [ref, inView]
}
