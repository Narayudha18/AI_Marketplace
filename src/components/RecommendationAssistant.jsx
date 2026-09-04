import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProductEntries, toSlug, parsePrice, searchProducts } from '../data/product-catalog'

const MAX_RESULTS = 5

const QUICK_SUGGESTIONS = [
  'affordable chatbot',
  'best image generator',
  'top rated AI tokens',
  'workflow automation',
  'app monitoring',
  'writing prompts',
]

function topRated(n) {
  return getAllProductEntries()
    .filter(e => typeof e.rating === 'number')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, n)
}

function cheapest(n, max) {
  let list = getAllProductEntries()
  if (max != null) list = list.filter(e => parsePrice(e.price) <= max)
  return list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)).slice(0, n)
}

function dominantCategory(list) {
  const count = {}
  list.forEach(e => { count[e.config.label] = (count[e.config.label] || 0) + 1 })
  const best = Object.entries(count).sort((a, b) => b[1] - a[1])[0]
  return best && best[1] >= 2 ? best[0] : null
}

function replyFor(text) {
  const q = text.toLowerCase().trim()

  if (/^(halo|hai|hi|hello|hallo|helo|hei|yo|assalam|selamat)/.test(q)) {
    return {
      text: 'Hello! I\'m the product recommendation assistant for this marketplace. You can ask about chatbots, templates, image generators, AI tokens, and more. Here are some popular products:',
      products: topRated(3),
    }
  }

  if (/(makasih|terima kasih|terimakasih|thanks|thank you)/.test(q)) {
    return { text: 'You\'re welcome! If you need more recommendations, just ask. I\'ll help you find the best match.' }
  }

  if (/(bantuan|help|cara pakai|apa yang bisa|cara kerja|fitur kamu|kamu bisa|bisa apa)/.test(q)) {
    return { text: 'You can ask naturally, for example "affordable chatbot", "best image generator", "AI tokens for coding", or "workflow automation". I can also show you the most popular or cheapest products.' }
  }

  const budgetWords = ['murah', 'hemat', 'budget', 'dibawah', 'di bawah', 'bawah', 'kurang dari', 'maksimal', 'max', 'termurah', 'gratis', 'free']
  const hasBudget = budgetWords.some(w => q.includes(w))
  if (hasBudget) {
    const numMatch = q.match(/\d+(?:\.\d+)?/)
    if (numMatch) {
      const max = Number(numMatch[0])
      const list = cheapest(MAX_RESULTS, max)
      if (list.length) return { text: `With a budget up to ${max}, here are the best products for you:`, products: list }
      return { text: `Sorry, I couldn't find products under ${max}. Try increasing your budget or using different keywords.` }
    }
    return { text: 'Here are the most affordable options available in the marketplace:', products: cheapest(MAX_RESULTS) }
  }

  if (/(terbaik|terpopuler|populer|best|top|rating|rekomendasi|recommend|favorit|unggulan)/.test(q)) {
    return { text: 'Here are the highest-rated products from our users:', products: topRated(MAX_RESULTS) }
  }

  const results = searchProducts(q)
  if (results.length) {
    const top = results.slice(0, MAX_RESULTS)
    const dominant = dominantCategory(top)
    return {
      text: dominant
        ? `Based on your needs, the ${dominant} category is the best match. Here are my recommendations:`
        : 'Here are the products that best match your needs:',
      products: top,
    }
  }

  return {
    text: 'Sorry, I couldn\'t find matching products. Try different keywords like "chatbot", "image", "prompt", or "monitor".',
    products: topRated(2),
  }
}

function resultKey(entry) {
  return `${entry.category}-${toSlug(entry.title || entry.name)}`
}

