import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import templates from '../data/templates.json'
import integrations from '../data/integrations.json'
import chatbots from '../data/chatbots.json'
import automations from '../data/automation.json'
import aitools from '../data/aitools.json'
import voiceAi from '../data/voice-ai.json'
import imageGen from '../data/image-gen.json'
import analyticsData from '../data/analytics.json'
import fineTuningData from '../data/fine-tuning.json'
import monitoringData from '../data/monitoring.json'
import securityData from '../data/security.json'
import { useLanguage } from '../i18n/context'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const allProducts = [
  ...templates.map(p => ({ ...p, _cat: 'templates', _name: p.title })),
  ...integrations.map(p => ({ ...p, _cat: 'integrations', _name: p.name })),
  ...chatbots.map(p => ({ ...p, _cat: 'chatbots', _name: p.name })),
  ...automations.map(p => ({ ...p, _cat: 'automation', _name: p.name })),
  ...aitools.map(p => ({ ...p, _cat: 'ai-tools', _name: p.name })),
  ...voiceAi.map(p => ({ ...p, _cat: 'voice-ai', _name: p.title })),
  ...imageGen.map(p => ({ ...p, _cat: 'image-gen', _name: p.title })),
  ...analyticsData.map(p => ({ ...p, _cat: 'analytics', _name: p.title })),
  ...fineTuningData.map(p => ({ ...p, _cat: 'fine-tuning', _name: p.title })),
  ...monitoringData.map(p => ({ ...p, _cat: 'monitoring', _name: p.title })),
  ...securityData.map(p => ({ ...p, _cat: 'security', _name: p.title })),
]

const filters = [
  { label: 'All categories', to: '/templates', match: () => true },
  { label: 'ChatGPT Agents', to: '/chatbots', match: (p) => (p.category || '').toLowerCase() === 'chatbots' || p._name?.toLowerCase().includes('chat') || p._name?.toLowerCase().includes('gpt') || p._name?.toLowerCase().includes('bot') },
  { label: 'Voice AI', to: '/voice-ai', match: (p) => p._cat === 'voice-ai' || (p.category || '').toLowerCase() === 'voice ai' || p._name?.toLowerCase().includes('voice') },
  { label: 'Automation', to: '/automation', match: (p) => p._cat === 'automation' || (p.category || '').toLowerCase() === 'automation' || p._name?.toLowerCase().includes('workflow') || p._name?.toLowerCase().includes('auto') },
  { label: 'RAG', to: '/integrations', match: (p) => (p.category || '').toLowerCase().includes('rag') || p._name?.toLowerCase().includes('rag') || p._name?.toLowerCase().includes('knowledge') || p._name?.toLowerCase().includes('vector') },
  { label: 'Vision', to: '/ai-tools', match: (p) => (p.category || '').toLowerCase() === 'computer vision' || p._name?.toLowerCase().includes('vision') || p._name?.toLowerCase().includes('cortex') || p._name?.toLowerCase().includes('image') },
]

export default function ProductGrid() {
  const navigate = useNavigate()
  const gridRef = useRef(null)
  const [activeFilter, setActiveFilter] = useState('All categories')
  const { t } = useLanguage()
  const filtered = allProducts.filter(p => filters.find(f => f.label === activeFilter).match(p))

  const handleFilterClick = (label) => {
    setActiveFilter(label)
  }

  return (
    <section className="px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-[24px] font-semibold text-text-main mb-4">
          {t('productGrid.heading')}
        </h2>
        <p className="text-[15px] text-text-muted max-w-3xl mx-auto leading-relaxed">
          {t('productGrid.desc')}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {filters.map((f) => (
          <button key={f.label} onClick={() => handleFilterClick(f.label)}
            className={`px-6 py-2 rounded-full text-xs font-semibold shadow-sm transition-colors cursor-pointer ${
              activeFilter === f.label
                ? 'bg-surface border-2 border-primary text-primary'
                : 'bg-surface border border-border-light text-text-muted hover:border-outline-variant hover:text-text-main'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.slice(0, 8).map((p) => (
          <Link key={p._name} to={`/${p._cat}/${toSlug(p._name)}`}
            className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
            <div className="relative h-40 overflow-hidden bg-surface-container-low">
              <img src={`https://picsum.photos/seed/${p.seed || p._name}/400/200`} alt={p._name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h4 className="text-xs font-semibold text-text-main mb-1 line-clamp-1">{p._name}</h4>
              <p className="text-[11px] font-medium text-text-muted mb-3">
                {t('productGrid.by')} <span className="text-primary cursor-pointer hover:underline">{p.author || t('productGrid.team')}</span>
                {'category' in p && <span> {t('productGrid.in')} {p.category}</span>}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border-light pt-3">
                <div>
                  <span className="text-[24px] font-semibold text-text-main block">{p.price || t('productGrid.free')}</span>
                  <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                    <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 12 }}>star</span>
                    <span className="font-medium">{p.rating}</span>
                    <span>·</span>
                    <span>{p.reviews.length} {t('productGrid.reviews')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-border-light rounded hover:bg-surface-container-low text-text-muted transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_cart</span>
                  </button>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/${p._cat}/${toSlug(p._name)}/preview`) }} className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                    {t('productGrid.livePreview')}
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to={filters.find(f => f.label === activeFilter).to}
          className="inline-block bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
          {t('productGrid.viewMore')}
        </Link>
      </div>
    </section>
  );
}
