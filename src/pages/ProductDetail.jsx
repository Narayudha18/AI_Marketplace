import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import templates from '../data/templates.json'
import integrations from '../data/integrations.json'
import chatbots from '../data/chatbots.json'
import automations from '../data/automation.json'
import tools from '../data/aitools.json'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const categoryConfig = {
  templates: {
    label: 'Templates', navLink: '/templates', icon: 'dashboard', badge: 'templates.market',
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/templates', label: 'Templates', active: true },
      { href: '/integrations', label: 'Integrations' },
      { href: '/chatbots', label: 'Chatbots' },
      { href: '/automation', label: 'Automation' },
      { href: '/ai-tools', label: 'AI Tools & APIs' },
    ],
    items: templates,
    nameKey: 'title',
    getRelated: (item) => templates.filter(t => t.category === item.category && t.title !== item.title).slice(0, 3),
  },
  integrations: {
    label: 'Integrations', navLink: '/integrations', icon: 'api', badge: 'integrations.market',
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/templates', label: 'Templates' },
      { href: '/integrations', label: 'Integrations', active: true },
      { href: '/chatbots', label: 'Chatbots' },
      { href: '/automation', label: 'Automation' },
      { href: '/ai-tools', label: 'AI Tools & APIs' },
    ],
    items: integrations,
    nameKey: 'name',
    getRelated: (item) => integrations.filter(t => t.category === item.category && t.name !== item.name).slice(0, 3),
  },
  chatbots: {
    label: 'Chatbots', navLink: '/chatbots', icon: 'smart_toy', badge: 'chatbots.market',
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/templates', label: 'Templates' },
      { href: '/integrations', label: 'Integrations' },
      { href: '/chatbots', label: 'Chatbots', active: true },
      { href: '/automation', label: 'Automation' },
      { href: '/ai-tools', label: 'AI Tools & APIs' },
    ],
    items: chatbots,
    nameKey: 'name',
    getRelated: (item) => chatbots.filter(t => t.category === item.category && t.name !== item.name).slice(0, 3),
  },
  automation: {
    label: 'Automation', navLink: '/automation', icon: 'sync_alt', badge: 'automation.market',
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/templates', label: 'Templates' },
      { href: '/integrations', label: 'Integrations' },
      { href: '/chatbots', label: 'Chatbots' },
      { href: '/automation', label: 'Automation', active: true },
      { href: '/ai-tools', label: 'AI Tools & APIs' },
    ],
    items: automations,
    nameKey: 'name',
    getRelated: (item) => automations.filter(t => t.category === item.category && t.name !== item.name).slice(0, 3),
  },
  'ai-tools': {
    label: 'AI Tools & APIs', navLink: '/ai-tools', icon: 'api', badge: 'tools.market',
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/templates', label: 'Templates' },
      { href: '/integrations', label: 'Integrations' },
      { href: '/chatbots', label: 'Chatbots' },
      { href: '/automation', label: 'Automation' },
      { href: '/ai-tools', label: 'AI Tools & APIs', active: true },
    ],
    items: tools,
    nameKey: 'name',
    getRelated: (item) => tools.filter(t => t.category === item.category && t.name !== item.name).slice(0, 3),
  },
};

