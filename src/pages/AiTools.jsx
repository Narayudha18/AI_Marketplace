import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import tools from '../data/aitools.json'
import { useCart } from '../CartContext'
import CartDrawer from '../components/CartDrawer'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AiTools() {
  const { totalItems, toggleFavorite, isFavorite } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPricing, setSelectedPricing] = useState('All')
  const location = useLocation()
  const gridRef = useRef(null)

  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedSidebar, setAppliedSidebar] = useState('')
  const [appliedCategory, setAppliedCategory] = useState('All')
  const [appliedPricing, setAppliedPricing] = useState('All')

  const categoryMap = { 'LLM APIs': 'LLM', 'Image Gen': 'Image', 'Audio/Speech': 'Audio', 'Vector DB': 'Infra', 'Compute': 'Compute', 'Frameworks': 'Framework', 'Monitoring': 'LLM' }

  const applyFilters = () => {
    setAppliedSearch(searchQuery)
    setAppliedSidebar(sidebarSearch)
    setAppliedCategory(selectedCategory)
    setAppliedPricing(selectedPricing)
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
      <div className="bg-primary-container text-on-primary-container py-2 px-6 text-center text-xs font-semibold flex justify-center items-center gap-4">
        <span>Access 1,000+ AI tools & APIs. One marketplace, infinite possibilities.</span>
        <button onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-text-main text-surface px-4 py-1 rounded text-[11px] font-bold cursor-pointer">Browse APIs</button>
      </div>

      <header className="bg-text-main flex flex-col w-full border-b border-outline-variant">
        <div className="px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-surface tracking-tight">AIAgents</a>
          <div className="flex items-center gap-6">
            <Link to="/start-selling" className="text-surface-variant hover:text-surface transition-colors text-xs font-semibold">Start Selling</Link>
            <div className="flex items-center gap-4 pl-4 border-l border-outline">
              <button onClick={() => setCartOpen(true)} className="relative text-surface-variant hover:text-surface transition-colors cursor-pointer">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_cart</span>
                {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 bg-primary text-surface text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
              </button>
              <button className="text-surface text-xs font-semibold border border-surface px-4 py-1.5 rounded hover:bg-surface hover:text-text-main transition-colors">Sign In</button>
            </div>
          </div>
        </div>

        <div className="px-6 h-12 flex items-center justify-between border-t border-outline">
          <nav className="flex h-full">
            {[
              { to: '/', label: 'AI Agents' },
              { to: '/templates', label: 'Templates' },
              { to: '/integrations', label: 'Integrations' },
              { to: '/chatbots', label: 'Chatbots' },
              { to: '/automation', label: 'Automation' },
              { to: '/ai-tools', label: 'AI Tools & APIs' },
            ].map(link => {
              const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
              return (
                <Link key={link.to} to={link.to}
                  className={`text-xs font-semibold flex items-center px-4 ${isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-surface-variant hover:text-surface transition-colors'}`}>
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="bg-surface-variant text-text-main px-4 py-1.5 rounded-t text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>api</span>
            tools.market
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border-light hidden md:flex px-6 h-12 items-center gap-6 overflow-x-auto">
          {['All Tools', 'LLM APIs', 'Image Gen', 'Audio/Speech', 'Vector DB', 'Compute', 'Frameworks', 'Monitoring'].map(item => {
            const slug = item === 'All Tools' ? '' : toSlug(item)
            const target = slug ? `/ai-tools/c/${slug}` : '/ai-tools'
            const isSubActive = location.pathname === target
            return (
              <Link key={item} to={target}
                className={`text-xs font-semibold flex items-center px-4 whitespace-nowrap ${isSubActive ? 'text-primary border-b-2 border-primary pb-[2px]' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
                {item}
              </Link>
            )
          })}
      </div>

      <main ref={gridRef} className="w-full max-w-[1440px] mx-auto pb-16">
        <section className="px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main">
              The largest catalog of AI tools & APIs
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              From GPT-4o to Stable Diffusion — find, compare, and connect to 1,000+ AI APIs and SDKs in one place.
            </p>
            <div className="flex w-full max-w-lg bg-surface rounded-lg shadow-sm border border-border-light p-1">
              <input type="text" placeholder="e.g. GPT-4o, Stable Diffusion, Whisper" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                className="flex-1 border-none focus:ring-0 px-4 py-3 text-[15px] bg-transparent outline-none" />
              <button onClick={applyFilters}
                className="bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity px-6 rounded text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
                Search
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative h-[400px]">
            <img src="https://picsum.photos/seed/aitools-hero/600/400" alt="AI Tools & APIs"
              className="w-full h-full object-cover rounded-2xl border border-border-light" />
          </div>
        </section>

        <section className="px-6 py-10 bg-surface-container-low rounded-3xl mx-6 my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'psychiatry', title: 'LLM APIs', count: '45+ models' },
              { icon: 'image', title: 'Image Gen', count: '32 APIs' },
              { icon: 'record_voice_over', title: 'Audio/Speech', count: '28 APIs' },
              { icon: 'database', title: 'Vector DBs', count: '18 APIs' },
            ].map((cat) => (
              <div key={cat.title}
                className="bg-surface rounded-xl shadow-sm border border-border-light p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-primary text-4xl mb-3">{cat.icon}</span>
                <h3 className="text-lg font-semibold text-text-main">{cat.title}</h3>
                <p className="text-xs font-medium text-text-muted mt-1">{cat.count}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-surface rounded-xl border border-border-light p-5 sticky top-4">
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

            <div className="flex-1">
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
                {filteredTools.map((t) => (
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
                        <span className="text-xs font-semibold text-text-main">{t.price}</span>
                        <button className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                          Access
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
                  Browse all tools
                </button>
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
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">Tools</h4>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">LLM APIs</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Image Gen</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Audio APIs</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Vector DBs</a>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">Help</h4>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Help Center</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Authors</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Sitemap</a>
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
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
