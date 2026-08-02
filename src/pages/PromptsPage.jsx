import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import prompts from '../data/ai-prompts.json'
import { useCart } from '../CartContext'
import CartDrawer from '../components/CartDrawer'
import AuthButton from '../components/AuthButton'
import { useTheme } from '../ThemeContext'
import SellerLink from '../components/SellerLink'

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

export default function PromptsPage() {
  const { totalItems, toggleFavorite, isFavorite } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['All Prompts'])
  const [priceRange, setPriceRange] = useState('All Prices')
  const [sortBy, setSortBy] = useState('Newest')
  const location = useLocation()
  const gridRef = useRef(null)
  const productRef = useRef(null)
  useEffect(() => {
    if (location.state?.skipScroll) return
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }, [location.pathname])
  const [categoriesExpanded, setCategoriesExpanded] = useState(false)
  const navigate = useNavigate()

  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedSidebar, setAppliedSidebar] = useState('')
  const [appliedCategories, setAppliedCategories] = useState(['All Prompts'])
  const [appliedPrice, setAppliedPrice] = useState('All Prices')
  const [appliedSort, setAppliedSort] = useState('Newest')
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('search')
    if (q) {
      setSearchQuery(q)
      setAppliedSearch(q)
    }
  }, [])

  const toggleCategory = (cat) => {
    if (cat === 'All Prompts') {
      setSelectedCategories(['All Prompts'])
      return
    }
    let next = selectedCategories.filter(c => c !== 'All Prompts')
    if (next.includes(cat)) {
      next = next.filter(c => c !== cat)
    } else {
      next.push(cat)
    }
    setSelectedCategories(next.length === 0 ? ['All Prompts'] : next)
  }

  const applyFilters = () => {
    setAppliedSearch(searchQuery)
    setAppliedSidebar(sidebarSearch)
    setAppliedCategories(selectedCategories)
    setAppliedPrice(priceRange)
    setAppliedSort(sortBy)
    productRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const resetFilters = () => {
    setSearchQuery(''); setSidebarSearch(''); setSelectedCategories(['All Prompts']); setPriceRange('All Prices'); setSortBy('Newest')
    setAppliedSearch(''); setAppliedSidebar(''); setAppliedCategories(['All Prompts']); setAppliedPrice('All Prices'); setAppliedSort('Newest')
  }

  const filteredPrompts = prompts.filter(t => {
    const q = (appliedSearch || appliedSidebar).toLowerCase()
    if (q && !t.name.toLowerCase().includes(q) && !t.author.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false
    if (!appliedCategories.includes('All Prompts') && !appliedCategories.includes(t.category)) return false
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
        <span>Expert-crafted prompts — get better output from any AI model.</span>
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
              { to: '/ai-skills', label: 'Skills' },
              { to: '/ai-workflows', label: 'Workflows' },
              { to: '/ai-agents', label: 'Agents' },
              { to: '/ai-prompts', label: 'Prompts' },
              { to: '/ai-tokens', label: 'Tokens' },
              { to: '/templates', label: 'Templates' },
            ].map(link => {
              const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
              return (
                <Link key={link.to} to={link.to} state={{ skipScroll: true }}
                  className={`text-xs font-semibold px-3 py-2 rounded-md transition-all relative ${isActive ? 'text-primary' : 'text-surface-variant hover:text-surface'}`}>
                  {link.label}
                  {isActive && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/start-selling" className="hidden sm:flex text-surface-variant hover:text-surface transition-colors text-xs font-semibold">Start Selling</Link>
            <button onClick={() => setCartOpen(true)} className="relative text-surface-variant hover:text-surface transition-colors cursor-pointer p-1.5 flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_cart</span>
              {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-surface text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
            </button>
            <button onClick={toggle} className="text-surface-variant hover:text-surface transition-colors cursor-pointer p-1.5 flex items-center justify-center"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>{dark ? 'light_mode' : 'dark_mode'}</span></button>
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border-light">
        <div className="max-w-[1440px] mx-auto px-6 h-11 flex items-center gap-1 overflow-x-auto">
          {['All Prompts', 'Reasoning', 'Creative Writing', 'Developer Tools', 'HR', 'Marketing', 'API Development', 'E-commerce', 'Data Science', 'Communication', 'Databases'].map(item => {
            const slug = item === 'All Prompts' ? '' : toSlug(item)
            const target = slug ? `/ai-prompts/c/${slug}` : '/ai-prompts'
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
              Premium prompts for better AI output
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              Copy-paste ready prompts crafted by experts. Get better results from ChatGPT, Claude, Gemini, and more.
            </p>
            <div className="flex w-full max-w-lg bg-surface rounded-lg shadow-sm border border-border-light p-1">
              <input type="text" placeholder="e.g. Chain-of-thought" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
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
              src="https://picsum.photos/seed/prompts-hero/600/400"
              alt="Prompts Marketplace"
              className="w-full h-full object-cover rounded-2xl border border-border-light"
            />
          </div>
        </section>

        <section className="px-6 py-10 bg-surface-container-low rounded-3xl mx-6 my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'psychology', title: 'Reasoning', desc: 'Chain-of-thought & logic prompts', tags: ['CoT', 'Logic', 'Math'] },
              { icon: 'edit', title: 'Creative Writing', desc: 'Storytelling & fiction prompts', tags: ['Narrative', 'Character', 'World'] },
              { icon: 'code', title: 'Developer Tools', desc: 'Code docs, tests, API design', tags: ['Docs', 'Testing', 'Design'] },
              { icon: 'campaign', title: 'Marketing', desc: 'SEO, personas, product copy', tags: ['SEO', 'Copy', 'Persona'] },
              { icon: 'database', title: 'Data & Databases', desc: 'SQL optimisation, extraction', tags: ['SQL', 'Extract', 'Optimise'] },
              { icon: 'mail', title: 'Communication', desc: 'Emails, interviews, responses', tags: ['Email', 'Interview', 'HR'] },
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
                  src={`https://picsum.photos/seed/prompt-${cat.icon}/400/120`}
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
            All AI prompts
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-surface rounded-xl border border-border-light p-5 sticky top-4">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2.5 border border-border-light mb-6">
                  <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>search</span>
                  <input type="text" placeholder="Search prompts..." value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="flex-1 border-none bg-transparent text-xs font-medium outline-none placeholder:text-text-muted" />
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Category</h4>
                  <div className="space-y-2.5">
                    {['All Prompts', 'Reasoning', 'Creative Writing', 'Developer Tools', 'HR', 'Marketing', 'API Development', 'E-commerce', 'Data Science', 'Communication', 'Databases'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => { toggleCategory(cat); setTimeout(applyFilters, 50) }}
                          className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Prompt Length</h4>
                  <div className="space-y-2.5">
                    {['All Lengths', 'Short', 'Medium', 'Long'].map((len) => (
                      <label key={len} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="promptLength" checked={priceRange === len} onChange={() => setPriceRange(len)}
                          className="w-4 h-4 border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{len}</span>
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

            <div ref={productRef} className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium text-text-muted">{filteredPrompts.length} prompts found</span>
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
                {filteredPrompts.slice(0, visibleCount).map((t) => (
                  <Link key={t.name} to={`/ai-prompts/${toSlug(t.name)}`}
                    className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-surface-container-low">
                      <img src={`https://picsum.photos/seed/${t.seed}/400/200`} alt={t.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(toSlug(t.name), 'ai-prompts') }}
                        className="absolute top-2 right-2 p-1.5 bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-colors cursor-pointer">
                        <span className={`material-symbols-outlined ${isFavorite(toSlug(t.name), 'ai-prompts') ? 'text-red-500' : 'text-text-muted'}`} style={{ fontSize: 18 }}>{isFavorite(toSlug(t.name), 'ai-prompts') ? 'favorite' : 'favorite_border'}</span>
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-xs font-semibold text-text-main mb-1 line-clamp-1">{t.name}</h4>
                      <p className="text-[11px] font-medium text-text-muted mb-3">
                        by <SellerLink sellerId={t.sellerId} author={t.author} /> in {t.category}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-text-muted mb-3">
                        <span className="bg-surface-container-low px-2 py-0.5 rounded">{t.promptLength}</span>
                        <span className="bg-surface-container-low px-2 py-0.5 rounded">{t.useCase}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between border-t border-border-light pt-3">
                        <div>
                          <span className="text-[24px] font-semibold text-text-main block">{t.price}</span>
                          <span className="text-[11px] font-medium text-text-muted">{t.sales}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 border border-border-light rounded hover:bg-surface-container-low text-text-muted transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_cart</span>
                          </button>
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/ai-prompts/${toSlug(t.name)}/preview`) }} className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                {visibleCount < filteredPrompts.length && (
                  <button onClick={() => setVisibleCount(prev => prev + 6)} className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                    Load more prompts
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 my-6 bg-surface-container-lowest border-y border-border-light">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col justify-center border border-border-light border-dashed rounded-xl p-8 bg-surface">
              <h2 className="text-[24px] font-semibold text-text-main mb-4">Featured Prompts</h2>
              <p className="text-[15px] text-text-muted leading-relaxed mb-8">
                Our team curates the highest-rated prompts each month — from reasoning chains to creative writing.
              </p>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold self-start hover:opacity-90 transition-opacity">
                View featured
              </button>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img
                src="https://picsum.photos/seed/featured-prompts/800/200"
                alt="Featured Prompts"
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
            &copy; 2026 AI Agents Marketplace. All rights reserved. 12k+ prompts available.
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
            <div className="text-[24px] font-semibold text-surface mb-1">12,430</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Prompts Available</div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">89,450</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Prompts Sold</div>
          </div>
        </div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}