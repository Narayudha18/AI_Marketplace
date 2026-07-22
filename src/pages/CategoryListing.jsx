import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import templates from '../data/templates.json'
import integrations from '../data/integrations.json'
import chatbots from '../data/chatbots.json'
import automations from '../data/automation.json'
import tools from '../data/aitools.json'
import { useCart } from '../CartContext'
import CartDrawer from '../components/CartDrawer'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const categoryConfig = {
  templates: {
    label: 'Templates', icon: 'dashboard', badge: 'templates.market', singular: 'template',
    banner: 'Premium UI templates & starter kits for modern web apps.',
    heroTitle: 'Production-ready templates to ship faster',
    heroDesc: 'Jumpstart your next project with premium UI templates, dashboard kits, and full-page layouts built by top designers.',
    heroImg: 'templates-hero',
    searchPlaceholder: 'e.g. Admin dashboard',
    allLabel: 'All Templates',
    items: templates, nameKey: 'title',
    dataFilterKey: 'category',
    filterCategories: ['All Templates', 'Dashboards', 'Landing Pages', 'E-commerce', 'Portfolios', 'Blogs', 'Mobile Apps', 'UI Kits', 'Admin Panels'],
    filterMap: {},
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/templates', label: 'Templates', active: true },
      { href: '/integrations', label: 'Integrations' },
      { href: '/chatbots', label: 'Chatbots' },
      { href: '/automation', label: 'Automation' },
      { href: '/ai-tools', label: 'AI Tools & APIs' },
    ],
  },
  integrations: {
    label: 'Integrations', icon: 'api', badge: 'integrations.market', singular: 'integration',
    banner: 'Connect your stack with 300+ AI integrations & API connectors.',
    heroTitle: 'Connect your AI stack with 300+ integrations',
    heroDesc: 'Plug in LLMs, vector databases, voice APIs, and productivity tools. One API to connect them all.',
    heroImg: 'integrations-hero',
    searchPlaceholder: 'e.g. OpenAI, LangChain, Pinecone',
    allLabel: 'All Integrations',
    items: integrations, nameKey: 'name',
    dataFilterKey: 'category',
    filterCategories: ['All Integrations', 'LLM Providers', 'Vector DB', 'Voice AI', 'Image Gen', 'Frameworks', 'Model Hosting', 'Compute', 'Monitoring'],
    filterMap: { 'LLM Providers': 'LLM Providers', 'Vector DB': 'Vector DB', 'Voice AI': 'Voice AI', 'Image Gen': 'Image Gen', 'Frameworks': 'Frameworks', 'Model Hosting': 'Model Hosting', 'Compute': 'Compute', 'Monitoring': 'Monitoring' },
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/templates', label: 'Templates' },
      { href: '/integrations', label: 'Integrations', active: true },
      { href: '/chatbots', label: 'Chatbots' },
      { href: '/automation', label: 'Automation' },
      { href: '/ai-tools', label: 'AI Tools & APIs' },
    ],
  },
  chatbots: {
    label: 'Chatbots', icon: 'smart_toy', badge: 'chatbots.market', singular: 'chatbot',
    banner: 'Deploy intelligent chatbots with zero coding. 500+ pre-built agents.',
    heroTitle: 'AI chatbots that actually understand your business',
    heroDesc: 'Deploy GPT-powered chatbots for support, sales, HR, and more. Trained on your data, live in minutes.',
    heroImg: 'chatbots-hero',
    searchPlaceholder: 'e.g. Customer support chatbot',
    allLabel: 'All Chatbots',
    items: chatbots, nameKey: 'name',
    dataFilterKey: 'platform',
    filterCategories: ['All Chatbots', 'Customer Support', 'Sales', 'HR', 'Education', 'Healthcare', 'Finance', 'Developer Tools', 'Productivity'],
    filterMap: { 'Customer Support': 'Web', 'Sales': 'Web + API', 'HR': 'Slack + Web', 'Education': 'Web + Mobile', 'Healthcare': 'Web', 'Finance': 'API', 'Developer Tools': 'GitHub', 'Productivity': 'Web' },
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/templates', label: 'Templates' },
      { href: '/integrations', label: 'Integrations' },
      { href: '/chatbots', label: 'Chatbots', active: true },
      { href: '/automation', label: 'Automation' },
      { href: '/ai-tools', label: 'AI Tools & APIs' },
    ],
  },
  automation: {
    label: 'Automation', icon: 'sync_alt', badge: 'automation.market', singular: 'automation',
    banner: 'Automate repetitive tasks with AI-powered workflows. Save 20+ hours/week.',
    heroTitle: 'Automate your workflow with AI precision',
    heroDesc: 'From marketing sequences to DevOps pipelines — build, deploy, and monitor automation that works while you sleep.',
    heroImg: 'automation-hero',
    searchPlaceholder: 'e.g. Email automation workflow',
    allLabel: 'All Automations',
    items: automations, nameKey: 'name',
    dataFilterKey: 'category',
    filterCategories: ['All Automations', 'Workflow', 'Marketing', 'Sales', 'Data', 'Finance', 'DevOps', 'HR', 'Social Media'],
    filterMap: { 'Workflow': 'Workflow', 'Marketing': 'Marketing', 'Sales': 'Sales', 'Data': 'Data', 'Finance': 'Finance', 'DevOps': 'DevOps', 'HR': 'HR', 'Social Media': 'Social' },
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/templates', label: 'Templates' },
      { href: '/integrations', label: 'Integrations' },
      { href: '/chatbots', label: 'Chatbots' },
      { href: '/automation', label: 'Automation', active: true },
      { href: '/ai-tools', label: 'AI Tools & APIs' },
    ],
  },
  'ai-tools': {
    label: 'AI Tools & APIs', icon: 'api', badge: 'tools.market', singular: 'tool',
    banner: 'Access 1,000+ AI tools & APIs. One marketplace, infinite possibilities.',
    heroTitle: 'The largest catalog of AI tools & APIs',
    heroDesc: 'From GPT-4o to Stable Diffusion — find, compare, and connect to 1,000+ AI APIs and SDKs in one place.',
    heroImg: 'aitools-hero',
    searchPlaceholder: 'e.g. GPT-4o, Stable Diffusion, Whisper',
    allLabel: 'All Tools',
    items: tools, nameKey: 'name',
    dataFilterKey: 'category',
    filterCategories: ['All Tools', 'LLM APIs', 'Image Gen', 'Audio/Speech', 'Vector DB', 'Compute', 'Frameworks', 'Monitoring'],
    filterMap: { 'LLM APIs': 'LLM', 'Image Gen': 'Image', 'Audio/Speech': 'Audio', 'Vector DB': 'Infra', 'Compute': 'Compute', 'Frameworks': 'Framework', 'Monitoring': 'LLM' },
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/templates', label: 'Templates' },
      { href: '/integrations', label: 'Integrations' },
      { href: '/chatbots', label: 'Chatbots' },
      { href: '/automation', label: 'Automation' },
      { href: '/ai-tools', label: 'AI Tools & APIs', active: true },
    ],
  },
}

