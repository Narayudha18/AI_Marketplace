import { useEffect, useRef, useState } from 'react'

export function useScrollFill(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true)
        })
      },
      { threshold: options.threshold ?? 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [options.threshold])

  return { ref, inView }
}