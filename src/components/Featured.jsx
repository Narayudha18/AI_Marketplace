import { Link } from 'react-router-dom'

const featuredCards = [
  {
    kicker: "GPT Agents '26",
    title: 'chatgpt agents',
    desc: 'GPT-4 powered autonomous agents',
    to: '/chatbots',
    seed: 'featured-agents',
  },
  {
    kicker: "Autonomous '26",
    title: 'ai agents & workflows',
    desc: 'Multi-step pipelines for real ops',
    to: '/ai-agents',
    seed: 'featured-autonomous',
  },
  {
    kicker: "Prompts '26",
    title: 'ai prompts & skills',
    desc: 'Reusable expertise for any model',
    to: '/ai-prompts',
    seed: 'featured-prompts',
  },
]

export default function Featured() {
  return (
    <section className="px-6 sm:px-10 py-20">
      <div className="flex flex-col gap-4 border-b border-dashed border-[var(--color-border-light)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            — 03 / featured
          </span>
          <h2 className="mt-3 text-[clamp(2rem,6vw,4.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-[var(--color-text-main)]">
            featured work
          </h2>
        </div>
        <Link
          to="/templates"
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-main)] transition-colors hover:text-[var(--color-primary)]"
        >
          View all featured items <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {featuredCards.map((card) => (
          <Link key={card.to} to={card.to} className="group">
            <div className="relative aspect-[4/3] overflow-hidden border border-[var(--color-border-light)] transition-colors group-hover:border-[var(--color-primary)]">
              <img
                src={`https://picsum.photos/seed/${card.seed}/800/600`}
                alt={card.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-0 top-0 bg-[var(--color-background)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                {card.kicker}
              </span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-3 border-t border-dashed border-[var(--color-border-light)] pt-4">
              <div>
                <h3 className="text-xl font-medium lowercase tracking-[-0.03em] text-[var(--color-text-main)] transition-colors group-hover:text-[var(--color-primary)]">
                  {card.title}
                </h3>
                <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">{card.desc}</p>
              </div>
              <span
                className="material-symbols-outlined mt-1 text-[var(--color-text-main)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-primary)]"
                style={{ fontSize: 22 }}
              >
                arrow_outward
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}