import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProductEntries, toSlug, parsePrice, scoreEntry } from '../data/product-catalog'

const QUICK_SUGGESTIONS = [
  'butuh chatbot',
  'AI image generator',
  'prompt untuk menulis',
  'automasi workflow',
  'monitoring aplikasi',
  'AI token murah',
]

export default function RecommendationAssistant() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [suggested, setSuggested] = useState([])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const all = getAllProductEntries()
    const featured = all
      .filter(e => typeof e.rating === 'number')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
    setSuggested(featured)
  }, [])

  const runSearch = (text) => {
    const q = (text || query).toLowerCase()
    const tokens = q.split(/[^a-z0-9+]+/).filter(Boolean)
    if (!tokens.length) {
      setResults([])
      setSearched(false)
      return
    }
    const ranked = getAllProductEntries()
      .map(entry => ({ entry, score: scoreEntry(entry, tokens) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score || (b.entry.rating || 0) - (a.entry.rating || 0) || parsePrice(a.entry.price) - parsePrice(b.entry.price))
    setResults(ranked.slice(0, 5).map(r => r.entry))
    setSearched(true)
  }

  const resultKey = (entry) => `${entry.category}-${toSlug(entry.title || entry.name)}`

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
      )}
      <div className={`fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3`}>
        {open && (
          <div className="w-[calc(100vw-40px)] max-w-sm bg-surface border border-border-light rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light bg-primary-container text-on-primary-container">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>smart_toy</span>
                <div>
                  <p className="text-sm font-bold leading-tight">AI Assistant</p>
                  <p className="text-[10px] text-white/70">Recommendation helper</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-surface" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            <div className="p-4">
              <p className="text-xs text-text-muted mb-3">Ceritakan kebutuhanmu, saya akan rekomendasikan produk terbaik.</p>
              <div className="flex gap-2 mb-3">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runSearch()}
                  placeholder="Cari produk, mis. 'chatbot support'"
                  className="flex-1 text-sm bg-surface-container-low border border-border-light rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                />
                <button onClick={() => runSearch()}
                  className="bg-primary text-surface px-3.5 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {QUICK_SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => { setQuery(s); runSearch(s) }}
                    className="text-[11px] bg-surface-container-low text-text-muted hover:text-primary hover:border-primary border border-border-light px-2.5 py-1 rounded-full transition-colors cursor-pointer">
                    {s}
                  </button>
                ))}
              </div>

              {!searched && (
                <div>
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">Popular Picks</p>
                  <div className="space-y-2">
                    {suggested.map(entry => (
                      <Link key={resultKey(entry)} to={`${entry.config.nav}/${toSlug(entry.title || entry.name)}`} onClick={() => setOpen(false)}
                        className="flex items-center gap-3 bg-surface-container-low/50 border border-border-light rounded-xl p-2.5 hover:border-primary hover:shadow-sm transition-all">
                        <img src={`https://picsum.photos/seed/${entry.seed}/80/80`} alt={entry.title || entry.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-text-main truncate">{entry.title || entry.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 12 }}>star</span>
                            <span className="text-[11px] font-medium text-text-muted">{entry.rating}</span>
                          </div>
                        </div>
                        {'price' in entry && <span className="text-[11px] font-bold text-text-main flex-shrink-0">{entry.price}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searched && (
                results.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-text-muted text-4xl mb-3 block">search_off</span>
                    <p className="text-sm text-text-muted">Tidak ada produk yang cocok.</p>
                    <p className="text-[11px] text-text-muted/70 mt-1">Coba kata kunci lain seperti "image", "prompt", atau "monitor".</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">Rekomendasi</p>
                    <div className="space-y-2">
                      {results.map(entry => (
                        <Link key={resultKey(entry)} to={`${entry.config.nav}/${toSlug(entry.title || entry.name)}`} onClick={() => setOpen(false)}
                          className="flex items-center gap-3 bg-surface-container-low/50 border border-border-light rounded-xl p-2.5 hover:border-primary hover:shadow-sm transition-all">
                          <img src={`https://picsum.photos/seed/${entry.seed}/80/80`} alt={entry.title || entry.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-text-main truncate">{entry.title || entry.name}</p>
                            <p className="text-[11px] text-text-muted capitalize mt-0.5">{entry.config.label}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 12 }}>star</span>
                            <span className="text-[11px] font-medium text-text-muted">{entry.rating}</span>
                            {'price' in entry && <p className="text-[11px] font-bold text-text-main mt-0.5">{entry.price}</p>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <button onClick={() => setOpen(o => !o)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer ${open ? 'bg-text-main text-surface' : 'bg-primary text-on-primary'}`}
          aria-label="AI Assistant">
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{open ? 'close' : 'smart_toy'}</span>
        </button>
      </div>
    </>
  )
}
