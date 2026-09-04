import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext'
import Navbar from '../components/Navbar'
import { mergeCategoryItems } from '../lib/storage'
import { toSlug, parsePrice, parseSales } from '../lib/helpers'
import SellerLink from '../components/SellerLink'
import ViewToggle from '../components/ViewToggle'

export default function CategoryPage({
  data,
  nameKey = 'name',
  categoryKey,
  label,
  heroTitle,
  heroDesc,
  heroSeed,
  subNav = [],
  filterCategories = [],
  extraFilters = [],
  showCapabilities = false,
  showPlatform = false,
  footerLabel,
}) {
  const { toggleFavorite, isFavorite } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const gridRef = useRef(null)
  const productRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([`All ${label}`])
  const [priceRange, setPriceRange] = useState('All Prices')
  const [sortBy, setSortBy] = useState('Newest')
  const [visibleCount, setVisibleCount] = useState(6)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedSidebar, setAppliedSidebar] = useState('')
  const [appliedCategories, setAppliedCategories] = useState([`All ${label}`])
  const [appliedPrice, setAppliedPrice] = useState('All Prices')
  const [appliedSort, setAppliedSort] = useState('Newest')

  useEffect(() => {
    if (location.state?.skipScroll) return
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }, [location.pathname])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('search')
    if (q) { setSearchQuery(q); setAppliedSearch(q) }
  }, [])

  const allCategoryLabel = `All ${label}`

  const toggleCategory = (cat) => {
    if (cat === allCategoryLabel) { setSelectedCategories([allCategoryLabel]); return }
    let next = selectedCategories.filter(c => c !== allCategoryLabel)
    if (next.includes(cat)) next = next.filter(c => c !== cat)
    else next.push(cat)
    setSelectedCategories(next.length === 0 ? [allCategoryLabel] : next)
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
    setSearchQuery(''); setSidebarSearch(''); setSelectedCategories([allCategoryLabel]); setPriceRange('All Prices'); setSortBy('Newest')
    setAppliedSearch(''); setAppliedSidebar(''); setAppliedCategories([allCategoryLabel]); setAppliedPrice('All Prices'); setAppliedSort('Newest')
  }

  const allItems = mergeCategoryItems(data, categoryKey, nameKey)

  const filtered = allItems.filter(t => {
    const q = (appliedSearch || appliedSidebar).toLowerCase()
    const itemName = t[nameKey] || t.title || ''
    if (q && !itemName.toLowerCase().includes(q) && !String(t.author || '').toLowerCase().includes(q) && !String(t.category || '').toLowerCase().includes(q)) return false
    if (!appliedCategories.includes(allCategoryLabel) && !appliedCategories.includes(t.category)) return false
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

  const defaultFilterCategories = filterCategories.length > 0
    ? [allCategoryLabel, ...filterCategories]
    : [allCategoryLabel, ...new Set(data.map(t => t.category).filter(Boolean))]

  return (
    <>
      <Navbar />

      {subNav.length > 0 && (
        <div className="bg-surface border-b border-border-light">
          <div className="max-w-[1440px] mx-auto px-6 h-11 flex items-center gap-1 overflow-x-auto">
            {subNav.map(item => {
              const slug = item === allCategoryLabel ? '' : toSlug(item)
              const target = slug ? `/${categoryKey}/c/${slug}` : `/${categoryKey}`
              const isActive = location.pathname === target
              return (
                <Link key={item} to={target}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 whitespace-nowrap transition-all rounded-md ${isActive ? 'bg-primary/10 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}>
                  {item}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <main className="w-full max-w-[1440px] mx-auto pb-16">
        <section className="px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main">
              {heroTitle}
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              {heroDesc}
            </p>
          </div>
          <div className="w-full lg:w-1/2 relative h-[250px] sm:h-[350px] md:h-[400px]">
            <img
              src={`https://picsum.photos/seed/${heroSeed}/600/400`}
              alt={label}
              className="w-full h-full object-cover rounded-2xl border border-border-light"
            />
          </div>
        </section>

        <section ref={gridRef} className="px-6 py-16">
          <h2 className="text-[24px] font-semibold text-text-main mb-8">
            {label} marketplace
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center justify-between w-full bg-surface border border-border-light rounded-xl px-4 py-3 text-xs font-semibold text-text-main hover:bg-surface-container-low transition-colors">
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>filter_list</span> Filters</span>
              <span className="material-symbols-outlined text-text-muted transition-transform" style={{ fontSize: 18 }}>{showFilters ? 'expand_less' : 'expand_more'}</span>
            </button>

            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
              <div className="bg-surface rounded-xl border border-border-light p-5 lg:sticky lg:top-4">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2.5 border border-border-light mb-6">
                  <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>search</span>
                  <input type="text" placeholder={`Search ${label.toLowerCase()}...`} value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="flex-1 border-none bg-transparent text-xs font-medium outline-none placeholder:text-text-muted" />
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Category</h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto">
                    {defaultFilterCategories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => { toggleCategory(cat); setTimeout(applyFilters, 50) }}
                          className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {extraFilters.map(filter => (
                  <div key={filter.label} className="mb-6">
                    <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">{filter.label}</h4>
                    <div className="space-y-2.5">
                      {filter.options.map((opt) => (
                        <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                          <input type="radio" name={filter.label} checked={(filter.state || priceRange) === opt} onChange={() => filter.setState ? filter.setState(opt) : setPriceRange(opt)}
                            className="w-4 h-4 border-border-light text-primary focus:ring-primary" />
                          <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

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
                <span className="text-xs font-medium text-text-muted">{filtered.length} {label.toLowerCase()} found</span>
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>

              <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
                {filtered.slice(0, visibleCount).map((t) => {
                  const itemName = t[nameKey] || t.title || t.name
                  const slug = toSlug(itemName)
                  return (
                    <Link key={itemName} to={`/${categoryKey}/${slug}`}
                      className={`bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}>
                      <div className={`relative overflow-hidden bg-surface-container-low flex-shrink-0 ${viewMode === 'list' ? 'w-40 md:w-56' : 'h-40 w-full'}`}>
                        <img src={`https://picsum.photos/seed/${t.seed || slug}/400/200`} alt={itemName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(slug, categoryKey) }}
                          className="absolute top-2 right-2 p-1.5 bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-colors cursor-pointer">
                          <span className={`material-symbols-outlined ${isFavorite(slug, categoryKey) ? 'text-red-500' : 'text-text-muted'}`} style={{ fontSize: 18 }}>{isFavorite(slug, categoryKey) ? 'favorite' : 'favorite_border'}</span>
                        </button>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="text-xs font-semibold text-text-main mb-1 line-clamp-1">{itemName}</h4>
                        <p className="text-[11px] font-medium text-text-muted mb-3">
                          by <SellerLink sellerId={t.sellerId} author={t.author} /> in {t.category}
                        </p>
                        {showPlatform && t.platform && (
                          <div className="flex items-center gap-2 text-[11px] text-text-muted mb-3">
                            <span className="bg-surface-container-low px-2 py-0.5 rounded">{t.platform}</span>
                          </div>
                        )}
                        {showCapabilities && t.capabilities && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {t.capabilities.slice(0, 3).map(cap => (
                              <span key={cap} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">{cap}</span>
                            ))}
                          </div>
                        )}
                        <div className="mt-auto flex items-center justify-between border-t border-border-light pt-3">
                          <div>
                            <span className="text-[24px] font-semibold text-text-main block">{t.price || 'Free'}</span>
                            <div className="flex items-center gap-1 text-[11px] text-text-muted">
                              <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 12 }}>star</span>
                              <span className="font-medium">{t.rating}</span>
                              <span>·</span>
                              <span>{(t.reviews?.length ?? 0)} reviews</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 border border-border-light rounded hover:bg-surface-container-low text-text-muted transition-colors">
                              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_cart</span>
                            </button>
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/${categoryKey}/${slug}/preview`) }} className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                              Preview
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className="mt-8 flex justify-center">
                {visibleCount < filtered.length && (
                  <button onClick={() => setVisibleCount(prev => prev + 6)} className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                    Load more {label.toLowerCase()}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 my-6 bg-surface-container-lowest border-y border-border-light">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col justify-center border border-border-light border-dashed rounded-xl p-8 bg-surface">
              <h2 className="text-[24px] font-semibold text-text-main mb-4">Featured {label}</h2>
              <p className="text-[15px] text-text-muted leading-relaxed mb-8">
                Monthly curated selection of the best {label.toLowerCase()} from our community.
              </p>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold self-start hover:opacity-90 transition-opacity">
                View featured
              </button>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img
                src={`https://picsum.photos/seed/featured-${categoryKey}/800/200`}
                alt={`Featured ${label}`}
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
            &copy; 2026 AI Agents Marketplace. All rights reserved.
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
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">{footerLabel || label} Available</div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">89,450</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">{footerLabel || label} Sold</div>
          </div>
        </div>
      </footer>
    </>
  )
}
