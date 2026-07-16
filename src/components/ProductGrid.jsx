import { Link } from 'react-router-dom'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const filters = [
  { label: 'All categories', to: '/templates' },
  { label: 'ChatGPT Agents', to: '/chatbots' },
  { label: 'Voice AI', to: '/ai-tools/c/audio-speech' },
  { label: 'Automation', to: '/automation' },
  { label: 'RAG', to: '/integrations' },
  { label: 'Vision', to: '/ai-tools' },
]

const products = [
  { title: 'AgentForge | Multi-LLM Orchestrator', author: 'saaadelab', category: 'Frameworks', price: '$79', sales: '234 Sales', seed: 'agentforge' },
  { title: 'VoiceFlow Pro | Voice Assistant SDK', author: 'morningstar', category: 'Voice AI', price: '$59', sales: '189 Sales', seed: 'voiceflow' },
  { title: 'VisionCortex | Real-time Object Detector', author: 'ticempresarial', category: 'Computer Vision', price: '$99', sales: '312 Sales', seed: 'visioncortex' },
  { title: 'ChatCraft | Custom GPT Builder', author: 'Rado-Labs', category: 'Chatbots', price: '$49', sales: '567 Sales', seed: 'chatcraft' },
  { title: 'DataPulse | Analytics Agent', author: 'neuralforge', category: 'Analytics', price: '$69', sales: '98 Sales', seed: 'datapulse' },
  { title: 'SecureGate | AI Guardrails', author: 'cybermind', category: 'Security', price: '$89', sales: '76 Sales', seed: 'securegate' },
  { title: 'RAGStack | Knowledge Base Agent', author: 'deeplearn', category: 'RAG Pipelines', price: '$109', sales: '145 Sales', seed: 'ragstack' },
  { title: 'AutoWorkflow | Process Automation', author: 'flowlabs', category: 'Automation', price: '$39', sales: '423 Sales', seed: 'autoworkflow' },
];

export default function ProductGrid() {
  return (
    <section className="px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-[24px] font-semibold text-text-main mb-4">
          Check out our newest AI agents & tools
        </h2>
        <p className="text-[15px] text-text-muted max-w-3xl mx-auto leading-relaxed">
          We carefully review new entries from our community to make sure they meet high-quality standards for production AI deployment.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {filters.map((f) => (
          <Link key={f.label} to={f.to}
            className={`px-6 py-2 rounded-full text-xs font-semibold shadow-sm transition-colors ${
              f.label === 'All categories'
                ? 'bg-surface border-2 border-primary text-primary'
                : 'bg-surface border border-border-light text-text-muted hover:border-outline-variant hover:text-text-main'
            }`}>
            {f.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link key={p.title} to={`/templates/${toSlug(p.title)}`}
            className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
            <div className="relative h-40 overflow-hidden bg-surface-container-low">
              <img src={`https://picsum.photos/seed/${p.seed}/400/200`} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h4 className="text-xs font-semibold text-text-main mb-1 line-clamp-1">{p.title}</h4>
              <p className="text-[11px] font-medium text-text-muted mb-3">
                by <span className="text-primary cursor-pointer hover:underline">{p.author}</span> in {p.category}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border-light pt-3">
                <div>
                  <span className="text-[24px] font-semibold text-text-main block">{p.price}</span>
                  <span className="text-[11px] font-medium text-text-muted">{p.sales}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-border-light rounded hover:bg-surface-container-low text-text-muted transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_cart</span>
                  </button>
                  <button className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                    Live Preview
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/templates"
          className="inline-block bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
          View more new items
        </Link>
      </div>
    </section>
  );
}
