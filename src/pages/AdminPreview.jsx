import { useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getUserById, getAllProductsForSeller, readSellerProducts } from '../lib/storage'
import { toSlug } from '../lib/helpers'

function renderStars(rating) {
  const full = Math.floor(rating || 0)
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`material-symbols-outlined ${i < full ? 'text-amber-400' : 'text-gray-300'}`} style={{ fontSize: 14 }}>
          {i < full ? 'star' : 'star_border'}
        </span>
      ))}
    </span>
  )
}

function AdminHeader({ label, title, backTab }) {
  const navigate = useNavigate()
  return (
    <div className="bg-surface border-b border-border-light sticky top-0 z-30">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate('/admin/dashboard', { state: { tab: backTab } })}
            className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-border-light flex items-center justify-center transition-colors cursor-pointer flex-shrink-0">
            <span className="material-symbols-outlined text-text-main" style={{ fontSize: 18 }}>arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface" style={{ fontSize: 15 }}>admin_panel_settings</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Admin Preview</p>
              <p className="text-xs font-bold text-text-main truncate">{label}</p>
            </div>
          </div>
        </div>
        <h1 className="text-sm font-bold text-text-main truncate hidden md:block">{title}</h1>
      </div>
    </div>
  )
}

function ProductCard({ p, previewLink }) {
  const navigate = useNavigate()
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
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
          <button onClick={() => navigate(previewLink)} className="px-3 py-1.5 border border-blue-500 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-colors text-[11px] font-medium cursor-pointer">
            Preview
          </button>
        </div>
      </div>
    </div>
  )
}

export function AdminSellerPreview() {
  const { sellerId } = useParams()
  const navigate = useNavigate()
  const seller = useMemo(() => getUserById(sellerId), [sellerId])
  const products = useMemo(() => getAllProductsForSeller(sellerId), [sellerId])

  if (!seller) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader label="Seller Preview" title="Not found" backTab="sellers" />
        <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 56 }}>person_off</span>
          <p className="text-sm text-text-muted mt-4">Seller not found.</p>
        </div>
      </div>
    )
  }

  const totalSales = products.reduce((s, p) => s + (Number(p.sales) || 0), 0)
  const memberSince = seller.id
    ? new Date(Number.isFinite(Number(seller.id)) ? Number(seller.id) : Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Unknown'

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader label="Seller Preview" title={seller.name} backTab="sellers" />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="bg-surface border border-border-light rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600/30 overflow-hidden ring-4 ring-blue-500/20 flex-shrink-0">
            {seller.picture ? (
              <img src={seller.picture} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-blue-400 flex items-center justify-center w-full h-full">
                {seller.name?.[0]?.toUpperCase() || 'S'}
              </span>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 justify-center md:justify-start">
              <h1 className="text-2xl font-bold text-text-main">{seller.name}</h1>
              <div className="flex gap-1.5 justify-center md:justify-start">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">Seller</span>
                {seller.sellerRequested && <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">Pending</span>}
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

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Link to={`/seller/${seller.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3.5 py-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>public</span>
            View Public Store
          </Link>
          <button onClick={() => navigate('/admin/dashboard', { state: { tab: 'sellers' } })}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-muted bg-surface-container-low hover:bg-surface-container-high border border-border-light px-3.5 py-2 rounded-lg transition-colors cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_back</span>
            Back to Sellers
          </button>
        </div>

        <h2 className="text-lg font-bold text-text-main mt-10 mb-6">Products by {seller.name}</h2>
        {products.length === 0 ? (
          <div className="bg-surface border border-border-light rounded-2xl py-16 text-center">
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 48 }}>inventory_2</span>
            <p className="text-sm text-text-muted mt-4">This seller hasn't listed any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} p={p} previewLink={`/admin/preview/product/${p.id}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function AdminProductPreview() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const product = useMemo(() => readSellerProducts().find(p => Number(p.id) === Number(productId)), [productId])
  const seller = product ? getUserById(product.sellerId) : null

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader label="Product Preview" title="Not found" backTab="products" />
        <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 56 }}>search_off</span>
          <p className="text-sm text-text-muted mt-4">Product not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader label="Product Preview" title={product.title} backTab="products" />

      <div className="max-w-[900px] mx-auto px-6 py-8">
        <div className="bg-surface border border-border-light rounded-2xl overflow-hidden">
          <img src={`https://picsum.photos/seed/${product.seed || product.id}-detail/900/450`} alt={product.title}
            className="w-full h-[240px] sm:h-[320px] object-cover" />
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-[11px] font-medium text-primary bg-primary-container/10 px-3 py-1 rounded capitalize">{product.category}</span>
              <span className="text-[11px] font-medium bg-surface-container-low text-text-muted px-3 py-1 rounded border border-border-light">{product.date || '—'}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main">{product.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              {renderStars(product.rating)}
              <span className="text-xs font-semibold text-text-main">{product.rating || '0.0'}</span>
              <span className="text-xs text-text-muted">· {product.sales || 0} sales</span>
            </div>
            <p className="text-[15px] text-text-muted leading-relaxed mt-4">{product.desc}</p>

            <div className="border-t border-border-light mt-6 pt-5 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[32px] font-bold text-text-main">{product.price}</span>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => navigate(`/${product.category}/${toSlug(product.title)}`)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3.5 py-2 rounded-lg transition-colors cursor-pointer">
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>storefront</span>
                  View in Marketplace
                </button>
                <button onClick={() => navigate('/admin/dashboard', { state: { tab: 'products' } })}
                  className="flex items-center gap-1.5 text-xs font-semibold text-text-muted bg-surface-container-low hover:bg-surface-container-high border border-border-light px-3.5 py-2 rounded-lg transition-colors cursor-pointer">
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_back</span>
                  Back to Products
                </button>
              </div>
            </div>

            {seller && (
              <div className="mt-6 flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3 border border-border-light">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
                  {seller.picture ? <img src={seller.picture} alt="" className="w-full h-full object-cover" /> : seller.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-text-muted font-semibold">Sold by</p>
                  <p className="text-xs font-semibold text-text-main truncate">{seller.name}</p>
                </div>
                <button onClick={() => navigate(`/admin/preview/seller/${seller.id}`)}
                  className="text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">
                  View Seller
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
