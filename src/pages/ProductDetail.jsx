import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import { useAuth } from '../AuthContext'
import CartDrawer from '../components/CartDrawer'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { readSellerProducts } from '../lib/storage'
import SellerLink from '../components/SellerLink'
import { toSlug, PRODUCT_CATALOG, findProduct, getAvgRating, getProductReviews } from '../data/product-catalog'

const categoryMeta = {
  templates: { badge: 'templates.market', icon: 'dashboard', navLink: '/templates' },
  integrations: { badge: 'integrations.market', icon: 'api', navLink: '/integrations' },
  chatbots: { badge: 'chatbots.market', icon: 'smart_toy', navLink: '/chatbots' },
  automation: { badge: 'automation.market', icon: 'sync_alt', navLink: '/automation' },
  'ai-tools': { badge: 'tools.market', icon: 'api', navLink: '/ai-tools' },
  'voice-ai': { badge: 'voice.market', icon: 'record_voice_over', navLink: '/voice-ai' },
  'image-gen': { badge: 'image.market', icon: 'image', navLink: '/image-gen' },
  analytics: { badge: 'analytics.market', icon: 'analytics', navLink: '/analytics' },
  'fine-tuning': { badge: 'finetune.market', icon: 'tune', navLink: '/fine-tuning' },
  monitoring: { badge: 'monitor.market', icon: 'monitoring', navLink: '/monitoring' },
  security: { badge: 'secure.market', icon: 'security', navLink: '/security' },
  'ai-agents': { badge: 'aiagents.market', icon: 'smart_toy', navLink: '/ai-agents' },
  'ai-prompts': { badge: 'aiprompts.market', icon: 'edit_note', navLink: '/ai-prompts' },
  'ai-skills': { badge: 'aiskills.market', icon: 'psychology', navLink: '/ai-skills' },
  'ai-tokens': { badge: 'aitokens.market', icon: 'token', navLink: '/ai-tokens' },
  'ai-workflows': { badge: 'aiworkflows.market', icon: 'account_tree', navLink: '/ai-workflows' },
}

