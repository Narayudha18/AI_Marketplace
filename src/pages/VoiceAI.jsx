import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/context'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import voiceAI from '../data/voice-ai.json'
import { useCart } from '../CartContext'
import Navbar from '../components/Navbar'

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

export default function VoiceAI() {
  const { t } = useLanguage()
  const sortOptions = t('listingPages._common.sort')
  const priceOptions = t('listingPages._common.price')
  const { totalItems, toggleFavorite, isFavorite } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['All Voice AI'])
  const [priceRange, setPriceRange] = useState('All Prices')
  const [sortBy, setSortBy] = useState('Newest')
  const location = useLocation()
  const gridRef = useRef(null)
  const productRef = useRef(null)
  useEffect(() => {
    if (location.state?.skipScroll) return
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }, [location.pathname])
  const navigate = useNavigate()

  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedSidebar, setAppliedSidebar] = useState('')
  const [appliedCategories, setAppliedCategories] = useState(['All Voice AI'])
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
    if (cat === 'All Voice AI') {
      setSelectedCategories(['All Voice AI'])
      return
    }
    let next = selectedCategories.filter(c => c !== 'All Voice AI')
    if (next.includes(cat)) {
      next = next.filter(c => c !== cat)
    } else {
      next.push(cat)
    }
    setSelectedCategories(next.length === 0 ? ['All Voice AI'] : next)
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
    setSearchQuery(''); setSidebarSearch(''); setSelectedCategories(['All Voice AI']); setPriceRange('All Prices'); setSortBy('Newest')
    setAppliedSearch(''); setAppliedSidebar(''); setAppliedCategories(['All Voice AI']); setAppliedPrice('All Prices'); setAppliedSort('Newest')
  }

  const filteredTemplates = voiceAI.filter(t => {
    const q = (appliedSearch || appliedSidebar).toLowerCase()
    if (q && !t.title.toLowerCase().includes(q) && !t.author.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false
    if (!appliedCategories.includes('All Voice AI') && !appliedCategories.includes(t.category)) return false
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
      <Navbar />
      <div className="bg-surface border-b border-border-light">
        <div className="max-w-[1440px] mx-auto px-6 h-11 flex items-center gap-1 overflow-x-auto">
          {['All Voice AI', 'Speech Recognition', 'Text-to-Speech', 'Voice Cloning', 'Audio Processing'].map(item => {
            const slug = item === 'All Voice AI' ? '' : toSlug(item)
            const target = slug ? `/voice-ai/c/${slug}` : '/voice-ai'
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
{t('listingPages.voiceAi.heroTitle')}
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              {t('listingPages.voiceAi.heroDesc')}
            </p>

          </div>
          <div className="w-full lg:w-1/2 relative h-[400px]">
            <img
              src="https://picsum.photos/seed/voice-ai-hero/600/400"
              alt={t('listingPages._common.card.alt')}
              className="w-full h-full object-cover rounded-2xl border border-border-light"
            />
          </div>
        </section>

        <section ref={gridRef} className="px-6 py-16">
          <h2 className="text-[24px] font-semibold text-text-main mb-8">
            {t('listingPages.voiceAi.bannerSection')}
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-surface rounded-xl border border-border-light p-5 sticky top-4">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2.5 border border-border-light mb-6">
                  <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>search</span>
                  <input type="text" placeholder={t('categoryListing.searchPlaceholder')} value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="flex-1 border-none bg-transparent text-xs font-medium outline-none placeholder:text-text-muted" />
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">{t('listingPages.voiceAi.sidebarCategory')}</h4>
                  <div className="space-y-2.5">
                    {['All Voice AI', 'Speech Recognition', 'Text-to-Speech', 'Voice Cloning', 'Audio Processing'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => { toggleCategory(cat); setTimeout(applyFilters, 50) }}
                          className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">{t('listingPages.voiceAi.sidebarPrice')}</h4>
                  <div className="space-y-2.5">
                    {priceOptions.map((range) => (
                      <label key={range} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="price" checked={priceRange === range} onChange={() => setPriceRange(range)}
                          className="w-4 h-4 border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">{t('listingPages.voiceAi.sidebarSort')}</h4>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full text-xs font-medium bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary text-text-muted">
                    {sortOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </div>

                <button onClick={applyFilters}
                  className="w-full mt-6 bg-primary-container text-on-primary-container py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                  {t('categoryListing.apply')}
                </button>
                <button onClick={resetFilters}
                  className="w-full mt-2 bg-surface border border-border-light text-text-muted py-2.5 rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-opacity">
                  {t('categoryListing.reset')}
                </button>
              </div>
            </aside>

            <div ref={productRef} className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium text-text-muted">{filteredTemplates.length} {t('listingPages.voiceAi.results')}</span>
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
                {filteredTemplates.slice(0, visibleCount).map((t) => (
                  <Link key={t.title} to={`/voice-ai/${toSlug(t.title)}`}
                    className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-surface-container-low">
                      <img src={`https://picsum.photos/seed/${t.seed}/400/200`} alt={t.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(toSlug(t.title), 'voice-ai') }}
                        className="absolute top-2 right-2 p-1.5 bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-colors cursor-pointer">
                        <span className={`material-symbols-outlined ${isFavorite(toSlug(t.title), 'voice-ai') ? 'text-red-500' : 'text-text-muted'}`} style={{ fontSize: 18 }}>{isFavorite(toSlug(t.title), 'voice-ai') ? 'favorite' : 'favorite_border'}</span>
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-xs font-semibold text-text-main mb-1 line-clamp-1">{t.title}</h4>
                      <p className="text-[11px] font-medium text-text-muted mb-3">
                        {t('listingPages._common.card.by')} <span className="text-primary cursor-pointer hover:underline">{t.author}</span> {t('listingPages._common.card.in')} {t.category}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-border-light pt-3">
                        <div>
                          <span className="text-[24px] font-semibold text-text-main block">{t.price}</span>
                          <div className="flex items-center gap-1 text-[11px] text-text-muted">
                            <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 12 }}>star</span>
                            <span className="font-medium">{t.rating}</span>
                            <span>·</span>
                            <span>{t.reviews.length} {t('listingPages._common.card.reviews')}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 border border-border-light rounded hover:bg-surface-container-low text-text-muted transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_cart</span>
                          </button>
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/voice-ai/${toSlug(t.title)}/preview`) }} className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                            {t('listingPages.voiceAi.button')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                {visibleCount < filteredTemplates.length && (
                  <button onClick={() => setVisibleCount(prev => prev + 6)} className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                    {t('categoryListing.loadMore')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 my-6 bg-surface-container-lowest border-y border-border-light">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col justify-center border border-border-light border-dashed rounded-xl p-8 bg-surface">
              <h2 className="text-[24px] font-semibold text-text-main mb-4">{t('listingPages.voiceAi.featuredTitle')}</h2>
              <p className="text-[15px] text-text-muted leading-relaxed mb-8">
                {t('listingPages.voiceAi.featuredDesc')}
              </p>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold self-start hover:opacity-90 transition-opacity">
                {t('listingPages._common.featured.view')}
              </button>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img
                src="https://picsum.photos/seed/featured-voice-ai/800/200"
                alt={t('listingPages.voiceAi.featuredTitle')}
                className="col-span-1 sm:col-span-2 h-48 object-cover rounded-xl border border-border-light"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-text-main text-surface w-full py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-outline">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <span className="text-xl font-bold text-surface tracking-tight">{t('listingPages._common.footer.brand')}</span>
          <p className="text-[15px] text-secondary-fixed-dim mt-4 leading-relaxed">
            {t('listingPages.voiceAi.copyright')}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">{t('listingPages._common.footer.marketplace')}</h4>
          <Link to="/terms" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('listingPages._common.footer.terms')}</Link>
          <Link to="/licenses" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('listingPages._common.footer.licenses')}</Link>
          <Link to="/api" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('listingPages._common.footer.api')}</Link>
          <Link to="/privacy" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('listingPages._common.footer.privacy')}</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">{t('listingPages._common.footer.help')}</h4>
          <Link to="/help" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('listingPages._common.footer.helpCenter')}</Link>
          <Link to="/authors" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('listingPages._common.footer.authors')}</Link>
          <Link to="/sitemap" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('listingPages._common.footer.sitemap')}</Link>
        </div>
        <div className="col-span-2 md:col-span-1 flex flex-col gap-6 justify-end items-start md:items-end mt-8 md:mt-0">
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">8</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">{t('listingPages.voiceAi.stats')[0]}</div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">12,890</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">{t('listingPages.voiceAi.stats')[1]}</div>
          </div>
        </div>
      </footer>
    </>
  );
}
