import { useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getUserById, getAllProductsForSeller } from '../lib/storage'

function toSlug(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function renderStars(rating) {
  const full = Math.floor(rating || 0)
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`material-symbols-outlined ${i < full ? 'text-amber-400' : 'text-gray-300'}`} style={{ fontSize: 12 }}>
          {i < full ? 'star' : 'star_border'}
        </span>
      ))}
    </span>
  )
}

export default function SellerStore() {
  const { sellerId } = useParams()
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const seller = useMemo(() => getUserById(sellerId), [sellerId])
  const products = useMemo(() => getAllProductsForSeller(sellerId), [sellerId])

  if (!seller) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 64 }}>person_off</span>
          <h1 className="text-xl font-bold text-text-main mt-4">Seller not found</h1>
          <p className="text-sm text-text-muted mt-2">The seller you're looking for doesn't exist.</p>
          <Link to="/" className="mt-6 bg-primary text-surface px-6 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
            Back to Marketplace
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const totalSales = products.reduce((s, p) => s + (Number(p.sales) || 0), 0)
  const memberSince = (() => {
    const ts = Number(seller.createdAt) || (Number.isFinite(Number(seller.id)) ? Number(seller.id) : 0)
    if (ts > 1000000000000) {
      return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    }
    return seller.createdAt || '2025'
  })()

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-primary-container/15 to-transparent">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <nav className="flex items-center gap-2 text-xs mb-6">
            <Link to="/" className="text-text-muted hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-text-main font-semibold">Seller Store</span>
          </nav>

          <div className="bg-surface border border-border-light rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-blue-500/30 overflow-hidden ring-4 ring-primary/20 flex-shrink-0">
              {seller.picture ? (
                <img src={seller.picture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-on-primary flex items-center justify-center w-full h-full">
                  {seller.name?.[0]?.toUpperCase() || 'S'}
                </span>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <h1 className="text-2xl font-bold text-text-main">{seller.name}</h1>
                <div className="flex gap-1.5 justify-center md:justify-start">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">Seller</span>
                  {seller.isAdmin && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">Admin</span>}
                </div>
              </div>
              <p className="text-xs text-text-muted mt-1">{seller.email}</p>
              {seller.bio && <p className="text-sm text-text-muted mt-3 leading-relaxed max-w-2xl">{seller.bio}</p>}
            </div>
            <div className="flex md:flex-col gap-4 md:gap-2 md:text-right flex-shrink-0">
              <div>
                <p className="text-xl font-bold text-text-main">{products.length}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Products</p>
              </div>
              <div>
                <p className="text-xl font-bold text-text-main">{totalSales}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Total Sales</p>
              </div>
              <div>
                <p className="text-xl font-bold text-text-main">{memberSince}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Member Since</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Back
          </button>
          <span className="text-xs text-text-muted">{products.length} product{products.length !== 1 ? 's' : ''}</span>
        </div>

        {products.length === 0 ? (
          <div className="bg-surface border border-border-light rounded-2xl py-16 text-center">
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 48 }}>inventory_2</span>
            <p className="text-sm text-text-muted mt-4">This seller hasn't listed any products yet.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-6 border-b border-border-light mb-8 overflow-x-auto">
              {products.map((p, i) => {
                const pname = p.title || p.name
                return (
                  <button key={p.id || pname} onClick={() => setActiveIndex(i)}
                    className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors cursor-pointer max-w-[220px] truncate ${
                      activeIndex === i ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-main'
                    }`}>
                    {pname}
                  </button>
                )
              })}
            </div>

            {(() => {
              const p = products[activeIndex]
              if (!p) return null
              const pname = p.title || p.name
              const pcat = p._cat || p.category
              const slug = toSlug(pname)
              const detailPath = `/${pcat}/${slug}`
              return (
                <div className="bg-surface border border-border-light rounded-2xl overflow-hidden">
                  <div className="relative h-56 md:h-64 overflow-hidden bg-surface-container-low">
                    <img src={`https://picsum.photos/seed/${p.seed || pname}/800/400`} alt={pname}
                      className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 text-[11px] font-medium text-primary bg-surface/90 px-2.5 py-1 rounded capitalize">{p.category}</span>
                  </div>
                  <div className="p-6 md:p-8">
                    <h2 className="text-xl font-bold text-text-main mb-2">{pname}</h2>
                    <p className="text-sm text-text-muted leading-relaxed mb-6">{p.desc}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border-light pt-5 mb-6">
                      <div>
                        <p className="text-2xl font-bold text-text-main">{p.price}</p>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mt-0.5">Price</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          {renderStars(p.rating)}
                          <span className="text-sm font-medium text-text-main">{p.rating || '0.0'}</span>
                        </div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mt-0.5">Rating</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-text-main">{p.sales || 0}</p>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mt-0.5">Sales</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link to={detailPath}
                        className="bg-primary text-surface px-6 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                        View Full Product
                      </Link>
                      <Link to={`${detailPath}/preview`}
                        className="px-6 py-2.5 border border-primary text-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-surface transition-colors">
                        Live Preview
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })()}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
