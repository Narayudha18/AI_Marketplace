import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import monitoring from '../data/monitoring.json'
import { useCart } from '../CartContext'
import CartDrawer from '../components/CartDrawer'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parsePrice(price) {
  return parseInt(price.replace(/[^0-9]/g, '')) || 0
}

function parseSales(sales) {
  const num = parseFloat(sales.replace(/[^0-9.]/g, ''))
  return sales.includes('k') ? num * 1000 : num
}

export default function Monitoring() {
  const { totalItems, toggleFavorite, isFavorite } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['All Monitoring'])
  const [priceRange, setPriceRange] = useState('All Prices')
  const [sortBy, setSortBy] = useState('Newest')
  const location = useLocation()
  const gridRef = useRef(null)
  const [categoriesExpanded, setCategoriesExpanded] = useState(false)

  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedSidebar, setAppliedSidebar] = useState('')
  const [appliedCategories, setAppliedCategories] = useState(['All Monitoring'])
  const [appliedPrice, setAppliedPrice] = useState('All Prices')
  const [appliedSort, setAppliedSort] = useState('Newest')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('search')
    if (q) {
      setSearchQuery(q)
      setAppliedSearch(q)
    }
  }, [])

  const toggleCategory = (cat) => {
    if (cat === 'All Monitoring') {
      setSelectedCategories(['All Monitoring'])
      return
    }
    let next = selectedCategories.filter(c => c !== 'All Monitoring')
    if (next.includes(cat)) {
      next = next.filter(c => c !== cat)
    } else {
      next.push(cat)
    }
    setSelectedCategories(next.length === 0 ? ['All Monitoring'] : next)
  }

  const applyFilters = () => {
    setAppliedSearch(searchQuery)
    setAppliedSidebar(sidebarSearch)
    setAppliedCategories(selectedCategories)
    setAppliedPrice(priceRange)
    setAppliedSort(sortBy)
  }

  const resetFilters = () => {
    setSearchQuery(''); setSidebarSearch(''); setSelectedCategories(['All Monitoring']); setPriceRange('All Prices'); setSortBy('Newest')
    setAppliedSearch(''); setAppliedSidebar(''); setAppliedCategories(['All Monitoring']); setAppliedPrice('All Prices'); setAppliedSort('Newest')
  }

  const filteredTemplates = monitoring.filter(t => {
    const q = (appliedSearch || appliedSidebar).toLowerCase()
    if (q && !t.title.toLowerCase().includes(q) && !t.author.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false
    if (!appliedCategories.includes('All Monitoring') && !appliedCategories.includes(t.category)) return false
    const priceNum = parsePrice(t.price)
    if (appliedPrice === 'Under $20' && (priceNum >= 20 || priceNum === 0)) return false
    if (appliedPrice === '$20 - $50' && (priceNum < 20 || priceNum > 50)) return false
    if (appliedPrice === '$50 - $100' && (priceNum < 50 || priceNum > 100)) return false
    if (appliedPrice === 'Over $100' && priceNum <= 100) return false
    return true
  }).sort((a, b) => {
    if (appliedSort === 'Best Sellers' || appliedSort === 'Most Popular') return parseSales(b.sales) - parseSales(a.sales)
    if (appliedSort === 'Price: Low to High') return parsePrice(a.price) - parsePrice(b.price)
    if (appliedSort === 'Price: High to Low') return parsePrice(b.price) - parsePrice(a.price)
    return 0
  })

  return (
    <>
      <div className="bg-primary-container text-on-primary-container py-2 px-6 text-center text-xs font-semibold flex justify-center items-center gap-4">
        <span>Monitor, trace, and alert across your entire AI stack.</span>
        <button onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-text-main text-surface px-4 py-1 rounded text-[11px] font-bold cursor-pointer">Browse All</button>
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
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>dashboard</span>
            monitor.market
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border-light hidden md:flex px-6 h-12 items-center gap-6 overflow-x-auto">
          {['All Monitoring', 'LLM Monitoring', 'Cost Tracking', 'Logging', 'Alerting'].map(item => {
            const slug = item === 'All Monitoring' ? '' : toSlug(item)
            const target = slug ? `/monitoring/c/${slug}` : '/monitoring'
            const isSubActive = location.pathname === target
            return (
              <Link key={item} to={target}
                className={`text-xs font-semibold flex items-center px-4 whitespace-nowrap ${isSubActive ? 'text-primary border-b-2 border-primary pb-[2px]' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
                {item}
              </Link>
            )
          })}
      </div>

      <main className="w-full max-w-[1440px] mx-auto pb-16">
        <section className="px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main">
              AI Monitoring & Observability
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              Track LLM performance, monitor costs, centralize logging, and set up intelligent alerting for your AI stack.
            </p>
            <div className="flex w-full max-w-lg bg-surface rounded-lg shadow-sm border border-border-light p-1">
              <input type="text" placeholder="e.g. LLM performance monitor" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
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
              src="https://picsum.photos/seed/monitoring-hero/600/400"
              alt="Monitoring Marketplace"
              className="w-full h-full object-cover rounded-2xl border border-border-light"
            />
          </div>
        </section>

        <section className="px-6 py-10 bg-surface-container-low rounded-3xl mx-6 my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'monitoring', title: 'LLM Monitoring', desc: 'Track inference performance & latency', tags: ['Newest', 'Bestsellers', 'Latency', 'Tokens', 'Models'] },
              { icon: 'account_balance', title: 'Cost Tracking', desc: 'Monitor AI spend & budget usage', tags: ['Newest', 'Bestsellers', 'Budget', 'API', 'Usage'] },
              { icon: 'description', title: 'Logging', desc: 'Centralized prompt & response logging', tags: ['Newest', 'Bestsellers', 'Audit', 'Search', 'Export'] },
              { icon: 'notifications_active', title: 'Alerting', desc: 'Real-time anomaly detection & alerts', tags: ['Newest', 'Bestsellers', 'Pager', 'Slack', 'Email'] },
              { icon: 'insights', title: 'Analytics', desc: 'Deep insights into model behavior', tags: ['Newest', 'Bestsellers', 'Charts', 'Reports', 'Drill-down'] },
              { icon: 'sync', title: 'Integrations', desc: 'Connect with your existing stack', tags: ['Newest', 'Bestsellers', 'API', 'Webhook', 'Export'] },
            ].slice(0, categoriesExpanded ? 6 : 3).map((cat) => (
              <div key={cat.title}
                className="bg-surface rounded-xl shadow-sm border border-border-light p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-low opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <span className="material-symbols-outlined text-primary text-4xl mb-4">{cat.icon}</span>
                <h3 className="text-[24px] font-semibold text-text-main mb-2">{cat.title}</h3>
                <p className="text-xs font-semibold text-text-muted mb-4">{cat.desc}</p>
                <div className="flex gap-4 text-[11px] font-medium text-primary flex-wrap justify-center">
                  {cat.tags.map((tag) => (
                    <a key={tag} href="#" className="hover:underline">{tag}</a>
                  ))}
                </div>
                <img
                  src={`https://picsum.photos/seed/monitoring-${cat.icon}/400/120`}
                  alt={cat.title}
                  className="mt-6 w-full h-32 object-cover rounded-lg border border-border-light"
                />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button onClick={() => setCategoriesExpanded(!categoriesExpanded)} className="bg-surface border border-border-light text-text-main px-8 py-2.5 rounded text-xs font-semibold shadow-sm hover:bg-surface-container-low transition-colors cursor-pointer">
              {categoriesExpanded ? 'Show less' : 'View more categories'}
            </button>
          </div>
        </section>

        <section ref={gridRef} className="px-6 py-16">
          <h2 className="text-[24px] font-semibold text-text-main mb-8">
            Monitoring & observability tools
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-surface rounded-xl border border-border-light p-5 sticky top-4">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2.5 border border-border-light mb-6">
                  <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>search</span>
                  <input type="text" placeholder="Search monitoring..." value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="flex-1 border-none bg-transparent text-xs font-medium outline-none placeholder:text-text-muted" />
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Category</h4>
                  <div className="space-y-2.5">
                    {['All Monitoring', 'LLM Monitoring', 'Cost Tracking', 'Logging', 'Alerting'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)}
                          className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Price Range</h4>
                  <div className="space-y-2.5">
                    {['All Prices', 'Under $20', '$20 - $50', '$50 - $100', 'Over $100'].map((range) => (
                      <label key={range} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="price" checked={priceRange === range} onChange={() => setPriceRange(range)}
                          className="w-4 h-4 border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Sort By</h4>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full text-xs font-medium bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary text-text-muted">
                    <option>Newest</option>
                    <option>Best Sellers</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                  </select>
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
                <span className="text-xs font-medium text-text-muted">{filteredTemplates.length} monitoring tools found</span>
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
                {filteredTemplates.map((t) => (
                  <Link key={t.title} to={`/monitoring/${toSlug(t.title)}`}
                    className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-surface-container-low">
                      <img src={`https://picsum.photos/seed/${t.seed}/400/200`} alt={t.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(toSlug(t.title), 'monitoring') }}
                        className="absolute top-2 right-2 p-1.5 bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-colors cursor-pointer">
                        <span className={`material-symbols-outlined ${isFavorite(toSlug(t.title), 'monitoring') ? 'text-red-500' : 'text-text-muted'}`} style={{ fontSize: 18 }}>{isFavorite(toSlug(t.title), 'monitoring') ? 'favorite' : 'favorite_border'}</span>
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-xs font-semibold text-text-main mb-1 line-clamp-1">{t.title}</h4>
                      <p className="text-[11px] font-medium text-text-muted mb-3">
                        by <span className="text-primary cursor-pointer hover:underline">{t.author}</span> in {t.category}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-border-light pt-3">
                        <div>
                          <span className="text-[24px] font-semibold text-text-main block">{t.price}</span>
                          <span className="text-[11px] font-medium text-text-muted">{t.sales}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 border border-border-light rounded hover:bg-surface-container-low text-text-muted transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_cart</span>
                          </button>
                          <button className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
                  Load more monitoring tools
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 my-6 bg-surface-container-lowest border-y border-border-light">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col justify-center border border-border-light border-dashed rounded-xl p-8 bg-surface">
              <h2 className="text-[24px] font-semibold text-text-main mb-4">Featured Monitoring</h2>
              <p className="text-[15px] text-text-muted leading-relaxed mb-8">
                Every month, our curators pick the best new monitoring tools — from LLM trackers to alerting systems.
              </p>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold self-start hover:opacity-90 transition-opacity">
                View featured
              </button>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img
                src="https://picsum.photos/seed/featured-monitoring/800/200"
                alt="Featured Monitoring"
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
            &copy; 2026 AI Agents Marketplace. All rights reserved. 8 monitoring tools available.
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
            <div className="text-[24px] font-semibold text-surface mb-1">8</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Monitors Active</div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">5,267</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Events Tracked</div>
          </div>
        </div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
