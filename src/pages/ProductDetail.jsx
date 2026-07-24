import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import CartDrawer from '../components/CartDrawer'
import AuthButton from '../components/AuthButton'
import { useTheme } from '../ThemeContext'
import { useLanguage } from '../i18n/context'
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
    getRelated: (item) => templates.filter(t => t.title !== item.title).slice(0, 3),
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
    getRelated: (item) => integrations.filter(t => t.name !== item.name).slice(0, 3),
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
    getRelated: (item) => chatbots.filter(t => t.name !== item.name).slice(0, 3),
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
    getRelated: (item) => automations.filter(t => t.name !== item.name).slice(0, 3),
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
    getRelated: (item) => tools.filter(t => t.name !== item.name).slice(0, 3),
  },
  'voice-ai': {
    label: 'Voice AI', navLink: '/voice-ai', icon: 'record_voice_over', badge: 'voice.market',
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/voice-ai', label: 'Voice AI', active: true },
    ],
    items: voiceAi,
    nameKey: 'title',
    getRelated: (item) => voiceAi.filter(t => t.title !== item.title).slice(0, 3),
  },
  'image-gen': {
    label: 'Image Gen', navLink: '/image-gen', icon: 'image', badge: 'image.market',
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/image-gen', label: 'Image Gen', active: true },
    ],
    items: imageGen,
    nameKey: 'title',
    getRelated: (item) => imageGen.filter(t => t.title !== item.title).slice(0, 3),
  },
  analytics: {
    label: 'Analytics', navLink: '/analytics', icon: 'analytics', badge: 'analytics.market',
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/analytics', label: 'Analytics', active: true },
    ],
    items: analyticsData,
    nameKey: 'title',
    getRelated: (item) => analyticsData.filter(t => t.title !== item.title).slice(0, 3),
  },
  'fine-tuning': {
    label: 'Fine-tuning', navLink: '/fine-tuning', icon: 'tune', badge: 'finetune.market',
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/fine-tuning', label: 'Fine-tuning', active: true },
    ],
    items: fineTuningData,
    nameKey: 'title',
    getRelated: (item) => fineTuningData.filter(t => t.title !== item.title).slice(0, 3),
  },
  monitoring: {
    label: 'Monitoring', navLink: '/monitoring', icon: 'monitoring', badge: 'monitor.market',
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/monitoring', label: 'Monitoring', active: true },
    ],
    items: monitoringData,
    nameKey: 'title',
    getRelated: (item) => monitoringData.filter(t => t.title !== item.title).slice(0, 3),
  },
  security: {
    label: 'Security', navLink: '/security', icon: 'security', badge: 'secure.market',
    navLinks: [
      { href: '/', label: 'AI Agents' },
      { href: '/security', label: 'Security', active: true },
    ],
    items: securityData,
    nameKey: 'title',
    getRelated: (item) => securityData.filter(t => t.title !== item.title).slice(0, 3),
  },
};