export default function CategoryListing() {
  const { totalItems, toggleFavorite, isFavorite } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()
  const parts = location.pathname.split('/')
  const category = parts[1]
  const filterSlug = parts[3] || ''
  const config = categoryConfig[category]
  if (!config) return null

  const [sidebarSearch, setSidebarSearch] = useState('')
  const [appliedSidebar, setAppliedSidebar] = useState('')

  const applyFilters = () => setAppliedSidebar(sidebarSearch)

  const filterName = config.filterCategories.find(c => c !== config.allLabel && toSlug(c) === filterSlug) || config.allLabel
  const isAll = filterName === config.allLabel
  const filterValue = config.filterMap[filterName]

  const subFiltered = isAll
    ? config.items
    : config.items.filter(item => item[config.dataFilterKey] === filterValue)

  const filteredItems = subFiltered.filter(item => {
    const q = appliedSidebar.toLowerCase()
    if (!q) return true
    const name = (item.title || item.name).toLowerCase()
    const desc = (item.desc || '').toLowerCase()
    return name.includes(q) || desc.includes(q)
  })

  const basePath = `/${category}`

  return (
    <>
      <div className="bg-primary-container text-on-primary-container py-2 px-6 text-center text-xs font-semibold flex justify-center items-center gap-4">
        <span>{config.banner}</span>
        <Link to={basePath} className="bg-text-main text-surface px-4 py-1 rounded text-[11px] font-bold">{isAll ? 'Browse All' : 'View All'}</Link>
      </div>

      <header className="bg-text-main flex flex-col w-full border-b border-outline-variant">
        <div className="px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-surface tracking-tight">AIAgents</Link>
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
            {config.navLinks.map(link => (
              <Link key={link.href} to={link.href}
                className={`text-xs font-semibold flex items-center px-4 ${link.active ? 'text-primary border-b-2 border-primary pb-1' : 'text-surface-variant hover:text-surface transition-colors'}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="bg-surface-variant text-text-main px-4 py-1.5 rounded-t text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{config.icon}</span>
            {config.badge}
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border-light hidden md:flex px-6 h-12 items-center gap-6 overflow-x-auto">
        {config.filterCategories.map(item => {
          const itemSlug = item === config.allLabel ? '' : toSlug(item)
          const to = itemSlug ? `${basePath}/c/${itemSlug}` : basePath
          return (
            <Link key={item} to={to}
              className={`text-xs font-semibold whitespace-nowrap ${item === filterName ? 'text-primary border-b-2 border-primary pb-[2px]' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
              {item}
            </Link>
          )
        })}
      </div>

      <main className="w-full max-w-[1440px] mx-auto pb-16">
        <section className="px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main">
              {filterName === config.allLabel ? config.heroTitle : `${filterName} ${config.label}`}
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              {filterName === config.allLabel ? config.heroDesc : `Browse our curated collection of ${filterName.toLowerCase()} ${config.singular}s.`}
            </p>
            <div className="flex w-full max-w-lg bg-surface rounded-lg shadow-sm border border-border-light p-1">
              <input type="text" placeholder={config.searchPlaceholder}
                className="flex-1 border-none focus:ring-0 px-4 py-3 text-[15px] bg-transparent outline-none" />
              <button className="bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity px-6 rounded text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
                Search
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative h-[400px]">
            <img src={`https://picsum.photos/seed/${config.heroImg}-${filterSlug || 'all'}/600/400`}
              alt={config.label}
              className="w-full h-full object-cover rounded-2xl border border-border-light" />
          </div>
        </section>

        <section className="px-6 py-10 bg-surface-container-low rounded-3xl mx-6 my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.filterCategories.filter(c => c !== config.allLabel).slice(0, 4).map(cat => (
              <Link key={cat} to={`${basePath}/c/${toSlug(cat)}`}
                className="bg-surface rounded-xl shadow-sm border border-border-light p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-primary text-4xl mb-3">{config.icon}</span>
                <h3 className="text-lg font-semibold text-text-main">{cat}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-surface rounded-xl border border-border-light p-5 sticky top-4">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2.5 border border-border-light mb-6">
                  <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>search</span>
                  <input type="text" placeholder={`Search ${config.singular}s...`} value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="flex-1 border-none bg-transparent text-xs font-medium outline-none placeholder:text-text-muted" />
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-main mb-3 uppercase tracking-wider">Category</h4>
                  <div className="space-y-2.5">
                    {config.filterCategories.map(cat => {
                      const catSlug = cat === config.allLabel ? '' : toSlug(cat)
                      return (
                        <Link key={cat} to={catSlug ? `${basePath}/c/${catSlug}` : basePath}
                          className={`block text-xs font-medium transition-colors ${cat === filterName ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}>
                          {cat}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <button onClick={applyFilters}
                  className="w-full mt-6 bg-primary-container text-on-primary-container py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                  Search
                </button>
                <button onClick={() => { setSidebarSearch(''); setAppliedSidebar('') }}
                  className="w-full mt-2 bg-surface border border-border-light text-text-muted py-2.5 rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-opacity">
                  Clear
                </button>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium text-text-muted">{filteredItems.length} {config.singular}s found</span>
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
                {filteredItems.map(item => {
                  const itemName = item.title || item.name
                  const slug = toSlug(itemName)
                  const detailPath = `${basePath}/${slug}`
                  return (
                    <Link key={itemName} to={detailPath}
                      className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                      <div className="relative h-40 overflow-hidden bg-surface-container-low">
                        <img src={`https://picsum.photos/seed/${item.seed}/400/200`} alt={itemName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(slug, category) }}
                          className="absolute top-2 right-2 p-1.5 bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-colors cursor-pointer">
                          <span className={`material-symbols-outlined ${isFavorite(slug, category) ? 'text-red-500' : 'text-text-muted'}`} style={{ fontSize: 18 }}>{isFavorite(slug, category) ? 'favorite' : 'favorite_border'}</span>
                        </button>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="text-xs font-semibold text-text-main mb-1 line-clamp-1">{itemName}</h4>
                        {'desc' in item && (
                          <p className="text-[11px] font-medium text-text-muted mb-2">{item.desc}</p>
                        )}
                        {'author' in item && (
                          <p className="text-[11px] font-medium text-text-muted mb-3">
                            by <span className="text-primary hover:underline">{item.author}</span> in {item.category}
                          </p>
                        )}
                        {'category' in item && item.category && !('author' in item) && (
                          <span className="text-[11px] font-medium text-primary bg-primary-container/10 px-2 py-0.5 rounded self-start mb-3">{item.category}</span>
                        )}
                        {'platform' in item && (
                          <span className="text-[11px] font-medium text-primary bg-primary-container/10 px-2 py-0.5 rounded self-start mb-3">{item.platform}</span>
                        )}
                        <div className="mt-auto flex items-center justify-between border-t border-border-light pt-3">
                          {'price' in item && (
                            <div>
                              <span className="text-lg font-semibold text-text-main">{item.price}</span>
                              {'rating' in item && (
                                <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                                  <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 12 }}>star</span>
                                  {item.rating} · {item.sales || item.users}
                                </div>
                              )}
                            </div>
                          )}
                          {'rating' in item && !('price' in item) && (
                            <div className="flex items-center gap-2 text-[11px] text-text-muted">
                              <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 14 }}>star</span>
                              <span className="font-medium">{item.rating}</span>
                              <span>·</span>
                              <span>{item.users} users</span>
                            </div>
                          )}
                          <button className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                            {'type' in item ? 'Connect' : 'badge' in item ? 'Access' : 'Preview'}
                          </button>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-16">
                  <span className="material-symbols-outlined text-text-muted text-5xl mb-4 block">search_off</span>
                  <p className="text-text-muted text-sm">No {config.singular}s found in this category.</p>
                  <Link to={basePath} className="mt-4 inline-block bg-primary-container text-on-primary-container px-6 py-2.5 rounded text-xs font-semibold">
                    View all {config.singular}s
                  </Link>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <Link to={basePath}
                  className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
                  Load more {config.singular}s
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-text-main text-surface w-full py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-outline">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <Link to="/" className="text-xl font-bold text-surface tracking-tight">AIAgents</Link>
          <p className="text-[15px] text-secondary-fixed-dim mt-4 leading-relaxed">&copy; 2026 AI Agents Marketplace. All rights reserved.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">{config.label}</h4>
          {config.filterCategories.filter(c => c !== config.allLabel).slice(0, 4).map(cat => (
            <Link key={cat} to={`${basePath}/c/${toSlug(cat)}`}
              className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">
              {cat}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">Help</h4>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Help Center</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Authors</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Sitemap</a>
        </div>
        <div className="col-span-2 md:col-span-1 flex flex-col gap-6 justify-end items-start md:items-end mt-8 md:mt-0">
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">{filteredItems.length}</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">{config.singular.charAt(0).toUpperCase() + config.singular.slice(1)}s Available</div>
          </div>
          <Link to={basePath}
            className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
            Browse All
          </Link>
        </div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
