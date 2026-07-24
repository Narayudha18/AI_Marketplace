import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/context'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import integrations from '../data/integrations.json'
import { useCart } from '../CartContext'
import Navbar from '../components/Navbar'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function Integrations() {
  const { t } = useLanguage()
  const { totalItems, toggleFavorite, isFavorite } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['All'])
  const [selectedType, setSelectedType] = useState('All')
  const [selectedRating, setSelectedRating] = useState('Any Rating')
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
  const [appliedCategories, setAppliedCategories] = useState(['All'])
  const [appliedType, setAppliedType] = useState('All')
  const [appliedRating, setAppliedRating] = useState('Any Rating')
  const [visibleCount, setVisibleCount] = useState(6)

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
    productRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
      <Navbar />

      <div className="bg-surface border-b border-border-light">
        <div className="max-w-[1440px] mx-auto px-6 h-11 flex items-center gap-1 overflow-x-auto">
          {['All Integrations', 'LLM Providers', 'Vector DB', 'Voice AI', 'Image Gen', 'RAG Pipelines', 'Frameworks', 'Model Hosting', 'Compute', 'Monitoring'].map(item => {
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
              {t('listingPages.integrations.heroTitle')}
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              {t('listingPages.integrations.heroDesc')}
            </p>

          </div>
          <div className="w-full lg:w-1/2 relative h-[400px]">
            <img
              src="https://picsum.photos/seed/integrations-hero/600/400"
              alt={t('listingPages._common.card.alt')}
              className="w-full h-full object-cover rounded-2xl border border-border-light"
            />
          </div>
        </section>

        <section className="px-6 py-16">
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
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">{t('listingPages.integrations.sidebarCategory')}</h4>
                  <div className="space-y-2.5">
                    {['All', 'LLM Providers', 'Vector DB', 'Voice AI', 'Image Gen', 'Frameworks', 'Model Hosting', 'Compute'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => { toggleCategory(cat); setTimeout(applyFilters, 50) }}
                          className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">{t('listingPages.integrations.sidebarType')}</h4>
                  <div className="space-y-2.5">
                    {t('listingPages.integrations.types').map((type) => (
                      <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="type" checked={selectedType === type} onChange={() => setSelectedType(type)}
                          className="w-4 h-4 border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">{t('listingPages.integrations.sidebarRating')}</h4>
                  <div className="space-y-2.5">
                    {t('listingPages.integrations.ratings').map((r) => (
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
                <span className="text-xs font-medium text-text-muted">{filteredIntegrations.length} {t('listingPages.integrations.results')}</span>
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
                {filteredIntegrations.slice(0, visibleCount).map((item) => (
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
                        <span>{item.reviews.length} {t('listingPages._common.card.reviews')}</span>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/integrations/${toSlug(item.name)}/preview`) }} className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                        {t('listingPages.integrations.button')}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                {visibleCount < filteredIntegrations.length && (
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
              <h2 className="text-[24px] font-semibold text-text-main mb-4">{t('listingPages.integrations.featuredTitle')}</h2>
              <p className="text-[15px] text-text-muted leading-relaxed mb-8">
                {t('listingPages.integrations.featuredDesc')}
              </p>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold self-start hover:opacity-90 transition-opacity">
                {t('listingPages._common.featured.view')}
              </button>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img
                src="https://picsum.photos/seed/featured-integration/800/200"
                alt={t('listingPages.integrations.featuredTitle')}
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
            {t('listingPages.integrations.copyright')}
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
            <div className="text-[24px] font-semibold text-surface mb-1">312</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">{t('listingPages.integrations.stats')[0]}</div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">89.4k</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">{t('listingPages.integrations.stats')[1]}</div>
          </div>
        </div>
      </footer>
    </>
  );
}
