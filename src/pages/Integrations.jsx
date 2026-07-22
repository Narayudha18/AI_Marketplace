import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import integrations from '../data/integrations.json'
import { useCart } from '../CartContext'
import CartDrawer from '../components/CartDrawer'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function Integrations() {
  const { totalItems, toggleFavorite, isFavorite } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['All'])
  const [selectedType, setSelectedType] = useState('All')
  const [selectedRating, setSelectedRating] = useState('Any Rating')
  const location = useLocation()
  const gridRef = useRef(null)

  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedSidebar, setAppliedSidebar] = useState('')
  const [appliedCategories, setAppliedCategories] = useState(['All'])
  const [appliedType, setAppliedType] = useState('All')
  const [appliedRating, setAppliedRating] = useState('Any Rating')

  const toggleCategory = (cat) => {
    if (cat === 'All') { setSelectedCategories(['All']); return }
    let next = selectedCategories.filter(c => c !== 'All')
    if (next.includes(cat)) { next = next.filter(c => c !== cat) } else { next.push(cat) }
    setSelectedCategories(next.length === 0 ? ['All'] : next)
  }

  const applyFilters = () => {
    setAppliedSearch(searchQuery)
    setAppliedSidebar(sidebarSearch)
    setAppliedCategories(selectedCategories)
    setAppliedType(selectedType)
    setAppliedRating(selectedRating)
  }

  const resetFilters = () => {
    setSearchQuery(''); setSidebarSearch(''); setSelectedCategories(['All']); setSelectedType('All'); setSelectedRating('Any Rating')
    setAppliedSearch(''); setAppliedSidebar(''); setAppliedCategories(['All']); setAppliedType('All'); setAppliedRating('Any Rating')
  }

  const filteredIntegrations = integrations.filter(i => {
    const q = (appliedSearch || appliedSidebar).toLowerCase()
    if (q && !i.name.toLowerCase().includes(q) && !i.desc.toLowerCase().includes(q) && !i.category.toLowerCase().includes(q)) return false
    if (!appliedCategories.includes('All') && !appliedCategories.includes(i.category)) return false
    if (appliedType !== 'All') {
      const typeMap = { 'REST API': 'API', 'SDK': 'SDK', 'Webhook': 'Webhook', 'Plugin': 'Plugin' }
      if (i.type !== typeMap[appliedType]) return false
    }
    if (appliedRating !== 'Any Rating') {
      const min = parseFloat(appliedRating)
      if (i.rating < min) return false
    }
    return true
  })
  return (
    <>
      <div className="bg-gradient-to-r from-primary-container to-blue-600 text-on-primary-container px-6 py-2.5 text-center text-xs font-semibold flex justify-center items-center gap-3">
        <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">New</span>
        <span>Connect your stack with 300+ AI integrations & API connectors.</span>
        <button onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-text-main text-surface px-4 py-1.5 rounded text-[11px] font-bold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap">
          View All
        </button>
      </div>

      <header className="bg-text-main flex flex-col w-full sticky top-0 z-40">
        <div className="px-6 h-14 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="text-lg font-bold text-surface tracking-tight">AIAgents</Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'AI Agents' },
              { to: '/templates', label: 'Templates' },
              { to: '/integrations', label: 'Integrations' },
              { to: '/chatbots', label: 'Chatbots' },
              { to: '/automation', label: 'Automation' },
              { to: '/ai-tools', label: 'AI Tools' },
            ].map(link => {
              const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
              return (
                <Link key={link.to} to={link.to}
                  className={`text-xs font-semibold px-3 py-2 rounded-md transition-all relative ${isActive ? 'text-primary' : 'text-surface-variant hover:text-surface'}`}>
                  {link.label}
                  {isActive && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/start-selling" className="hidden sm:flex text-surface-variant hover:text-surface transition-colors text-xs font-semibold">Start Selling</Link>
            <button onClick={() => setCartOpen(true)} className="relative text-surface-variant hover:text-surface transition-colors cursor-pointer p-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_cart</span>
              {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-surface text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
            </button>
            <Link to="/login" className="text-surface text-xs font-semibold border border-white/20 px-3.5 py-1.5 rounded-md hover:bg-surface hover:text-text-main transition-all">Sign In</Link>
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border-light">
        <div className="max-w-[1440px] mx-auto px-6 h-11 flex items-center gap-1 overflow-x-auto">
          {['All Integrations', 'LLM Providers', 'Vector DB', 'Voice AI', 'Image Gen', 'Frameworks', 'Model Hosting', 'Compute', 'Monitoring'].map(item => {
            const slug = item === 'All Integrations' ? '' : toSlug(item)
            const target = slug ? `/integrations/c/${slug}` : '/integrations'
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
              Connect your AI stack with 300+ integrations
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              Plug in LLMs, vector databases, voice APIs, and productivity tools. One API to connect them all.
            </p>
            <div className="flex w-full max-w-lg bg-surface rounded-lg shadow-sm border border-border-light p-1">
              <input type="text" placeholder="e.g. OpenAI, LangChain, Pinecone" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
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
            <img
              src="https://picsum.photos/seed/integrations-hero/600/400"
              alt="Integrations"
              className="w-full h-full object-cover rounded-2xl border border-border-light"
            />
          </div>
        </section>

        <section className="px-6 py-10 bg-surface-container-low rounded-3xl mx-6 my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'psychiatry', title: 'LLM Providers', count: '24 APIs' },
              { icon: 'database', title: 'Vector Databases', count: '12 APIs' },
              { icon: 'record_voice_over', title: 'Voice & Audio', count: '18 APIs' },
              { icon: 'filter_vintage', title: 'Image & Video', count: '22 APIs' },
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
                  <input type="text" placeholder="Search integrations..." value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="flex-1 border-none bg-transparent text-xs font-medium outline-none placeholder:text-text-muted" />
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Category</h4>
                  <div className="space-y-2.5">
                    {['All', 'LLM Providers', 'Vector DB', 'Voice AI', 'Image Gen', 'Frameworks', 'Model Hosting', 'Compute'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)}
                          className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Type</h4>
                  <div className="space-y-2.5">
                    {['All', 'REST API', 'SDK', 'Webhook', 'Plugin'].map((type) => (
                      <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="type" checked={selectedType === type} onChange={() => setSelectedType(type)}
                          className="w-4 h-4 border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Rating</h4>
                  <div className="space-y-2.5">
                    {['Any Rating', '4.5 & Up', '4.0 & Up', '3.5 & Up'].map((r) => (
                      <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="rating" checked={selectedRating === r} onChange={() => setSelectedRating(r)}
                          className="w-4 h-4 border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{r}</span>
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
                <span className="text-xs font-medium text-text-muted">{filteredIntegrations.length} integrations found</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-surface border border-border-light rounded-lg hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>grid_view</span>
                  </button>
                  <button className="p-2 bg-surface border border-border-light rounded-lg hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>view_list</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredIntegrations.map((item) => (
                  <Link key={item.name} to={`/integrations/${toSlug(item.name)}`}
                    className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col relative">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(toSlug(item.name), 'integrations'); }}
                      className="absolute top-2 right-2 p-1.5 bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-colors cursor-pointer"
                    >
                        <span className={`material-symbols-outlined ${isFavorite(toSlug(item.name), 'integrations') ? 'text-red-500' : 'text-text-muted'}`}>
                          {isFavorite(toSlug(item.name), 'integrations') ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                    <div className="p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: 24 }}>{item.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-text-main">{item.name}</h4>
                        <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{item.desc}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[11px] font-medium text-primary bg-primary-container/10 px-2 py-0.5 rounded">{item.type}</span>
                          <span className="text-[11px] font-medium text-text-muted">{item.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto px-5 pb-4 flex items-center justify-between border-t border-border-light pt-3">
                      <div className="flex items-center gap-2 text-[11px] text-text-muted">
                        <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 14 }}>star</span>
                        <span className="font-medium">{item.rating}</span>
                        <span className="text-text-muted">·</span>
                        <span>{item.users} users</span>
                      </div>
                      <button className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                        Connect
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
                  Load more integrations
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 my-6 bg-surface-container-lowest border-y border-border-light">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col justify-center border border-border-light border-dashed rounded-xl p-8 bg-surface">
              <h2 className="text-[24px] font-semibold text-text-main mb-4">Featured Integration</h2>
              <p className="text-[15px] text-text-muted leading-relaxed mb-8">
                LangChain leads the pack with 18.3k active users. Orchestrate LLM calls, RAG pipelines, and agent chains with one unified framework.
              </p>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold self-start hover:opacity-90 transition-opacity">
                View featured
              </button>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img
                src="https://picsum.photos/seed/featured-integration/800/200"
                alt="Featured Integration"
                className="col-span-1 sm:col-span-2 h-48 object-cover rounded-xl border border-border-light"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-text-main text-surface w-full py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-outline">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <span className="text-xl font-bold text-surface tracking-tight">AIAgents</span>
          <p className="text-[15px] text-secondary-fixed-dim mt-4 leading-relaxed">
            &copy; 2026 AI Agents Marketplace. 300+ integrations available.
          </p>
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
            <div className="text-[24px] font-semibold text-surface mb-1">312</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Integrations Live</div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">89.4k</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Active Connections</div>
          </div>
        </div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
