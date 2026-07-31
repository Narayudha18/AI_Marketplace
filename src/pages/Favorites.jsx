import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import templates from '../data/templates.json'
import integrations from '../data/integrations.json'
import chatbots from '../data/chatbots.json'
import automations from '../data/automation.json'
import aitools from '../data/aitools.json'
import voiceAi from '../data/voice-ai.json'
import imageGen from '../data/image-gen.json'
import analytics from '../data/analytics.json'
import fineTuning from '../data/fine-tuning.json'
import monitoring from '../data/monitoring.json'
import security from '../data/security.json'
import { readSellerProducts } from '../lib/storage'

const dataMap = {
  templates: { items: templates, nameKey: 'title', nav: '/templates' },
  integrations: { items: integrations, nameKey: 'name', nav: '/integrations' },
  chatbots: { items: chatbots, nameKey: 'name', nav: '/chatbots' },
  automation: { items: automations, nameKey: 'name', nav: '/automation' },
  'ai-tools': { items: aitools, nameKey: 'name', nav: '/ai-tools' },
  'voice-ai': { items: voiceAi, nameKey: 'title', nav: '/voice-ai' },
  'image-gen': { items: imageGen, nameKey: 'title', nav: '/image-gen' },
  analytics: { items: analytics, nameKey: 'title', nav: '/analytics' },
  'fine-tuning': { items: fineTuning, nameKey: 'title', nav: '/fine-tuning' },
  monitoring: { items: monitoring, nameKey: 'title', nav: '/monitoring' },
  security: { items: security, nameKey: 'title', nav: '/security' },
}

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function Favorites() {
  const { favorites, toggleFavorite } = useCart()

  const favItems = []
  const sellerProducts = readSellerProducts()
  for (const fav of favorites) {
    const source = dataMap[fav.category]
    if (!source) continue
    let item = source.items.find(i => toSlug(i[source.nameKey]) === fav.slug)
    if (!item) item = sellerProducts.find(p => p.category === fav.category && toSlug(p.title) === fav.slug)
    if (item) favItems.push({ ...item, category: fav.category, nav: source.nav, nameKey: source.nameKey })
  }

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-main">My Favorites</h1>
            <p className="text-sm text-text-muted mt-1">{favItems.length} saved product{favItems.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {favItems.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-text-muted text-6xl mb-4 block">favorite</span>
            <h2 className="text-lg font-semibold text-text-main mb-2">No favorites yet</h2>
            <p className="text-sm text-text-muted mb-6">Browse products and click the heart icon to save them here.</p>
            <Link to="/templates" className="bg-primary text-surface px-6 py-2.5 rounded-lg text-sm font-semibold inline-block hover:opacity-90 transition-opacity">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favItems.map(item => {
              const itemName = item.title || item.name
              const slug = toSlug(itemName)
              return (
                <div key={`${item.category}-${slug}`} className="group bg-surface border border-border-light rounded-xl overflow-hidden hover:shadow-lg hover:border-primary transition-all relative">
                  <button onClick={() => toggleFavorite(slug, item.category)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center z-10 hover:bg-white transition-all cursor-pointer shadow-sm">
                    <span className="material-symbols-outlined text-red-500" style={{ fontSize: 18 }}>favorite</span>
                  </button>
                  <Link to={`${item.nav}/${slug}`}>
                    <div className="aspect-[4/3] bg-surface-container-low overflow-hidden">
                      <img src={`https://picsum.photos/seed/${item.seed}/400/300`} alt={itemName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-text-main line-clamp-1 group-hover:text-primary transition-colors">{itemName}</p>
                      {'price' in item && <p className="text-[11px] font-semibold text-text-main mt-0.5">{item.price}</p>}
                      {'rating' in item && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-yellow-500 text-xs" style={{ fontSize: 12 }}>star</span>
                          <span className="text-[10px] font-medium text-text-muted">{item.rating}</span>
                        </div>
                      )}
                      <p className="text-[10px] text-text-muted mt-0.5 capitalize">{item.category}</p>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
