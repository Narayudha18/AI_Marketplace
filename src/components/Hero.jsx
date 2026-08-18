import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useScrollFill } from '../lib/useReveal'

export default function Hero() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { ref: headlineRef, inView: headlineIn } = useScrollFill({ threshold: 0.2 })

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const fillStyle = {
    clipPath: headlineIn ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
    transition: 'clip-path 1.4s cubic-bezier(0.4, 0, 0, 1)',
  }

  return (
    <section className="relative flex min-h-svh flex-col justify-center px-6 sm:px-10 py-16">
      <div className="relative">
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        The one-stop AI agent marketplace <span aria-hidden="true">→</span>
      </p>

      <div ref={headlineRef} className="relative mt-10">
        <h1 className="mx-0 max-w-[9ch] text-[clamp(3rem,8.5vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.06em] text-[var(--color-text-main)]/40">
          all-in-one ai agent marketplace
        </h1>
        <h1
          aria-hidden="true"
          style={fillStyle}
          className="absolute inset-0 max-w-[9ch] text-[clamp(3rem,8.5vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.06em] text-[var(--color-primary)]"
        >
          all-in-one ai agent marketplace
        </h1>
      </div>

      <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-muted)]">
        Deploy, integrate &amp; scale intelligent automation. Browse thousands of curated agents,
        prompts, workflows and tools — vetted for production.
      </p>

      <div className="mt-10 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-center">
        <Link
          to="/templates"
          className="inline-flex items-center justify-center border border-transparent bg-[var(--color-primary)] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition-opacity hover:opacity-80"
        >
          Get Started <span aria-hidden="true" className="ml-2">→</span>
        </Link>
        <Link
          to="/start-selling"
          className="inline-flex items-center justify-center border border-dashed border-[var(--color-border-light)] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-main)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          Start Selling
        </Link>
      </div>

      <div className="mt-12 w-full max-w-xl border-b border-dashed border-[var(--color-border-light)]">
        <div className="flex items-center gap-3 py-3">
          <span className="material-symbols-outlined text-[var(--color-text-muted)]" style={{ fontSize: 20 }}>search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="search the marketplace"
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--color-text-muted)]"
          />
          <button
            onClick={handleSearch}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-primary)] transition-opacity hover:opacity-70"
          >
            Search
          </button>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 bottom-12 hidden lg:block">
        <div className="absolute -inset-4 border border-dashed border-[var(--color-border-light)]" />
        <figure className="relative flex h-full flex-col">
          <img
            src="https://picsum.photos/seed/ai-agents-hero/720/900"
            alt=""
            className="min-h-0 w-[min(30vw,400px)] flex-1 border border-[var(--color-border-light)] bg-[var(--color-surface-container-low)] object-cover"
          />
          <figcaption className="mt-3 flex items-center justify-between gap-6 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            <span>featured — agent stack</span>
            <span>01</span>
          </figcaption>
        </figure>
      </div>
      </div>

      <div className="mt-16 hidden items-end justify-between sm:flex">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          2.4M+ agents deployed
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Made with care — 2026
        </span>
      </div>
    </section>
  )
}