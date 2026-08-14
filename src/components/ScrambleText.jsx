import { useEffect, useRef, useState } from 'react'

const FALLBACK_CHARS = 'abcdefghijklmnopqrstuvwxyz=+*/\\|;:%#^&<>!?()[]{}'

function randomChar() {
  return FALLBACK_CHARS[Math.floor(Math.random() * FALLBACK_CHARS.length)]
}

function scrambleOnce(text, revealedCount) {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') out += ' '
    else if (i < revealedCount) out += text[i]
    else out += randomChar()
  }
  return out
}

export default function ScrambleText({ text, as: Tag = 'span', className = '', speed = 45 }) {
  const [display, setDisplay] = useState(text)
  const timerRef = useRef(null)
  const activeRef = useRef(false)

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    activeRef.current = false
    setDisplay(text)
  }

  const start = () => {
    if (activeRef.current) return
    stop()
    activeRef.current = true
    let tick = 0
    timerRef.current = setInterval(() => {
      tick += 1
      if (tick > 200) {
        tick = 0
      }
      const revealed = Math.min(text.length, Math.floor(tick / 2))
      setDisplay(scrambleOnce(text, revealed))
    }, speed)
  }

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  return (
    <Tag
      className={className}
      onMouseEnter={start}
      onMouseLeave={stop}
      data-scramble-text
      aria-label={text}
    >
      {display}
    </Tag>
  )
}