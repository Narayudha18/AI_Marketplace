import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ALL_SEED_PRODUCTS } from '../../data/seed-sellers'
import { toSlug } from '../../lib/helpers'

const categoryData = (() => {
  const map = {}
  for (const p of ALL_SEED_PRODUCTS) {
    const key = p.category || 'Other'
    map[key] = (map[key] || 0) + 1
  }
  return Object.entries(map).map(([name, count]) => ({ name, count }))
})()

export default function AdminProducts({ sellerProducts, deleteProduct }) {
  const navigate = useNavigate()
  const [productQuery, setProductQuery] = useState('')
  const [productCategory, setProductCategory] = useState('All')

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border-light rounded-xl p-5">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Products by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categoryData.map((cat, i) => (
            <div key={i} className="bg-surface-container-low rounded-xl p-3.5 md:p-4">
              <p className="text-xs font-semibold text-text-main truncate">{cat.name}</p>
              <p className="text-xl font-bold text-blue-400 mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-text-main">Total Marketplace Products</span>
          <span className="text-lg font-bold text-blue-400">{ALL_SEED_PRODUCTS.length}</span>
        </div>
      </div>

      <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border-light space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">All Marketplace Products ({ALL_SEED_PRODUCTS.length})</h2>
            <div className="flex items-center gap-2">
              <input value={productQuery} onChange={e => setProductQuery(e.target.value)} placeholder="Search products..."
                className="bg-surface-container-low border border-border-light rounded-lg px-3 py-1.5 text-xs text-text-main outline-none focus:border-blue-500/40 w-40 md:w-56" />
              <select value={productCategory} onChange={e => setProductCategory(e.target.value)}
                className="bg-surface-container-low border border-border-light rounded-lg px-2.5 py-1.5 text-xs text-text-main outline-none cursor-pointer">
                <option value="All">All categories</option>
                {categoryData.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-surface">
              <tr className="text-text-muted/70 bg-surface-container-low/50">
                <th className="text-left py-3 px-5 font-semibold">Product</th>
                <th className="text-left py-3 px-5 font-semibold">Category</th>
                <th className="text-left py-3 px-5 font-semibold">Seller</th>
                <th className="text-left py-3 px-5 font-semibold">Price</th>
                <th className="text-left py-3 px-5 font-semibold">Rating</th>
                <th className="text-right py-3 px-5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {ALL_SEED_PRODUCTS
                .filter(p => {
                  const name = p.title || p.name || ''
                  const matchQ = !productQuery || name.toLowerCase().includes(productQuery.toLowerCase())
                  const matchC = productCategory === 'All' || (p.category || 'Other') === productCategory
                  return matchQ && matchC
                })
                .map((p, i) => {
                  const name = p.title || p.name || ''
                  const pcat = p._cat
                  const slug = toSlug(name)
                  return (
                    <tr key={i} className="border-t border-border-light hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2.5">
                          <img src={`https://picsum.photos/seed/${p.seed || name}/40/40`} alt="" className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                          <span className="font-semibold text-text-main truncate max-w-[220px]">{name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 capitalize text-text-muted">{p.category || 'Other'}</td>
                      <td className="py-3 px-5 text-text-muted">{p.author || 'AI Agents Team'}</td>
                      <td className="py-3 px-5 text-text-main/90">{p.price}</td>
                      <td className="py-3 px-5">
                        <span className="flex items-center gap-1 text-text-main/90">
                          <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 12 }}>star</span>
                          {p.rating || '0.0'}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <button onClick={() => navigate(`/${pcat}/${slug}/preview`)}
                          className="text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">Preview</button>
                      </td>
                    </tr>
                  )
                })}
              {ALL_SEED_PRODUCTS.filter(p => {
                const name = p.title || p.name || ''
                const matchQ = !productQuery || name.toLowerCase().includes(productQuery.toLowerCase())
                const matchC = productCategory === 'All' || (p.category || 'Other') === productCategory
                return matchQ && matchC
              }).length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-text-muted/70">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Seller Products ({sellerProducts.length})</h2>
        </div>
        {sellerProducts.length === 0 ? (
          <div className="py-12 text-center text-text-muted/70 text-xs">No seller products listed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-text-muted/70 bg-surface-container-low/50">
                  <th className="text-left py-3 px-5 font-semibold">Product</th>
                  <th className="text-left py-3 px-5 font-semibold">Category</th>
                  <th className="text-left py-3 px-5 font-semibold">Price</th>
                  <th className="text-right py-3 px-5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {sellerProducts.map((p, i) => (
                  <tr key={i} className="border-t border-border-light hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-text-main">{p.title}</td>
                    <td className="py-3.5 px-5 capitalize text-text-muted">{p.category}</td>
                    <td className="py-3.5 px-5 text-text-main/90">{p.price}</td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => navigate(`/admin/preview/product/${p.id}`)}
                          className="text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">Preview</button>
                        <button onClick={() => { if (window.confirm(`Delete product "${p.title}"? This cannot be undone.`)) deleteProduct(p.id) }}
                          className="text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