function ProductCard({ entry, onOpen }) {
  return (
    <Link
      to={`${entry.config.nav}/${toSlug(entry.title || entry.name)}`}
      onClick={onOpen}
      className="group flex items-center gap-2.5 py-2"
    >
      <img src={`https://picsum.photos/seed/${entry.seed}/80/80`} alt={entry.title || entry.name} className="h-9 w-9 flex-shrink-0 object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-[var(--color-text-main)] transition-colors group-hover:text-[var(--color-primary)]">
          {entry.title || entry.name}
        </p>
        <p className="truncate text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{entry.config.label}</p>
      </div>
      {'price' in entry && <span className="flex-shrink-0 text-[11px] font-semibold text-[var(--color-text-main)]">{entry.price}</span>}
    </Link>
  )
}

export default function RecommendationAssistant() {
  const [open, setOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [query, setQuery] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState(() => [{
    id: 0,
    role: 'assistant',
    text: 'Hello! I\'m the AI marketplace product recommendation assistant. Tell me what you need, for example "affordable chatbot" or "best image generator".',
    products: topRated(3),
  }])
  const scrollRef = useRef(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, typing])

  const send = (text) => {
    const t = (text ?? query).trim()
    if (!t || typing) return
    setQuery('')
    setMessages(m => [...m, { id: Date.now(), role: 'user', text: t }])
    setTyping(true)
    setTimeout(() => {
      const reply = replyFor(t)
      setMessages(m => [...m, { id: Date.now() + 1, role: 'assistant', text: reply.text, products: reply.products || [] }])
      setTyping(false)
    }, 550)
  }

  return (
    <>
      {open && !fullscreen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
      )}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {open && (
          <div className={`flex flex-col bg-[var(--color-background)] ${
            fullscreen
              ? 'fixed inset-0 z-50 border-0'
              : 'max-h-[min(560px,calc(100dvh-120px))] w-[calc(100vw-40px)] max-w-sm border border-[var(--color-border-light)]'
          }`}>
            <div className="flex items-center justify-between border-b border-dashed border-[var(--color-border-light)] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontSize: 20 }}>smart_toy</span>
                <div>
                  <p className="text-sm font-medium lowercase tracking-[-0.02em] text-[var(--color-text-main)]">ai assistant</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">recommendation helper</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFullscreen(f => !f)}
                  className="cursor-pointer rounded-none p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-text-main)]"
                  aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{fullscreen ? 'close_fullscreen' : 'open_in_full'}</span>
                </button>
                <button
                  onClick={() => { setOpen(false); setFullscreen(false) }}
                  className="cursor-pointer rounded-none p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-text-main)]"
                  aria-label="Close AI Assistant"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 ${
                    m.role === 'user'
                      ? 'bg-primary text-on-primary'
                      : 'border border-dashed border-[var(--color-border-light)] bg-[var(--color-surface-container-low)]'
                  }`}>
                    <p className="text-xs leading-relaxed">{m.text}</p>
                    {m.products && m.products.length > 0 && (
                      <div className="mt-1 divide-y divide-dashed divide-[var(--color-border-light)]">
                        {m.products.map(entry => (
                          <ProductCard key={resultKey(entry)} entry={entry} onOpen={() => setOpen(false)} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="border border-dashed border-[var(--color-border-light)] bg-[var(--color-surface-container-low)] px-3.5 py-2.5">
                    <p className="text-xs italic text-[var(--color-text-muted)]">typing...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-dashed border-[var(--color-border-light)] p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="cursor-pointer border border-dashed border-[var(--color-border-light)] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Ask for recommendations..."
                  className="min-w-0 flex-1 border-b border-[var(--color-border-light)] bg-transparent py-2 text-sm text-[var(--color-text-main)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
                />
                <button
                  onClick={() => send()}
                  className="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center bg-primary text-on-primary transition-opacity hover:opacity-90"
                  aria-label="Send"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_upward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {!fullscreen && (
          <button
            onClick={() => setOpen(o => !o)}
            className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border-light)] transition-all hover:scale-105 ${open ? 'bg-text-main text-surface' : 'bg-primary text-on-primary'}`}
            aria-label="AI Assistant"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{open ? 'close' : 'smart_toy'}</span>
          </button>
        )}
      </div>
    </>
  )
}