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
import agentsData from '../data/ai-agents.json'
import promptsData from '../data/ai-prompts.json'
import skillsData from '../data/ai-skills.json'
import tokensData from '../data/ai-tokens.json'
import workflowsData from '../data/ai-workflows.json'
import { readSellerProducts } from '../lib/storage'
import SellerLink from './SellerLink'

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
  ...agentsData.map(p => ({ ...p, _cat: 'ai-agents', _name: p.name })),
  ...promptsData.map(p => ({ ...p, _cat: 'ai-prompts', _name: p.name })),
  ...skillsData.map(p => ({ ...p, _cat: 'ai-skills', _name: p.name })),
  ...tokensData.map(p => ({ ...p, _cat: 'ai-tokens', _name: p.name })),
  ...workflowsData.map(p => ({ ...p, _cat: 'ai-workflows', _name: p.name })),
]

const filters = [
  { label: 'All categories', to: '/templates', match: () => true },
  { label: 'ChatGPT Agents', to: '/chatbots', match: (p) => (p.category || '').toLowerCase() === 'chatbots' || p._name?.toLowerCase().includes('chat') || p._name?.toLowerCase().includes('gpt') || p._name?.toLowerCase().includes('bot') },
  { label: 'Voice AI', to: '/voice-ai', match: (p) => p._cat === 'voice-ai' || (p.category || '').toLowerCase() === 'voice ai' || p._name?.toLowerCase().includes('voice') },
  { label: 'Automation', to: '/automation', match: (p) => p._cat === 'automation' || (p.category || '').toLowerCase() === 'automation' || p._name?.toLowerCase().includes('workflow') || p._name?.toLowerCase().includes('auto') },
  { label: 'RAG', to: '/integrations', match: (p) => (p.category || '').toLowerCase().includes('rag') || p._name?.toLowerCase().includes('rag') || p._name?.toLowerCase().includes('knowledge') || p._name?.toLowerCase().includes('vector') },
  { label: 'Vision', to: '/ai-tools', match: (p) => (p.category || '').toLowerCase() === 'computer vision' || p._name?.toLowerCase().includes('vision') || p._name?.toLowerCase().includes('cortex') || p._name?.toLowerCase().includes('image') },
  { label: 'AI Agents', to: '/ai-agents', match: (p) => p._cat === 'ai-agents' || (p.category || '').toLowerCase() === 'ai agents' || p._name?.toLowerCase().includes('agent') },
  { label: 'AI Prompts', to: '/ai-prompts', match: (p) => p._cat === 'ai-prompts' || (p.category || '').toLowerCase() === 'ai prompts' || p._name?.toLowerCase().includes('prompt') },
  { label: 'AI Skills', to: '/ai-skills', match: (p) => p._cat === 'ai-skills' || (p.category || '').toLowerCase() === 'ai skills' || p._name?.toLowerCase().includes('skill') },
  { label: 'AI Tokens', to: '/ai-tokens', match: (p) => p._cat === 'ai-tokens' || (p.category || '').toLowerCase() === 'ai tokens' || p._name?.toLowerCase().includes('token') || p._name?.toLowerCase().includes('credit') || p._name?.toLowerCase().includes('quota') },
  { label: 'AI Workflows', to: '/ai-workflows', match: (p) => p._cat === 'ai-workflows' || (p.category || '').toLowerCase() === 'ai workflows' || p._name?.toLowerCase().includes('workflow') },
]

export default function ProductGrid() {
  const navigate = useNavigate()
  const gridRef = useRef(null)
  const [activeFilter, setActiveFilter] = useState('All categories')
  const sellerItems = readSellerProducts().map(p => ({ ...p, _cat: p.category, _name: p.title }))
  const gridProducts = [...allProducts, ...sellerItems]
  const filtered = gridProducts.filter(p => filters.find(f => f.label === activeFilter).match(p))

  const handleFilterClick = (label) => {
    setActiveFilter(label)
  }

  return (
    <section className="px-6 sm:px-10 py-20">
      <div className="flex flex-col gap-4 border-b border-dashed border-[var(--color-border-light)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            — 02 / catalog
          </span>
          <h2 className="mt-3 text-[clamp(2rem,6vw,4.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-[var(--color-text-main)]">
            newest ai agents &amp; tools
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[var(--color-text-muted)]">
          We carefully review new entries from our community to make sure they meet high-quality
          standards for production AI deployment.
        </p>
      </div>

      <div className="mt-8 flex gap-7 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => handleFilterClick(f.label)}
            className={`whitespace-nowrap border-b-2 pb-1 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
              activeFilter === f.label
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.slice(0, 8).map((p) => (
          <Link
            key={p._name}
            to={`/${p._cat}/${toSlug(p._name)}`}
            className="group flex flex-col border border-[var(--color-border-light)] bg-[var(--color-surface)] transition-colors hover:border-[var(--color-primary)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-container-low)]">
              <img
                src={`https://picsum.photos/seed/${p.seed || p._name}/400/300`}
                alt={p._name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-0 top-0 bg-[var(--color-background)] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                {'category' in p ? p.category : p._cat}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="line-clamp-1 text-sm font-medium text-[var(--color-text-main)]">{p._name}</h4>
                <span
                  className="material-symbols-outlined shrink-0 text-[var(--color-text-muted)] transition-all group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:text-[var(--color-primary)]"
                  style={{ fontSize: 18 }}
                >
                  north_east
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                by <SellerLink sellerId={p.sellerId} author={p.author} />
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-dashed border-[var(--color-border-light)] pt-3">
                <div>
                  <span className="block text-lg font-medium text-[var(--color-text-main)]">{p.price || 'Free'}</span>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
                    <span className="material-symbols-outlined text-amber-500" style={{ fontSize: 12 }}>star</span>
                    <span className="font-medium">{p.rating}</span>
                    <span>·</span>
                    <span>{p.reviews?.length ?? 0} reviews</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    aria-label="Add to cart"
                    className="flex h-8 w-8 items-center justify-center border border-dashed border-[var(--color-border-light)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>shopping_cart</span>
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/${p._cat}/${toSlug(p._name)}/preview`) }}
                    className="border border-transparent px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex justify-center border-t border-b border-dashed border-[var(--color-border-light)]">
        <Link
          to={filters.find(f => f.label === activeFilter).to}
          className="py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-main)] transition-colors hover:text-[var(--color-primary)]"
        >
          View more new items <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}