const navLinks = [
  { href: '/', label: 'AI Agents' },
  { href: '/templates', label: 'Templates' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/chatbots', label: 'Chatbots' },
  { href: '/automation', label: 'Automation' },
  { href: '/ai-tools', label: 'AI Tools & APIs' },
]

function renderStars(rating, size = 16) {
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

export default function ProductDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const parts = location.pathname.split('/')
  const category = parts[1]
  const slug = parts[2]
  const config = PRODUCT_CATALOG[category]
  const meta = categoryMeta[category]

  const { item } = findProduct(category, slug)

  const { addToCart, hasPurchased, toggleFavorite, isFavorite } = useCart()
  const { currentUser } = useAuth()
  const [cartOpen, setCartOpen] = useState(false)
  const [loginToast, setLoginToast] = useState(false)
  const [activeTab, setActiveTab] = useState('product')
  const reviewKey = `reviews_${category}_${slug}`
  const commentKey = `comments_${category}_${slug}`
  const [reviews, setReviews] = useState(() => {
    try {
      const local = JSON.parse(localStorage.getItem(reviewKey)) || []
      const jsonReviews = (item && item.reviews) || []
      return [...jsonReviews, ...local]
    } catch { return (item && item.reviews) || [] }
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

  if (!item || !config || !meta) return null

  const name = item.title || item.name
  const relatedItems = config.items
    .filter(t => (t.title || t.name) !== name)
    .slice(0, 3)

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

  return (
    <>
      <div className="bg-primary-container text-on-primary-container px-6 py-2.5 text-center text-xs font-semibold flex justify-center items-center gap-3">
        <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">New</span>
        <span>Discover premium {config.label.toLowerCase()} on AI Agents Marketplace.</span>
        <button onClick={() => navigate(meta.navLink)} className="bg-text-main text-surface px-4 py-1.5 rounded text-[11px] font-bold hover:opacity-90 transition-opacity">Browse All</button>
      </div>

      <Navbar />

      <div className="bg-surface border-b border-border-light hidden md:flex px-6 h-12 items-center gap-2 text-xs">
        <a href="/" className="text-text-muted hover:text-primary transition-colors">Home</a>
        <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 14 }}>chevron_right</span>
        <a href={meta.navLink} className="text-text-muted hover:text-primary transition-colors">{breadcrumbCat}</a>
        <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 14 }}>chevron_right</span>
        <span className="text-text-main font-semibold truncate max-w-[300px]">{name}</span>
      </div>

      <section className="px-6 py-8 border-b border-border-light">
        <div className="flex gap-0">
          {[
            { key: 'product', label: 'Product', icon: 'shopping_bag' },
            { key: 'reviews', label: 'Review & Rating', icon: 'star_rate' },
            { key: 'comments', label: 'Comments', icon: 'forum' },
            { key: 'support', label: 'Support', icon: 'headset_mic' },
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
                className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover" />
            </div>
          </div>
          <div className="w-full lg:w-2/5 flex flex-col gap-5">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-[28px] md:text-[34px] font-bold text-text-main leading-tight tracking-tight">{name}</h1>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  {renderStars(avgRating ? parseFloat(avgRating) : (item.rating || 0))}
                  <span className="text-xs font-semibold text-text-main">{avgRating || item.rating || '0.0'}</span>
                </div>
                {reviews.length > 0 && (
                  <span className="text-xs font-medium text-text-muted">({reviews.length} review{reviews.length > 1 ? 's' : ''})</span>
                )}
                {'sales' in item && (
                  <span className="text-xs font-medium text-text-muted">&middot; {item.sales}{'users' in item ? '' : item.sellerId ? ' sales' : ' users'}</span>
                )}
                {'users' in item && (
                  <span className="text-xs font-medium text-text-muted">&middot; {item.users} users</span>
                )}
              </div>
            </div>

            <p className="text-[15px] text-text-muted leading-relaxed">{item.desc || item.description}</p>

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

            {(item.sellerId || 'author' in item) && (
              <p className="text-xs font-medium text-text-muted">
                by <SellerLink sellerId={item.sellerId} author={item.author} />
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
                  Live Preview
                </button>
                <button onClick={() => { if (!currentUser) { setLoginToast(true); setTimeout(() => navigate('/login'), 1500); return }; addToCart(cartItem); setCartOpen(true) }} className="px-4 py-3 border border-primary text-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-surface transition-all flex items-center gap-2 cursor-pointer">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_cart</span>
                  Add to Cart
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
        )}

        {activeTab === 'reviews' && (
          <section className="px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {reviews.length === 0 ? (
                  <p className="text-sm text-text-muted">No reviews yet. Be the first!</p>
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
                    <p className="text-xs text-text-muted mt-2">{reviews.length} review{reviews.length > 1 ? 's' : ''}</p>
                  </div>
                )}
                {hasPurchased(slug, category) ? (
                  <form onSubmit={submitReview} className="bg-surface border border-border-light rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-text-main mb-4">Write a Review</h3>
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
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Name</label>
                      <input type="text" value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="Your name"
                        className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary placeholder:text-text-muted" />
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Review</label>
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience..." rows={3}
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
                  <p className="text-sm text-text-muted">No comments yet. Start a discussion!</p>
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
                  <h3 className="text-sm font-semibold text-text-main mb-4">Write a Comment</h3>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Name</label>
                    <input type="text" value={commentName} onChange={e => setCommentName(e.target.value)} placeholder="Your name"
                      className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary placeholder:text-text-muted" />
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Comment</label>
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
                <h4 className="text-sm font-semibold text-text-main mb-1">Email Support</h4>
                <p className="text-xs text-text-muted">support@aiagents.market</p>
                <p className="text-[11px] text-text-muted mt-1">Response within 24 hours</p>
              </div>
              <div className="bg-surface border border-border-light rounded-xl p-6 text-center">
                <span className="material-symbols-outlined text-primary text-4xl mb-3 block">forum</span>
                <h4 className="text-sm font-semibold text-text-main mb-1">Discussion Forum</h4>
                <p className="text-xs text-text-muted">Q&A with the community</p>
                <p className="text-[11px] text-text-muted mt-1">200+ active members</p>
              </div>
              <div className="bg-surface border border-border-light rounded-xl p-6 text-center">
                <span className="material-symbols-outlined text-primary text-4xl mb-3 block">description</span>
                <h4 className="text-sm font-semibold text-text-main mb-1">Documentation</h4>
                <p className="text-xs text-text-muted">Full guides & tutorials</p>
                <p className="text-[11px] text-text-muted mt-1">Weekly updates</p>
              </div>
            </div>
          </section>
        )}

        <section className="px-6 py-12 bg-surface-container-low rounded-3xl mx-6 my-6">
          <h2 className="text-[22px] font-semibold text-text-main mb-2">About This Product</h2>
          <p className="text-sm text-text-muted mb-6">Everything you need to know about {name}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <p className="text-[15px] text-text-muted leading-relaxed">
                {name} is a premium {config.label.toLowerCase().slice(0, -1)} available exclusively
                on the AI Agents Marketplace. Designed by <strong className="text-text-main">{item.sellerId || item.author ? <SellerLink sellerId={item.sellerId} author={item.author} /> : 'AI Agents Team'}</strong>,
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
          <h2 className="text-[22px] font-semibold text-text-main mb-2">How to Use</h2>
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
          <h2 className="text-[22px] font-semibold text-text-main mb-2">Screenshots & Demo</h2>
          <p className="text-sm text-text-muted mb-6">Product interface previews</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`rounded-xl overflow-hidden border border-border-light bg-surface-container-low group ${i === 1 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                <img src={`https://picsum.photos/seed/${item.seed}-ss${i}/${i === 1 ? '800/500' : '600/400'}`} alt={`${name} screenshot ${i}`}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${i === 1 ? 'h-48 sm:h-64 md:h-80' : 'h-36 sm:h-44 md:h-52'}`} />
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

      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {loginToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] bg-[#1a1a2e] text-white px-6 py-3.5 rounded-xl shadow-2xl border border-[#2a2a4e] flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[#f59e0b]" style={{ fontSize: 20 }}>info</span>
          <span className="text-sm font-medium">You are not logged in, please log in first!</span>
          <button onClick={() => setLoginToast(false)} className="ml-2 text-white/60 hover:text-white cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>
      )}
    </>
  );
}
