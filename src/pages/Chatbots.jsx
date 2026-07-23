import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import chatbots from '../data/chatbots.json'
import { useCart } from '../CartContext'
import CartDrawer from '../components/CartDrawer'
import AuthButton from '../components/AuthButton'
import { useTheme } from '../ThemeContext'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function Chatbots() {
  const { totalItems, toggleFavorite, isFavorite } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPlatform, setSelectedPlatform] = useState('All')
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
  const [appliedPlatform, setAppliedPlatform] = useState('All')
  const [appliedRating, setAppliedRating] = useState('Any Rating')
  const [visibleCount, setVisibleCount] = useState(6)

  const applyFilters = () => {
    setAppliedSearch(searchQuery)
    setAppliedSidebar(sidebarSearch)
    setAppliedPlatform(selectedPlatform)
    setAppliedRating(selectedRating)
    productRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const resetFilters = () => {
    setSearchQuery(''); setSidebarSearch(''); setSelectedCategory('All'); setSelectedPlatform('All'); setSelectedRating('Any Rating')
    setAppliedSearch(''); setAppliedSidebar(''); setAppliedPlatform('All'); setAppliedRating('Any Rating')
  }

  const filteredChatbots = chatbots.filter(b => {
    const q = (appliedSearch || appliedSidebar).toLowerCase()
    if (q && !b.name.toLowerCase().includes(q) && !b.desc.toLowerCase().includes(q)) return false
    if (appliedPlatform !== 'All' && !b.platform.toLowerCase().includes(appliedPlatform.toLowerCase())) return false
    if (appliedRating !== 'Any Rating') {
      const min = parseFloat(appliedRating)
      if (b.rating < min) return false
    }
    return true
  })

  return (
    <>
      <div className="bg-gradient-to-r from-primary-container to-blue-600 text-on-primary-container px-6 py-2.5 text-center text-xs font-semibold flex justify-center items-center gap-3">
        <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">New</span>
        <span>Deploy intelligent chatbots with zero coding. 500+ pre-built agents.</span>
        <button onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-text-main text-surface px-4 py-1.5 rounded text-[11px] font-bold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap">
          Explore Chatbots
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
          {['All Chatbots', 'Customer Support', 'Sales', 'HR', 'Education', 'Healthcare', 'Finance', 'Developer Tools', 'Productivity'].map(item => {
            const slug = item === 'All Chatbots' ? '' : toSlug(item)
            const target = slug ? `/chatbots/c/${slug}` : '/chatbots'
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
              AI chatbots that actually understand your business
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              Deploy GPT-powered chatbots for support, sales, HR, and more. Trained on your data, live in minutes.
            </p>
            <div className="flex w-full max-w-lg bg-surface rounded-lg shadow-sm border border-border-light p-1">
              <input type="text" placeholder="e.g. Customer support chatbot" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
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
            <img src="https://picsum.photos/seed/chatbots-hero/600/400" alt="Chatbots"
              className="w-full h-full object-cover rounded-2xl border border-border-light" />
          </div>
        </section>

        <section className="px-6 py-10 bg-surface-container-low rounded-3xl mx-6 my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'support_agent', title: 'Support', count: '128 chatbots' },
              { icon: 'trending_up', title: 'Sales', count: '94 chatbots' },
              { icon: 'school', title: 'Education', count: '76 chatbots' },
              { icon: 'local_hospital', title: 'Healthcare', count: '52 chatbots' },
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
                  <input type="text" placeholder="Search chatbots..." value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="flex-1 border-none bg-transparent text-xs font-medium outline-none placeholder:text-text-muted" />
                </div>
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Category</h4>
                  <div className="space-y-2.5">
                    {['All', 'Support', 'Sales', 'HR', 'Education', 'Healthcare', 'Finance', 'Dev Tools'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategory === cat || (cat === 'All' && selectedCategory === 'All')} onChange={() => setSelectedCategory(cat)}
                          className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Platform</h4>
                  <div className="space-y-2.5">
                    {['All', 'Web', 'Slack', 'Discord', 'WhatsApp', 'API'].map((p) => (
                      <label key={p} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="platform" checked={selectedPlatform === p} onChange={() => setSelectedPlatform(p)}
                          className="w-4 h-4 border-border-light text-primary focus:ring-primary" />
                        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Rating</h4>
                  <div className="space-y-2.5">
                    {['Any Rating', '4.5 & Up', '4.0 & Up'].map((r) => (
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

            <div ref={productRef} className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium text-text-muted">{filteredChatbots.length} chatbots found</span>
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
                {filteredChatbots.slice(0, visibleCount).map((b) => (
                  <Link key={b.name} to={`/chatbots/${toSlug(b.name)}`}
                    className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-surface-container-low">
                      <img src={`https://picsum.photos/seed/${b.seed}/400/200`} alt={b.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(toSlug(b.name), 'chatbots'); }}
                        className="absolute top-2 right-2 p-1.5 bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-colors cursor-pointer"
                      >
                        <span className={`material-symbols-outlined ${isFavorite(toSlug(b.name), 'chatbots') ? 'text-red-500' : 'text-text-muted'}`}>
                          {isFavorite(toSlug(b.name), 'chatbots') ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-xs font-semibold text-text-main mb-1">{b.name}</h4>
                      <p className="text-[11px] font-medium text-text-muted mb-2">{b.desc}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] font-medium text-primary bg-primary-container/10 px-2 py-0.5 rounded">{b.platform}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between border-t border-border-light pt-3">
                        <div>
                          <span className="text-lg font-semibold text-text-main">{b.price}</span>
                          <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                            <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 12 }}>star</span>
                            {b.rating} · {b.sales} users
                          </div>
                        </div>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/chatbots/${toSlug(b.name)}/preview`) }} className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                          Deploy
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                {visibleCount < filteredChatbots.length && (
                  <button onClick={() => setVisibleCount(prev => prev + 6)} className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                    Load more chatbots
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 my-6 bg-surface-container-lowest border-y border-border-light">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col justify-center border border-border-light border-dashed rounded-xl p-8 bg-surface">
              <h2 className="text-[24px] font-semibold text-text-main mb-4">Featured Chatbot</h2>
              <p className="text-[15px] text-text-muted leading-relaxed mb-8">
                CustomerGPT powers 3.2k+ businesses with 24/7 AI support. Zero setup, instant deploy.
              </p>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold self-start hover:opacity-90 transition-opacity">
                View featured
              </button>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img src="https://picsum.photos/seed/featured-chatbot/800/200" alt="Featured Chatbot"
                className="col-span-1 sm:col-span-2 h-48 object-cover rounded-xl border border-border-light" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-text-main text-surface w-full py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-outline">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <span className="text-xl font-bold text-surface tracking-tight">AIAgents</span>
          <p className="text-[15px] text-secondary-fixed-dim mt-4 leading-relaxed">&copy; 2026 AI Agents Marketplace. 500+ chatbots available.</p>
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
            <div className="text-[24px] font-semibold text-surface mb-1">512</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Chatbots Live</div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">22.4k</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Active Deployments</div>
          </div>
        </div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
