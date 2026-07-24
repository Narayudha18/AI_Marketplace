import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import tools from '../data/aitools.json'
import { useCart } from '../CartContext'
import Navbar from '../components/Navbar'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AiTools() {
  const { totalItems, toggleFavorite, isFavorite } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPricing, setSelectedPricing] = useState('All')
  const location = useLocation()
  const navigate = useNavigate()
  const gridRef = useRef(null)
  const productRef = useRef(null)
  useEffect(() => {
    if (location.state?.skipScroll) return
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }, [location.pathname])

  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedSidebar, setAppliedSidebar] = useState('')
  const [appliedCategory, setAppliedCategory] = useState('All')
  const [appliedPricing, setAppliedPricing] = useState('All')
  const [visibleCount, setVisibleCount] = useState(6)
  const [showFilters, setShowFilters] = useState(false)

  const categoryMap = { 'LLM APIs': 'LLM', 'Image Gen': 'Image', 'Audio/Speech': 'Audio', 'Vector DB': 'Infra', 'Compute': 'Compute', 'Frameworks': 'Framework', 'Monitoring': 'LLM' }

  const applyFilters = () => {
    setAppliedSearch(searchQuery)
    setAppliedSidebar(sidebarSearch)
    setAppliedCategory(selectedCategory)
    setAppliedPricing(selectedPricing)
    productRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const resetFilters = () => {
    setSearchQuery(''); setSidebarSearch(''); setSelectedCategory('All'); setSelectedPricing('All')
    setAppliedSearch(''); setAppliedSidebar(''); setAppliedCategory('All'); setAppliedPricing('All')
  }

  const filteredTools = tools.filter(t => {
    const q = (appliedSearch || appliedSidebar).toLowerCase()
    if (q && !t.name.toLowerCase().includes(q) && !t.desc.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false
    if (appliedCategory !== 'All') {
      const mapped = categoryMap[appliedCategory]
      if (mapped && t.category !== mapped) return false
      if (!mapped && t.category !== appliedCategory) return false
    }
    if (appliedPricing !== 'All') {
      const priceLower = t.price.toLowerCase()
      if (appliedPricing === 'Free' && !priceLower.includes('free')) return false
      if (appliedPricing === 'Pay-as-you-go' && !priceLower.includes('pay-as-you-go')) return false
      if (appliedPricing === 'Subscription' && !priceLower.includes('/mo')) return false
      if (appliedPricing === 'Usage-based' && !priceLower.includes('/1k') && !priceLower.includes('/img') && !priceLower.includes('/min')) return false
    }
    return true
  })

  return (
    <>
      <Navbar />

      <div className="bg-surface border-b border-border-light">
        <div className="max-w-[1440px] mx-auto px-6 h-11 flex items-center gap-1 overflow-x-auto">
          {['All Tools', 'LLM APIs', 'Image Gen', 'Audio/Speech', 'Vector DB', 'Compute', 'Frameworks', 'Monitoring', 'Analytics', 'Fine-tuning', 'Security'].map(item => {
            const slug = item === 'All Tools' ? '' : toSlug(item)
            const target = slug ? `/ai-tools/c/${slug}` : '/ai-tools'
            const isSubActive = location.pathname === target
            return (
              <Link key={item} to={target}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 whitespace-nowrap transition-all rounded-md ${isSubActive ? 'bg-primary/10 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}>
                {item}
              </Link>
            )
          })}
        </div>
      </div>

      <main ref={gridRef} className="w-full max-w-[1440px] mx-auto pb-16">
        <section className="px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main">
              The largest catalog of AI tools & APIs
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              From GPT-4o to Stable Diffusion — find, compare, and connect to 1,000+ AI APIs and SDKs in one place. Compare pricing, latency, features, and rate limits across LLMs, image generation, audio, vector databases, and compute providers side by side.
            </p>

          </div>
          <div className="w-full lg:w-1/2 relative h-[250px] sm:h-[350px] md:h-[400px]">
            <img src="https://picsum.photos/seed/aitools-hero/600/400" alt="AI Tools & APIs"
              className="w-full h-full object-cover rounded-2xl border border-border-light" />
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center justify-between w-full bg-surface border border-border-light rounded-xl px-4 py-3 text-xs font-semibold text-text-main hover:bg-surface-container-low transition-colors">
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>filter_list</span> Filters</span>
              <span className="material-symbols-outlined text-text-muted transition-transform" style={{ fontSize: 18 }}>{showFilters ? 'expand_less' : 'expand_more'}</span>
            </button>
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
              <div className="bg-surface rounded-xl border border-border-light p-5 lg:sticky lg:top-4">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2.5 border border-border-light mb-6">
                  <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>search</span>
                  <input type="text" placeholder="Search tools..." value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="flex-1 border-none bg-transparent text-xs font-medium outline-none placeholder:text-text-muted" />
                </div>
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Category</h4>
                  <div className="space-y-2.5">
                    {['All', 'LLM', 'Image', 'Audio', 'Infra', 'Compute', 'Framework'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategory === 'All' ? cat === 'All' : selectedCategory === cat} onChange={() => setSelectedCategory(cat === 'All' ? 'All' : cat)}
                          className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Pricing</h4>
                  <div className="space-y-2.5">
                    {['All', 'Free', 'Pay-as-you-go', 'Subscription', 'Usage-based'].map((p) => (
                      <label key={p} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="pricing" checked={selectedPricing === p} onChange={() => setSelectedPricing(p)}
                          className="w-4 h-4 border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button onClick={applyFilters}
                  className="w-full mt-6 bg-primary-container text-on-primary-container py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                  Apply Filters
                </button>
                <button onClick={resetFilters}
                  className="w-full mt-2 bg-surface border border-border-light text-text-muted py-2.5 rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-opacity">
                  Reset
                </button>
              </div>
            </aside>

            <div ref={productRef} className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium text-text-muted">{filteredTools.length} tools found</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-surface border border-border-light rounded-lg hover:bg-surface-container-low">
                    <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>grid_view</span>
                  </button>
                  <button className="p-2 bg-surface border border-border-light rounded-lg hover:bg-surface-container-low">
                    <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>view_list</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTools.slice(0, visibleCount).map((t) => (
                  <Link key={t.name} to={`/ai-tools/${toSlug(t.name)}`}
                    className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-surface-container-low">
                      <img src={`https://picsum.photos/seed/${t.seed}/400/200`} alt={t.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(toSlug(t.name), 'ai-tools'); }}
                        className="absolute top-2 right-2 p-1.5 bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-colors cursor-pointer"
                      >
                        <span className={`material-symbols-outlined ${isFavorite(toSlug(t.name), 'ai-tools') ? 'text-red-500' : 'text-text-muted'}`}>
                          {isFavorite(toSlug(t.name), 'ai-tools') ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-xs font-semibold text-text-main">{t.name}</h4>
                        {t.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            t.badge === 'Popular' ? 'bg-primary-container/20 text-primary' :
                            t.badge === 'New' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>{t.badge}</span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-text-muted mb-2">{t.desc}</p>
                      <span className="text-[11px] font-medium text-primary bg-primary-container/10 px-2 py-0.5 rounded self-start mb-3">{t.category}</span>
                      <div className="mt-auto flex items-center justify-between border-t border-border-light pt-3">
                        <div>
                          <span className="text-xs font-semibold text-text-main">{t.price}</span>
                          <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                            <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 12 }}>star</span>
                            <span className="font-medium">{t.rating}</span>
                            <span>·</span>
                            <span>{t.reviews.length} reviews</span>
                          </div>
                        </div>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/ai-tools/${toSlug(t.name)}/preview`) }} className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                          Access
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                {visibleCount < filteredTools.length && (
                  <button onClick={() => setVisibleCount(prev => prev + 6)} className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                    Load more tools
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 my-6 bg-surface-container-lowest border-y border-border-light">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col justify-center border border-border-light border-dashed rounded-xl p-8 bg-surface">
              <h2 className="text-[24px] font-semibold text-text-main mb-4">Featured Tool</h2>
              <p className="text-[15px] text-text-muted leading-relaxed mb-8">
                GPT-4o API leads with multimodal power — text, images, and audio in one unified API.
              </p>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold self-start hover:opacity-90 transition-opacity">
                View featured
              </button>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img src="https://picsum.photos/seed/featured-aitool/800/200" alt="Featured Tool"
                className="col-span-1 sm:col-span-2 h-48 object-cover rounded-xl border border-border-light" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-text-main text-surface w-full py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-outline">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <span className="text-xl font-bold text-surface tracking-tight">AIAgents</span>
          <p className="text-[15px] text-secondary-fixed-dim mt-4 leading-relaxed">&copy; 2026 AI Agents Marketplace. 1,000+ tools & APIs.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">Marketplace</h4>
          <Link to="/terms" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Terms</Link>
          <Link to="/licenses" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Licenses</Link>
          <Link to="/api" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">API</Link>
          <Link to="/privacy" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Privacy</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">Help</h4>
          <Link to="/help" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Help Center</Link>
          <Link to="/authors" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Authors</Link>
          <Link to="/sitemap" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Sitemap</Link>
        </div>
        <div className="col-span-2 md:col-span-1 flex flex-col gap-6 justify-end items-start md:items-end mt-8 md:mt-0">
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">1,024</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Tools Available</div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">45.2k</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">API Calls/Day</div>
          </div>
        </div>
      </footer>
    </>
  );
}
