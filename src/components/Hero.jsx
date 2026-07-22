import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="px-6 py-20 flex flex-col lg:flex-row items-center gap-10">
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main">
          All-in-one AI agent marketplace
        </h1>
        <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
          Deploy, integrate & scale intelligent automation.
        </p>
        <Link to="/templates" className="bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity px-6 py-3 rounded text-xs font-semibold self-start flex items-center gap-2">
          Explore Now
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
        </Link>
      </div>
      <div className="w-full lg:w-1/2 relative h-[400px]">
        <img
          src="https://picsum.photos/seed/ai-marketplace-hero/600/400"
          alt="AI Agents Marketplace"
          className="w-full h-full object-cover rounded-2xl border border-border-light"
        />
      </div>
    </section>
  );
}
