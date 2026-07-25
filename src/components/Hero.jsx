import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/templates?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <section className="px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main">
          All-in-one AI agent marketplace
        </h1>
        <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
          Deploy, integrate & scale intelligent automation.
        </p>
        <div className="flex w-full max-w-lg bg-surface rounded-lg shadow-sm border border-border-light p-1">
          <input type="text" placeholder="e.g. Customer support agent" value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="flex-1 border-none focus:ring-0 px-4 py-3 text-[15px] bg-transparent outline-none" />
          <button onClick={handleSearch}
            className="bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity px-6 rounded text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
            Search
          </button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 relative h-[250px] sm:h-[350px] md:h-[400px]">
        <img
          src="https://picsum.photos/seed/ai-marketplace-hero/600/400"
          alt="AI Agents Marketplace"
          className="w-full h-full object-cover rounded-2xl border border-border-light"
        />
      </div>
    </section>
  );
}
