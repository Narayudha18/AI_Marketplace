import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useTheme } from '../ThemeContext'
import templates from '../data/templates.json'
import integrations from '../data/integrations.json'
import chatbots from '../data/chatbots.json'
import automations from '../data/automation.json'
import tools from '../data/aitools.json'
import voiceAi from '../data/voice-ai.json'
import imageGen from '../data/image-gen.json'
import analyticsData from '../data/analytics.json'
import fineTuningData from '../data/fine-tuning.json'
import monitoringData from '../data/monitoring.json'
import securityData from '../data/security.json'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const dataMap = {
  templates: { items: templates, nameKey: 'title' },
  integrations: { items: integrations, nameKey: 'name' },
  chatbots: { items: chatbots, nameKey: 'name' },
  automation: { items: automations, nameKey: 'name' },
  'ai-tools': { items: tools, nameKey: 'name' },
  'voice-ai': { items: voiceAi, nameKey: 'title' },
  'image-gen': { items: imageGen, nameKey: 'title' },
  analytics: { items: analyticsData, nameKey: 'title' },
  'fine-tuning': { items: fineTuningData, nameKey: 'title' },
  monitoring: { items: monitoringData, nameKey: 'title' },
  security: { items: securityData, nameKey: 'title' },
}

const categoryLabels = {
  templates: 'Templates', integrations: 'Integrations', chatbots: 'Chatbots',
  automation: 'Automation', 'ai-tools': 'AI Tools & APIs', 'voice-ai': 'Voice AI',
  'image-gen': 'Image Gen', analytics: 'Analytics', 'fine-tuning': 'Fine-tuning',
  monitoring: 'Monitoring', security: 'Security',
}

const categoryNavLinks = {
  templates: '/templates', integrations: '/integrations', chatbots: '/chatbots',
  automation: '/automation', 'ai-tools': '/ai-tools', 'voice-ai': '/voice-ai',
  'image-gen': '/image-gen', analytics: '/analytics', 'fine-tuning': '/fine-tuning',
  monitoring: '/monitoring', security: '/security',
}

const sampleVideos = [
  { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', label: 'Product Overview' },
  { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', label: 'Feature Demo' },
  { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', label: 'Tutorial Walkthrough' },
  { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', label: 'Integration Showcase' },
]

export default function ProductGallery() {
  const { category, slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const source = dataMap[category]
  if (!source) return null

  const item = source.items.find(i => toSlug(i[source.nameKey]) === slug)
  if (!item) return null

  const name = item.title || item.name
  const { dark, toggle } = useTheme()

  const totalImages = 30

  return (
    <>
      <header className="bg-text-main flex flex-col w-full sticky top-0 z-40">
        <div className="px-6 h-14 flex items-center justify-between border-b border-white/5">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-surface hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            <span className="text-xs font-semibold">Back</span>
          </button>
          <Link to="/" className="text-lg font-bold text-surface tracking-tight">AIAgents</Link>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="text-surface-variant hover:text-surface transition-colors cursor-pointer p-1.5 flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1440px] mx-auto pb-16">
        <section className="px-6 py-8">
          <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <Link to={categoryNavLinks[category] || '/'} className="hover:text-primary transition-colors">{categoryLabels[category] || category}</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <Link to={`/${category}/${slug}`} className="hover:text-primary transition-colors">{name}</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-text-main font-semibold">Preview</span>
          </div>

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-text-main">{name}</h1>
              <p className="text-sm text-text-muted mt-1">{totalImages} screenshots & {sampleVideos.length} demo videos</p>
            </div>
            <Link to={`/${category}/${slug}`}
              className="px-5 py-2.5 bg-primary text-surface rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
              View Details
            </Link>
          </div>

          <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>photo_library</span>
            Screenshots
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: totalImages }, (_, i) => i + 1).map(i => {
              const seed = `${item.seed}-g${i}-${(i * 13 + i * i * 3) % 997}`
              return (
              <div key={i}
                className={`rounded-xl overflow-hidden border border-border-light bg-surface-container-low group ${i === 1 ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
                <img src={`https://picsum.photos/seed/${seed}/${i === 1 ? '1400/650' : '800/500'}`}
                  alt={`${name} screenshot ${i}`}
                  className={`w-full object-cover group-hover:scale-[1.02] transition-transform duration-300 cursor-pointer ${i === 1 ? 'h-[250px] sm:h-[350px] md:h-[500px]' : 'h-40 sm:h-52 md:h-64'}`}
                  onClick={() => window.open(`https://picsum.photos/seed/${seed}/1920/1080`, '_blank')} />
              </div>
            )})}
          </div>

          <h2 className="text-lg font-semibold text-text-main mt-12 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>play_circle</span>
            Video Demos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sampleVideos.map((v, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-border-light bg-surface-container-low group">
                <div className="relative">
                  <video
                    src={v.src}
                    className="w-full h-48 sm:h-64 md:h-72 object-cover"
                    autoPlay muted loop playsInline controls
                    preload="auto"
                    poster={`https://picsum.photos/seed/${item.seed}-vid${idx}/800/450`}
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-text-main">{v.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