export default function ProductDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const parts = location.pathname.split('/')
  const category = parts[1]
  const slug = parts[2]
  const config = categoryConfig[category]
  if (!config) return null

  const item = config.items.find(i => toSlug(i[config.nameKey]) === slug)
  if (!item) return null

  const name = item.title || item.name
  const relatedItems = config.getRelated(item)

  const { addToCart, inCart, hasPurchased, toggleFavorite, isFavorite } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('product')
  const reviewKey = `reviews_${category}_${slug}`
  const commentKey = `comments_${category}_${slug}`
  const [reviews, setReviews] = useState(() => {
    try {
      const local = JSON.parse(localStorage.getItem(reviewKey)) || []
      const jsonReviews = item.reviews || []
      return [...jsonReviews, ...local]
    } catch { return item.reviews || [] }
  })
  const [comments, setComments] = useState(() => {
    try { return JSON.parse(localStorage.getItem(commentKey)) || [] } catch { return [] }
  })
  const [reviewName, setReviewName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    localStorage.setItem(reviewKey, JSON.stringify(reviews))
  }, [reviews, reviewKey])
  useEffect(() => {
    localStorage.setItem(commentKey, JSON.stringify(comments))
  }, [comments, commentKey])

  const cartItem = { slug, category, seed: item.seed, title: item.title, name: item.name, price: item.price }

  const submitReview = (e) => {
    e.preventDefault()
    if (!reviewName.trim() || !reviewText.trim() || reviewRating === 0) return
    setReviews(prev => [...prev, {
      name: reviewName.trim(), text: reviewText.trim(), rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
    }])
    setReviewName(''); setReviewText(''); setReviewRating(0)
  }

  const submitComment = (e) => {
    e.preventDefault()
    if (!commentName.trim() || !commentText.trim()) return
    setComments(prev => [...prev, {
      name: commentName.trim(), text: commentText.trim(),
      date: new Date().toISOString().split('T')[0],
    }])
    setCommentName(''); setCommentText('')
  }

  const tutorialSteps = [
    {
      title: 'Download & Install',
      desc: 'After checkout, download the product files from your purchase dashboard. Extract the archive and open the project folder in your favorite editor (VS Code, WebStorm, etc.).',
    },
    {
      title: 'Initial Configuration',
      desc: `Open the main config file and customize ${category === 'templates' ? 'branding, logo, theme colors, and database connection' : category === 'chatbots' ? 'API key, LLM model, and system prompts' : category === 'automation' ? 'triggers, actions, and integration connections' : category === 'integrations' ? 'API credentials, endpoint URL, and access scopes' : category === 'ai-tools' ? 'API key, model parameters, and rate limits' : category === 'voice-ai' ? 'voice model, language, and audio output settings' : category === 'image-gen' || category === 'fine-tuning' ? 'model parameters, training data path, and output format' : category === 'analytics' ? 'data sources, metrics, and dashboard layout' : category === 'monitoring' ? 'alert thresholds, notification channels, and data sources' : category === 'security' ? 'rule sets, whitelist/blacklist, and logging config' : 'default settings to match your needs'}.`,
    },
    {
      title: 'Integration & Testing',
      desc: `Connect ${category === 'templates' ? 'the template to your framework' : 'the product to your existing stack'} using the included integration guide. Run the built-in test suite to verify all components work correctly before going to production.`,
    },
    {
      title: 'Customization',
      desc: `Customize ${category === 'templates' ? 'the appearance, layout, and UI components' : category === 'chatbots' ? 'personality, knowledge base, and conversation flow' : category === 'automation' ? 'workflow logic, conditions, and action mappings' : 'functionality and product behavior'} to fit your specific project needs. API documentation and customization guides are available in the /docs folder.`,
    },
    {
      title: 'Deploy to Production',
      desc: 'Deploy using your hosting platform of choice (Vercel, Netlify, AWS, or private server). Follow the deployment guide in the documentation for environment variable setup and performance optimization.',
    },
  ]

  const aboutFeatures = [
    { icon: 'verified', text: `${name} has passed rigorous curation to ensure quality and security` },
    { icon: 'update', text: 'Regular updates with latest features and bug fixes every month' },
    { icon: 'support_agent', text: 'Priority support via email & forum with average response &lt; 6 hours' },
    { icon: 'api', text: `Comprehensive documentation with code examples for ${category === 'templates' ? 'React, Next.js & Vue' : category === 'chatbots' ? 'REST API, WebSocket & SDK' : category === 'automation' ? 'webhook, REST API & CLI' : 'REST API, SDK & CLI'}` },
    { icon: 'lock', text: 'Secure licensing, SSL encryption, and copyright protection' },
    { icon: 'devices', text: `Compatible with ${category === 'templates' ? 'all modern browsers & frameworks' : 'major platforms & cloud environments'}` },
  ]

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const breadcrumbCat = category === 'ai-tools' ? 'AI Tools & APIs' : config.label

  const renderStars = (rating, size = 16) => {
    const full = Math.floor(rating)
    return (
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`material-symbols-outlined ${i < full ? 'text-amber-400' : 'text-gray-300'}`} style={{ fontSize: size }}>
            {i < full ? 'star' : 'star_border'}
          </span>
        ))}
      </span>
    )
  }

  return (
    <>
      <div className="bg-gradient-to-r from-primary-container to-blue-600 text-on-primary-container px-6 py-2.5 text-center text-xs font-semibold flex justify-center items-center gap-3">
        <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{t('productDetail.new')}</span>
        <span>{t('productDetail.discoverBanner')} {config.label.toLowerCase()} {t('productDetail.onMarketplace')}</span>
        <button onClick={() => navigate(config.navLink)} className="bg-text-main text-surface px-4 py-1.5 rounded text-[11px] font-bold hover:opacity-90 transition-opacity">{t('productDetail.browseAll')}</button>
      </div>

      <header className="bg-text-main flex flex-col w-full sticky top-0 z-40">
        <div className="px-6 h-14 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="text-lg font-bold text-surface tracking-tight">AIAgents</Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: t('nav.home') },
              { to: '/templates', label: t('nav.templates') },
              { to: '/integrations', label: t('nav.integrations') },
              { to: '/chatbots', label: t('nav.chatbots') },
              { to: '/automation', label: t('nav.automation') },
              { to: '/ai-tools', label: t('nav.aiTools') },
            ].map(link => {
              const isNavActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
              return (
                <Link key={link.to} to={link.to} state={{ skipScroll: true }}
                  className={`text-xs font-semibold px-3 py-2 rounded-md transition-all relative ${isNavActive ? 'text-primary' : 'text-surface-variant hover:text-surface'}`}>
                  {link.label}
                  {isNavActive && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/start-selling" className="hidden sm:flex text-surface-variant hover:text-surface transition-colors text-xs font-semibold">{t('productDetail.startSelling')}</Link>
            <button onClick={() => setCartOpen(true)} className="relative text-surface-variant hover:text-surface transition-colors cursor-pointer p-1.5 flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_cart</span>
              {inCart(slug, category) && <span className="absolute -top-0.5 -right-0.5 bg-primary text-surface text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</span>}
            </button>
            <button onClick={toggle} className="text-surface-variant hover:text-surface transition-colors cursor-pointer p-1.5 flex items-center justify-center"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>{dark ? 'light_mode' : 'dark_mode'}</span></button>
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border-light hidden md:flex px-6 h-12 items-center gap-2 text-xs">
        <a href="/" className="text-text-muted hover:text-primary transition-colors">{t('productDetail.home')}</a>
        <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 14 }}>chevron_right</span>
        <a href={config.navLink} className="text-text-muted hover:text-primary transition-colors">{breadcrumbCat}</a>
        <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 14 }}>chevron_right</span>
        <span className="text-text-main font-semibold truncate max-w-[300px]">{name}</span>
      </div>

      <section className="px-6 py-8 border-b border-border-light">
        <div className="flex gap-0">
          {[
            { key: 'product', label: t('productDetail.tabs.0'), icon: 'shopping_bag' },
            { key: 'reviews', label: t('productDetail.tabs.1'), icon: 'star_rate' },
            { key: 'comments', label: t('productDetail.tabs.2'), icon: 'forum' },
            { key: 'support', label: t('productDetail.tabs.3'), icon: 'headset_mic' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-main'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <main className="w-full max-w-[1440px] mx-auto pb-16">
        {activeTab === 'product' && (
        <section className="px-6 py-10 flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-3/5">
            <div className="relative rounded-2xl overflow-hidden border border-border-light bg-surface-container-low">
              <img src={`https://picsum.photos/seed/${item.seed}-detail/800/500`} alt={name}
                className="w-full h-[400px] object-cover" />
            </div>
          </div>
          <div className="w-full lg:w-2/5 flex flex-col gap-5">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-[28px] md:text-[34px] font-bold text-text-main leading-tight tracking-tight">{name}</h1>
              </div>
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
                {t('productDetail.by')} <span className="text-primary cursor-pointer hover:underline">{item.author}</span>
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
                <button onClick={() => navigate(`/${category}/${slug}/preview`)} className="flex-1 bg-primary text-surface px-6 py-3 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>visibility</span>
                  {t('productDetail.preview')}
                </button>
                <button onClick={() => { addToCart(cartItem); setCartOpen(true) }} className="px-4 py-3 border border-primary text-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-surface transition-all flex items-center gap-2 cursor-pointer">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_cart</span>
                  {t('productDetail.addToCart')}
                </button>
                <button onClick={() => toggleFavorite(slug, category)} className={`px-4 py-3 border rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${isFavorite(slug, category) ? 'bg-red-50 border-red-200 text-red-500' : 'border-primary text-primary hover:bg-primary hover:text-surface'}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{isFavorite(slug, category) ? 'favorite' : 'favorite_border'}</span>
                </button>
                <button className="px-4 py-3 border border-border-light text-text-muted rounded-lg hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-text-muted border-t border-border-light pt-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
                {t('productDetail.verified')}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>update</span>
                {t('productDetail.updated')}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>headset_mic</span>
                {t('productDetail.support247')}
              </div>
            </div>
          </div>
        </section>
        )}

        {activeTab === 'reviews' && (
          <section className="px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {reviews.length === 0 ? (
                  <p className="text-sm text-text-muted">{t('productDetail.noReviews')}</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r, idx) => (
                      <div key={idx} className="bg-surface border border-border-light rounded-xl p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-xs font-bold text-primary uppercase">
                              {r.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-text-main">{r.name}</p>
                              <p className="text-[11px] text-text-muted">{r.date}</p>
                            </div>
                          </div>
                          {renderStars(r.rating, 14)}
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                {avgRating && (
                  <div className="bg-surface border border-border-light rounded-xl p-5 mb-6 text-center">
                    <div className="text-[36px] font-bold text-text-main">{avgRating}</div>
                    {renderStars(Math.round(parseFloat(avgRating)), 18)}
                    <p className="text-xs text-text-muted mt-2">{reviews.length} {t('productDetail.reviews')}</p>
                  </div>
                )}
                {hasPurchased(slug, category) ? (
                  <form onSubmit={submitReview} className="bg-surface border border-border-light rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-text-main mb-4">{t('productDetail.writeReview')}</h3>
                    <div className="mb-4">
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} type="button" onClick={() => setReviewRating(s)}
                            onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
                            className={`material-symbols-outlined transition-colors ${(hoverRating || reviewRating) >= s ? 'text-amber-400' : 'text-gray-300'} hover:text-amber-400`} style={{ fontSize: 28 }}>
                            {(hoverRating || reviewRating) >= s ? 'star' : 'star_border'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">{t('productDetail.yourName')}</label>
                      <input type="text" value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder={t('productDetail.yourNamePlaceholder')}
                        className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary placeholder:text-text-muted" />
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">{t('productDetail.yourReview')}</label>
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder={t('productDetail.reviewPlaceholder')} rows={3}
                        className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary placeholder:text-text-muted resize-none" />
                    </div>
                    <button type="submit" disabled={!reviewName.trim() || !reviewText.trim() || reviewRating === 0}
                      className="w-full bg-primary text-surface py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <div className="bg-surface border border-border-light rounded-xl p-6 text-center">
                    <span className="material-symbols-outlined text-primary text-4xl mb-3 block">lock</span>
                    <h3 className="text-sm font-semibold text-text-main mb-2">You haven't purchased this product yet</h3>
                    <p className="text-xs text-text-muted mb-4">Only buyers can leave a rating & review. Checkout this product to write a review.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'comments' && (
          <section className="px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {comments.length === 0 ? (
                  <p className="text-sm text-text-muted">{t('productDetail.noComments')}</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((c, idx) => (
                      <div key={idx} className="bg-surface border border-border-light rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-xs font-bold text-primary uppercase">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-text-main">{c.name}</p>
                            <p className="text-[11px] text-text-muted">{c.date}</p>
                          </div>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <form onSubmit={submitComment} className="bg-surface border border-border-light rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-text-main mb-4">{t('productDetail.writeComment')}</h3>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Name</label>
                    <input type="text" value={commentName} onChange={e => setCommentName(e.target.value)} placeholder="Your name"
                      className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary placeholder:text-text-muted" />
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Komentar</label>
                    <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a comment..." rows={3}
                      className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary placeholder:text-text-muted resize-none" />
                  </div>
                  <button type="submit" disabled={!commentName.trim() || !commentText.trim()}
                    className="w-full bg-primary text-surface py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">
                    Submit Comment
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'support' && (
          <section className="px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface border border-border-light rounded-xl p-6 text-center">
                <span className="material-symbols-outlined text-primary text-4xl mb-3 block">mail</span>
                <h4 className="text-sm font-semibold text-text-main mb-1">{t('productDetail.emailSupport')}</h4>
                <p className="text-xs text-text-muted">{t('productDetail.supportEmail')}</p>
                <p className="text-[11px] text-text-muted mt-1">{t('productDetail.responseTime')}</p>
              </div>
              <div className="bg-surface border border-border-light rounded-xl p-6 text-center">
                <span className="material-symbols-outlined text-primary text-4xl mb-3 block">forum</span>
                <h4 className="text-sm font-semibold text-text-main mb-1">{t('productDetail.discussionForum')}</h4>
                <p className="text-xs text-text-muted">{t('productDetail.qaCommunity')}</p>
                <p className="text-[11px] text-text-muted mt-1">{t('productDetail.activeMembers')}</p>
              </div>
              <div className="bg-surface border border-border-light rounded-xl p-6 text-center">
                <span className="material-symbols-outlined text-primary text-4xl mb-3 block">description</span>
                <h4 className="text-sm font-semibold text-text-main mb-1">{t('productDetail.documentation')}</h4>
                <p className="text-xs text-text-muted">{t('productDetail.guidesTutorials')}</p>
                <p className="text-[11px] text-text-muted mt-1">{t('productDetail.weeklyUpdates')}</p>
              </div>
            </div>
          </section>
        )}

        <section className="px-6 py-12 bg-surface-container-low rounded-3xl mx-6 my-6">
          <h2 className="text-[22px] font-semibold text-text-main mb-2">{t('productDetail.about')}</h2>
          <p className="text-sm text-text-muted mb-6">{t('productDetail.aboutDesc')} {name}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <p className="text-[15px] text-text-muted leading-relaxed">
                {name} is a premium {config.label.toLowerCase().slice(0, -1)} available exclusively
                on the AI Agents Marketplace. Designed by <strong className="text-text-main">{item.author || 'AI Agents Team'}</strong>,
                this product combines cutting-edge technology with an intuitive user experience.
              </p>
              <p className="text-[15px] text-text-muted leading-relaxed">
                {category === 'templates' ? 'With ready-made components and responsive design, this template lets you launch applications faster without sacrificing quality. Every element is optimized for maximum performance and accessibility.' :
                category === 'chatbots' ? 'Powered by advanced AI models, this chatbot handles complex conversations with deep contextual understanding. RAG integration enables access to a knowledge base that updates in real-time.' :
                category === 'automation' ? 'Smart automation that eliminates repetitive manual tasks. With a visual workflow builder and pre-built connectors to 100+ services, you can build complex pipelines without coding.' :
                category === 'integrations' ? 'A reliable connection bridge between various AI platforms and your favorite tools. Built with a fault-tolerant architecture to ensure stable connections even under high load.' :
                category === 'ai-tools' ? 'A powerful API toolkit to integrate AI capabilities into your applications. Supports multiple modalities — text, image, audio, and video — in one unified SDK.' :
                category === 'voice-ai' ? 'A complete voice AI solution with text-to-speech, speech-to-text, and voice cloning. Supports 100+ languages with near-human naturalness.' :
                category === 'image-gen' ? 'An AI-powered image generator with high precision control. From text-to-image to image-to-image, the built-in editor makes fine-tuning results easy without external apps.' :
                category === 'fine-tuning' ? 'A fine-tuning platform that lets you customize AI models with your own dataset, without expensive GPU infrastructure. Automated hyperparameter tuning for optimal results.' :
                category === 'analytics' ? 'A smart analytics dashboard that turns raw data into actionable insights. With AI-driven anomaly detection and forecasting for better decision making.' :
                category === 'monitoring' ? 'A real-time monitoring system with intelligent alerting and intuitive visualizations. Automatically detect anomalies before they impact your users.' :
                category === 'security' ? 'An AI-powered security layer that protects your applications from cyber threats. Real-time intrusion detection, suspicious behavior analysis, and automated response.' :
                'A versatile product designed to meet your specific needs with high performance and reliability.'}
              </p>
              <p className="text-[15px] text-text-muted leading-relaxed">
                Suitable for developers, product teams, and enterprises looking to adopt AI quickly
                without infrastructure complexity. With comprehensive documentation and an active community,
                you'll never feel alone in your implementation journey.
              </p>
            </div>
            <div className="space-y-3">
              {aboutFeatures.map((f) => (
                <div key={f.icon} className="flex items-start gap-3 bg-surface p-3 rounded-xl border border-border-light">
                  <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: 20 }}>{f.icon}</span>
                  <span className="text-sm text-text-muted leading-relaxed">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-12">
          <h2 className="text-[22px] font-semibold text-text-main mb-2">{t('productDetail.howToUse')}</h2>
          <p className="text-sm text-text-muted mb-6">Step-by-step guide to get started</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tutorialSteps.map((step, idx) => (
              <div key={idx} className="bg-surface border border-border-light rounded-xl p-5 hover:shadow-md transition-shadow relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-surface rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-semibold text-text-main mb-2 mt-1">{step.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-12 bg-surface-container-low rounded-3xl mx-6 my-6">
          <h2 className="text-[22px] font-semibold text-text-main mb-2">{t('productDetail.screenshots')}</h2>
          <p className="text-sm text-text-muted mb-6">Product interface previews</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`rounded-xl overflow-hidden border border-border-light bg-surface-container-low group ${i === 1 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                <img src={`https://picsum.photos/seed/${item.seed}-ss${i}/${i === 1 ? '800/500' : '600/400'}`} alt={`${name} screenshot ${i}`}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${i === 1 ? 'h-80' : 'h-52'}`} />
              </div>
            ))}
          </div>
        </section>

        {relatedItems.length > 0 && (
          <section className="px-6 py-12 bg-surface-container-low rounded-3xl mx-6 my-6">
            <h2 className="text-[22px] font-semibold text-text-main mb-6">{t('productDetail.related')}</h2>
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
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">{t('productDetail.marketplace')}</h4>
          <Link to="/terms" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('productDetail.terms')}</Link>
          <Link to="/licenses" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('productDetail.licenses')}</Link>
          <Link to="/api" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('productDetail.api')}</Link>
          <Link to="/privacy" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('productDetail.privacy')}</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">{t('productDetail.help')}</h4>
          <Link to="/help" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('productDetail.helpCenter')}</Link>
          <Link to="/authors" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('productDetail.authors')}</Link>
          <Link to="/sitemap" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('productDetail.sitemap')}</Link>
        </div>

      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
