import { useEffect, useState } from 'react'

export default function Preloader({ duration = 1500 }) {
  const [count, setCount] = useState(0)
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    let start
    let raf
    const step = (t) => {
      if (start === undefined) start = t
      const p = Math.min(1, (t - start) / duration)
      setCount(Math.round(p * 100))
      if (p < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setTimeout(() => setFading(true), 250)
        setTimeout(() => {
          setGone(true)
          document.body.style.overflow = ''
        }, 800)
      }
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [duration])

  if (gone) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[10000] flex items-end justify-between p-6 sm:p-10 bg-[var(--color-background)] transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="absolute inset-0 border-t border-dashed border-[var(--color-border-light)]" />
      <span className="relative text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--color-text-main)]">
        Loading
      </span>
      <span className="relative text-[clamp(4rem,18vw,12rem)] font-medium leading-none tracking-[-0.06em] text-[var(--color-text-main)]">
        {count}%
      </span>
    </div>
  )
}