import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import templates from '../data/templates.json'
import integrations from '../data/integrations.json'
import chatbots from '../data/chatbots.json'
import automation from '../data/automation.json'
import aitools from '../data/aitools.json'

const dataMap = {
  templates: { items: templates, nameKey: 'title', nav: '/templates' },
  integrations: { items: integrations, nameKey: 'name', nav: '/integrations' },
  chatbots: { items: chatbots, nameKey: 'name', nav: '/chatbots' },
  automation: { items: automation, nameKey: 'name', nav: '/automation' },
  'ai-tools': { items: aitools, nameKey: 'name', nav: '/ai-tools' },
}

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function FavoriteRecommendations() {
  const { favorites } = useCart()

  if (favorites.length === 0) return null

  const favKeys = new Set(favorites.map(f => `${f.category}-${f.slug}`))
  const favDataKeys = [...new Set(favorites.map(f => f.category))]

  const seen = new Set()
  const recommendations = []

  for (const dataKey of favDataKeys) {
    const source = dataMap[dataKey]
    if (!source) continue
    for (const item of source.items) {
      const slug = toSlug(item.title || item.name)
      const key = `${dataKey}-${slug}`
      if (!favKeys.has(key) && !seen.has(key)) {
        seen.add(key)
        recommendations.push({ ...item, _slug: slug, _nav: source.nav, _dataKey: dataKey })
        if (recommendations.length >= 12) break
      }
    }
    if (recommendations.length >= 12) break
  }

  if (recommendations.length === 0) return null

  return (
    <section className="px-6 mt-12">
      <h2 className="text-[22px] font-semibold text-text-main mb-1">Because you liked...</h2>
      <p className="text-xs text-text-muted mb-6">Product recommendations based on your favorites</p>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recommendations.map(item => {
          const itemName = item.title || item.name
          const seed = item.seed || item._slug
          return (
            <Link key={`${item._dataKey}-${item._slug}`} to={`${item._nav}/${item._slug}`}
              className="group bg-surface border border-border-light rounded-xl overflow-hidden hover:shadow-lg hover:border-primary transition-all">
              <div className="aspect-[4/3] bg-surface-container-low overflow-hidden">
                <img src={`https://picsum.photos/seed/${seed}/400/300`} alt={itemName}
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
                <p className="text-[10px] text-text-muted mt-0.5 capitalize">{item._dataKey}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
