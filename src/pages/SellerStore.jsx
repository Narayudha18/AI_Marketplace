import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getUserById, getSellerProductsBySeller } from '../lib/storage'

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
  const seller = useMemo(() => getUserById(sellerId), [sellerId])
  const products = useMemo(() => getSellerProductsBySeller(sellerId), [sellerId])

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
  const memberSince = seller.id
    ? new Date(Number.isFinite(Number(seller.id)) ? Number(seller.id) : Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Unknown'

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-primary-container/15 to-transparent">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <nav className="flex items-center gap-2 text-xs mb-8">
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
          <h2 className="text-lg font-bold text-text-main">Products by {seller.name}</h2>
          <span className="text-xs text-text-muted">{products.length} product{products.length !== 1 ? 's' : ''}</span>
        </div>

        {products.length === 0 ? (
          <div className="bg-surface border border-border-light rounded-2xl py-16 text-center">
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 48 }}>inventory_2</span>
            <p className="text-sm text-text-muted mt-4">This seller hasn't listed any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => {
              const slug = toSlug(p.title)
              const detailPath = `/${p.category}/${slug}`
              return (
                <Link key={p.id} to={detailPath}
                  className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                  <div className="relative h-40 overflow-hidden bg-surface-container-low">
                    <img src={`https://picsum.photos/seed/${p.seed || p.id}/400/200`} alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[11px] font-medium text-primary bg-primary-container/10 px-2 py-0.5 rounded self-start mb-2 capitalize">{p.category}</span>
                    <h4 className="text-xs font-semibold text-text-main mb-1 line-clamp-1">{p.title}</h4>
                    <p className="text-[11px] font-medium text-text-muted mb-3 line-clamp-2">{p.desc}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-border-light pt-3">
                      <div>
                        <span className="text-lg font-semibold text-text-main block">{p.price}</span>
                        <div className="flex items-center gap-1 text-[11px] text-text-muted">
                          {renderStars(p.rating)}
                          <span className="font-medium">{p.rating || '0.0'}</span>
                          <span>·</span>
                          <span>{p.sales || 0} sales</span>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-surface transition-colors text-[11px] font-medium">
                        Preview
                      </span>
                    </div>
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
