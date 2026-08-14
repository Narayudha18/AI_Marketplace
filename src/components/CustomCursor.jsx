import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const pillRef = useRef(null)
  const rafRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [label, setLabel] = useState('OPEN')

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tX = x
    let tY = y

    const onMove = (e) => {
      tX = e.clientX
      tY = e.clientY
    }

    const loop = () => {
      x += (tX - x) * 0.18
      y += (tY - y) * 0.18
      if (pillRef.current) {
        pillRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    const onOver = (e) => {
      const target = e.target
      if (!target || !target.closest) {
        setVisible(false)
        return
      }
      const hit = target.closest('a, button, [role="button"], input, select, textarea, [data-cursor]')
      if (hit) {
        const custom = hit.getAttribute && hit.getAttribute('data-cursor')
        if (custom) {
          setLabel(custom)
        } else if (hit.tagName === 'INPUT' || hit.tagName === 'SELECT' || hit.tagName === 'TEXTAREA') {
          setLabel('TYPE')
        } else {
          const txt = (hit.getAttribute && hit.getAttribute('data-cursor-label')) || (hit.textContent || '').trim()
          setLabel(txt ? txt.slice(0, 16) : 'OPEN')
        }
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      root.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <div
      ref={pillRef}
      className="cursor-pill pointer-events-none fixed top-0 left-0 z-[9999] hidden items-center justify-center border border-[var(--color-border-light)] bg-[var(--color-background)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-main)]"
    >
      <span className={`transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </div>
  )
}