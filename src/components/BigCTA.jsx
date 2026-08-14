import { Link } from 'react-router-dom'

export default function BigCTA() {
  return (
    <section className="relative border-y border-dashed border-[var(--color-border-light)] px-6 py-24 sm:py-32 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Ready when you are
      </p>
      <h2 className="mt-6 text-[clamp(2.5rem,8vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.06em] text-[var(--color-text-main)]">
        let's get <span className="text-display-ghost">building</span>
      </h2>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <Link
          to="/"
          className="border border-dashed border-[var(--color-border-light)] bg-[var(--color-surface)] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-main)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          Browse catalog <span aria-hidden="true">→</span>
        </Link>
        <Link
          to="/start-selling"
          className="border border-transparent bg-[var(--color-primary)] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition-opacity hover:opacity-80"
        >
          Start selling <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}