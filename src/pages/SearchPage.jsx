import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SellerLink from '../components/SellerLink'
import { searchProducts, toSlug } from '../data/product-catalog'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [input, setInput] = useState(q)

  const results = useMemo(() => searchProducts(q), [q])

  const submit = (e) => {
    e.preventDefault()
    if (input.trim()) setSearchParams({ q: input.trim() })
  }

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-main">Search Results</h1>
          <form onSubmit={submit} className="mt-4 flex w-full max-w-xl bg-surface rounded-lg shadow-sm border border-border-light p-1">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search products, e.g. 'chatbot support'"
              className="flex-1 border-none focus:ring-0 px-4 py-3 text-[15px] bg-transparent outline-none"
            />
            <button type="submit"
              className="bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity px-6 rounded text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
              Search
            </button>
          </form>
          {q && (
            <p className="text-sm text-text-muted mt-4">
              {results.length} result{results.length !== 1 ? 's' : ''} for <span className="font-semibold text-text-main">"{q}"</span>
            </p>
          )}
        </div>

        {!q ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-text-muted text-6xl mb-4 block">search</span>
            <h2 className="text-lg font-semibold text-text-main mb-2">Type a keyword to search</h2>
            <p className="text-sm text-text-muted">Search across all 16 categories: AI Agents, AI Prompts, Chatbots, Templates, and more.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-text-muted text-6xl mb-4 block">search_off</span>
            <h2 className="text-lg font-semibold text-text-main mb-2">No results for "{q}"</h2>
            <p className="text-sm text-text-muted">Try other keywords like "image", "prompt", or "monitor".</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map(entry => {
              const itemName = entry.title || entry.name
              const slug = toSlug(itemName)
              return (
                <Link key={`${entry.category}-${slug}`} to={`${entry.config.nav}/${slug}`}
                  className="group bg-surface border border-border-light rounded-xl overflow-hidden hover:shadow-lg hover:border-primary transition-all">
                  <div className="aspect-[4/3] bg-surface-container-low overflow-hidden">
                    <img src={`https://picsum.photos/seed/${entry.seed}/400/300`} alt={itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-text-main line-clamp-1 group-hover:text-primary transition-colors">{itemName}</p>
                    {entry.sellerId && (
                      <p className="text-[10px] text-text-muted mt-0.5">
                        by <SellerLink sellerId={entry.sellerId} />
                      </p>
                    )}
                    {'price' in entry && <p className="text-[11px] font-semibold text-text-main mt-0.5">{entry.price}</p>}
                    {'rating' in entry && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-yellow-500 text-xs" style={{ fontSize: 12 }}>star</span>
                        <span className="text-[10px] font-medium text-text-muted">{entry.rating}</span>
                      </div>
                    )}
                    <p className="text-[10px] text-text-muted mt-0.5 capitalize">{entry.config.label}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
