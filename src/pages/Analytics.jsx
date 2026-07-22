import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import analytics from '../data/analytics.json'
import { useCart } from '../CartContext'
import CartDrawer from '../components/CartDrawer'
import AuthButton from '../components/AuthButton'

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

export default function Analytics() {
  const { totalItems, toggleFavorite, isFavorite } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['All Analytics'])
  const [priceRange, setPriceRange] = useState('All Prices')
  const [sortBy, setSortBy] = useState('Newest')
  const location = useLocation()
  const gridRef = useRef(null)
  const [categoriesExpanded, setCategoriesExpanded] = useState(false)

  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedSidebar, setAppliedSidebar] = useState('')
  const [appliedCategories, setAppliedCategories] = useState(['All Analytics'])
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
    if (cat === 'All Analytics') {
      setSelectedCategories(['All Analytics'])
      return
    }
    let next = selectedCategories.filter(c => c !== 'All Analytics')
    if (next.includes(cat)) {
      next = next.filter(c => c !== cat)
    } else {
      next.push(cat)
    }
    setSelectedCategories(next.length === 0 ? ['All Analytics'] : next)
  }

  const applyFilters = () => {
    setAppliedSearch(searchQuery)
    setAppliedSidebar(sidebarSearch)
    setAppliedCategories(selectedCategories)
    setAppliedPrice(priceRange)
    setAppliedSort(sortBy)
  }

  const resetFilters = () => {
    setSearchQuery(''); setSidebarSearch(''); setSelectedCategories(['All Analytics']); setPriceRange('All Prices'); setSortBy('Newest')
    setAppliedSearch(''); setAppliedSidebar(''); setAppliedCategories(['All Analytics']); setAppliedPrice('All Prices'); setAppliedSort('Newest')
  }

  const filteredItems = analytics.filter(t => {
    const q = (appliedSearch || appliedSidebar).toLowerCase()
    if (q && !t.title.toLowerCase().includes(q) && !t.author.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false
    if (!appliedCategories.includes('All Analytics') && !appliedCategories.includes(t.category)) return false
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
      <div className="bg-gradient-to-r from-primary-container to-blue-600 text-on-primary-container px-6 py-2.5 text-center text-xs font-semibold flex justify-center items-center gap-3">
        <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">New</span>
        <span>Premium analytics tools & dashboards for data-driven teams.</span>
        <button onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-text-main text-surface px-4 py-1.5 rounded text-[11px] font-bold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap">
          Browse All
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
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border-light">
        <div className="max-w-[1440px] mx-auto px-6 h-11 flex items-center gap-1 overflow-x-auto">
          {['All Analytics', 'Dashboards', 'Data Viz', 'BI Tools', 'Reporting'].map(item => {
            const slug = item === 'All Analytics' ? '' : toSlug(item)
            const target = slug ? `/analytics/c/${slug}` : '/analytics'
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

      <main className="w-full max-w-[1440px] mx-auto pb-16">
        <section className="px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main">
              AI-Powered Analytics Tools
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              Uncover insights with intelligent dashboards, data visualization, BI tools, and automated reporting APIs.
            </p>
            <div className="flex w-full max-w-lg bg-surface rounded-lg shadow-sm border border-border-light p-1">
              <input type="text" placeholder="e.g. KPI dashboard" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
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
              src="https://picsum.photos/seed/analytics-hero/600/400"
              alt="Analytics Marketplace"
              className="w-full h-full object-cover rounded-2xl border border-border-light"
            />
          </div>
        </section>

        <section className="px-6 py-10 bg-surface-container-low rounded-3xl mx-6 my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'bar_chart', title: 'Executive Dashboards', desc: 'Real-time KPI tracking & executive overviews', tags: ['Newest', 'Bestsellers', 'KPI', 'Metrics', 'C-Suite'] },
              { icon: 'show_chart', title: 'Data Visualization', desc: 'Interactive charts, graphs & visual analytics', tags: ['Newest', 'Bestsellers', 'Charts', 'Graphs', 'Real-time'] },
              { icon: 'insights', title: 'Business Intelligence', desc: 'Self-service BI & decision intelligence tools', tags: ['Newest', 'Bestsellers', 'BI', 'SQL', 'ETL'] },
              { icon: 'description', title: 'Reporting Automation', desc: 'Automated report generation & scheduling', tags: ['Newest', 'Bestsellers', 'PDF', 'Email', 'Scheduling'] },
              { icon: 'monitoring', title: 'Performance Metrics', desc: 'Track system & business performance metrics', tags: ['Newest', 'Bestsellers', 'APM', 'SLAs', 'Uptime'] },
              { icon: 'pie_chart', title: 'Revenue Analytics', desc: 'Revenue tracking, forecasting & profitability', tags: ['Newest', 'Bestsellers', 'Revenue', 'Forecast', 'Finance'] },
              { icon: 'grouped_bar_chart', title: 'Cohort Analysis', desc: 'User behavior cohorts & retention analysis', tags: ['Newest', 'Bestsellers', 'Cohorts', 'Retention', 'Users'] },
              { icon: 'trending_up', title: 'Predictive Analytics', desc: 'ML-driven forecasts & anomaly detection', tags: ['Newest', 'Bestsellers', 'ML', 'Forecast', 'Anomaly'] },
            ].slice(0, categoriesExpanded ? 8 : 3).map((cat) => (
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
                  src={`https://picsum.photos/seed/analytics-${cat.icon}/400/120`}
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
            Premium analytics & reporting tools
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-surface rounded-xl border border-border-light p-5 sticky top-4">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2.5 border border-border-light mb-6">
                  <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>search</span>
                  <input type="text" placeholder="Search analytics..." value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="flex-1 border-none bg-transparent text-xs font-medium outline-none placeholder:text-text-muted" />
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Category</h4>
                  <div className="space-y-2.5">
                    {['All Analytics', 'Dashboards', 'Data Viz', 'BI Tools', 'Reporting'].map((cat) => (
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
                <span className="text-xs font-medium text-text-muted">{filteredItems.length} analytics tools found</span>
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
                {filteredItems.map((t) => (
                  <Link key={t.title} to={`/analytics/${toSlug(t.title)}`}
                    className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-surface-container-low">
                      <img src={`https://picsum.photos/seed/${t.seed}/400/200`} alt={t.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(toSlug(t.title), 'analytics') }}
                        className="absolute top-2 right-2 p-1.5 bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-colors cursor-pointer">
                        <span className={`material-symbols-outlined ${isFavorite(toSlug(t.title), 'analytics') ? 'text-red-500' : 'text-text-muted'}`} style={{ fontSize: 18 }}>{isFavorite(toSlug(t.title), 'analytics') ? 'favorite' : 'favorite_border'}</span>
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
                  Load more analytics tools
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 my-6 bg-surface-container-lowest border-y border-border-light">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col justify-center border border-border-light border-dashed rounded-xl p-8 bg-surface">
              <h2 className="text-[24px] font-semibold text-text-main mb-4">Featured Analytics</h2>
              <p className="text-[15px] text-text-muted leading-relaxed mb-8">
                Each month, our analysts pick the best new dashboards and reporting tools — from executive views to predictive models.
              </p>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold self-start hover:opacity-90 transition-opacity">
                View featured
              </button>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img
                src="https://picsum.photos/seed/featured-analytics/800/200"
                alt="Featured Analytics"
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
            &copy; 2026 AI Agents Marketplace. All rights reserved. 8 tools available.
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
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Analytics Tools</div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">13,340</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Reports Generated</div>
          </div>
        </div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