export default function ProductDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const category = location.pathname.split('/')[1]
  const config = categoryConfig[category]
  if (!config) return null

  const item = config.items.find(i => toSlug(i[config.nameKey]) === slug)
  if (!item) return null

  const name = item.title || item.name
  const relatedItems = config.getRelated(item)

  const breadcrumbCat = category === 'ai-tools' ? 'AI Tools & APIs' : config.label

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    return (
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`material-symbols-outlined ${i < full ? 'text-amber-400' : 'text-gray-300'}`} style={{ fontSize: 16 }}>
            {i < full ? 'star' : 'star'}
          </span>
        ))}
      </span>
    )
  }

  return (
    <>
      <div className="bg-primary-container text-on-primary-container py-2 px-6 text-center text-xs font-semibold flex justify-center items-center gap-4">
        <span>Discover premium {config.label.toLowerCase()} on AI Agents Marketplace.</span>
        <button onClick={() => navigate(config.navLink)} className="bg-text-main text-surface px-4 py-1 rounded text-[11px] font-bold">Browse All</button>
      </div>

      <header className="bg-text-main flex flex-col w-full border-b border-outline-variant">
        <div className="px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-surface tracking-tight">AIAgents</a>
          <div className="flex items-center gap-6">
            <button className="text-surface-variant hover:text-surface transition-colors text-xs font-semibold">Start Selling</button>
            <div className="flex items-center gap-2 text-surface-variant hover:text-surface transition-colors text-xs font-semibold cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>apps</span>
              <span>Products</span>
            </div>
            <div className="flex items-center gap-4 pl-4 border-l border-outline">
              <span className="material-symbols-outlined text-surface-variant hover:text-surface cursor-pointer" style={{ fontSize: 20 }}>shopping_cart</span>
              <button className="text-surface text-xs font-semibold border border-surface px-4 py-1.5 rounded hover:bg-surface hover:text-text-main transition-colors">Sign In</button>
            </div>
          </div>
        </div>

        <div className="px-6 h-12 flex items-center justify-between border-t border-outline">
          <nav className="flex h-full">
            {config.navLinks.map(link => (
              <a key={link.href} href={link.href}
                className={`text-xs font-semibold flex items-center px-4 ${link.active ? 'text-primary border-b-2 border-primary pb-1' : 'text-surface-variant hover:text-surface transition-colors'}`}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="bg-surface-variant text-text-main px-4 py-1.5 rounded-t text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{config.icon}</span>
            {config.badge}
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border-light hidden md:flex px-6 h-12 items-center gap-2 text-xs">
        <a href="/" className="text-text-muted hover:text-primary transition-colors">Home</a>
        <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 14 }}>chevron_right</span>
        <a href={config.navLink} className="text-text-muted hover:text-primary transition-colors">{breadcrumbCat}</a>
        <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 14 }}>chevron_right</span>
        <span className="text-text-main font-semibold truncate max-w-[300px]">{name}</span>
      </div>

      <main className="w-full max-w-[1440px] mx-auto pb-16">
        <section className="px-6 py-10 flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-3/5">
            <div className="relative rounded-2xl overflow-hidden border border-border-light bg-surface-container-low">
              <img src={`https://picsum.photos/seed/${item.seed}-detail/800/500`} alt={name}
                className="w-full h-[400px] object-cover" />
            </div>
          </div>
          <div className="w-full lg:w-2/5 flex flex-col gap-5">
            <div>
              <h1 className="text-[28px] md:text-[34px] font-bold text-text-main leading-tight tracking-tight">{name}</h1>
              <div className="flex items-center gap-3 mt-2">
                {'rating' in item && (
                  <div className="flex items-center gap-1.5">
                    {renderStars(item.rating)}
                    <span className="text-xs font-semibold text-text-main">{item.rating}</span>
                  </div>
                )}
                {'sales' in item && (
                  <span className="text-xs font-medium text-text-muted">{item.sales}{'users' in item ? '' : ' users'}</span>
                )}
                {'users' in item && (
                  <span className="text-xs font-medium text-text-muted">{item.users} users</span>
                )}
              </div>
            </div>

            <p className="text-[15px] text-text-muted leading-relaxed">{item.desc}</p>

            <div className="flex flex-wrap gap-2">
              {'category' in item && item.category && (
                <span className="text-[11px] font-medium text-primary bg-primary-container/10 px-3 py-1 rounded">{item.category}</span>
              )}
              {'type' in item && (
                <span className="text-[11px] font-medium bg-surface-container-low text-text-muted px-3 py-1 rounded border border-border-light">{item.type}</span>
              )}
              {'platform' in item && (
                <span className="text-[11px] font-medium bg-surface-container-low text-text-muted px-3 py-1 rounded border border-border-light">{item.platform}</span>
              )}
              {'badge' in item && item.badge && (
                <span className={`text-[11px] font-bold px-2 py-1 rounded ${
                  item.badge === 'Popular' ? 'bg-primary-container/20 text-primary' :
                  item.badge === 'New' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{item.badge}</span>
              )}
            </div>

            {'author' in item && (
              <p className="text-xs font-medium text-text-muted">
                by <span className="text-primary cursor-pointer hover:underline">{item.author}</span>
              </p>
            )}

            <div className="border-t border-border-light pt-5 mt-2">
              {'price' in item && (
                <div className="mb-4">
                  <span className="text-[32px] font-bold text-text-main">{item.price}</span>
                  {'sales' in item && <span className="text-xs font-medium text-text-muted ml-3">{item.sales}</span>}
                </div>
              )}
              <div className="flex gap-3">
                <button className="flex-1 bg-primary text-surface px-6 py-3 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_cart</span>
                  Add to Cart
                </button>
                <button className="px-4 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-surface transition-colors text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>favorite_border</span>
                </button>
                <button className="px-4 py-3 border border-border-light text-text-muted rounded-lg hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-text-muted border-t border-border-light pt-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
                Verified Product
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>update</span>
                Updated 2 days ago
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>headset_mic</span>
                24/7 Support
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-12 bg-surface-container-low rounded-3xl mx-6 my-6">
          <h2 className="text-[22px] font-semibold text-text-main mb-6">About this product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-[15px] text-text-muted leading-relaxed mb-4">
                {name} is a premium {config.label.toLowerCase().slice(0, -1)} available on the AI Agents Marketplace.
                Built with modern best practices, it's designed to help you achieve more with less effort.
              </p>
              <p className="text-[15px] text-text-muted leading-relaxed">
                Whether you're a developer, designer, or business owner, this product integrates seamlessly
                into your workflow and scales with your needs.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { icon: 'check_circle', text: 'Quality assured by our curation team' },
                { icon: 'check_circle', text: 'Regular updates & improvements' },
                { icon: 'check_circle', text: 'Community & expert support' },
                { icon: 'check_circle', text: 'Secure checkout & instant access' },
              ].map((f) => (
                <div key={f.icon} className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>{f.icon}</span>
                  <span className="text-sm font-medium text-text-muted">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-12">
          <h2 className="text-[22px] font-semibold text-text-main mb-6">Screenshots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl overflow-hidden border border-border-light bg-surface-container-low">
                <img src={`https://picsum.photos/seed/${item.seed}-ss${i}/600/400`} alt={`${name} screenshot ${i}`}
                  className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </section>

        {relatedItems.length > 0 && (
          <section className="px-6 py-12 bg-surface-container-low rounded-3xl mx-6 my-6">
            <h2 className="text-[22px] font-semibold text-text-main mb-6">Related {config.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedItems.map(r => {
                const rName = r.title || r.name
                return (
                  <Link key={rName} to={`/${category}/${toSlug(rName)}`}
                    className="bg-surface rounded-xl border border-border-light overflow-hidden hover:shadow-md transition-all hover:border-primary flex group">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-surface-container-low">
                      <img src={`https://picsum.photos/seed/${r.seed}/150/150`} alt={rName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3 flex flex-col justify-center min-w-0">
                      <h4 className="text-xs font-semibold text-text-main truncate">{rName}</h4>
                      {'price' in r && <span className="text-[11px] font-medium text-text-muted mt-0.5">{r.price}</span>}
                      {'rating' in r && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 12 }}>star</span>
                          <span className="text-[11px] font-medium text-text-muted">{r.rating}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-text-main text-surface w-full py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-outline">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <span className="text-xl font-bold text-surface tracking-tight">AIAgents</span>
          <p className="text-[15px] text-secondary-fixed-dim mt-4 leading-relaxed">&copy; 2026 AI Agents Marketplace. All rights reserved.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">{config.label}</h4>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Top Rated</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Newest</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Featured</a>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">Help</h4>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Help Center</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Authors</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Sitemap</a>
        </div>
        <div className="col-span-2 md:col-span-1 flex flex-col gap-6 justify-end items-start md:items-end mt-8 md:mt-0">
          <button onClick={() => navigate(config.navLink)}
            className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
            Back to {config.label}
          </button>
        </div>
      </footer>
    </>
  );
}
