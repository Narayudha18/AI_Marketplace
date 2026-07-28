import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const STORAGE_KEY = 'seller_products'

function loadProducts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

export default function SellerDashboard() {
  const { currentUser, requestSeller } = useAuth()

  useEffect(() => {
    if (currentUser && !currentUser.isSeller && !currentUser.sellerRequested) requestSeller()
  }, [])
  const [products, setProducts] = useState(loadProducts)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'templates', price: '', desc: '' })

  const saveProducts = (updated) => {
    setProducts(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const addProduct = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price.trim()) return
    const newProduct = {
      id: Date.now(),
      title: form.name.trim(),
      category: form.category,
      price: `$${parseFloat(form.price).toFixed(0)}`,
      desc: form.desc.trim() || 'No description provided.',
      seed: `seller-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sales: 0,
      rating: 0,
    }
    saveProducts([newProduct, ...products])
    setForm({ name: '', category: 'templates', price: '', desc: '' })
    setShowForm(false)
  }

  const deleteProduct = (id) => {
    saveProducts(products.filter(p => p.id !== id))
  }

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <main className="w-full max-w-[1440px] mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-text-main mb-4">Sign in required</h1>
          <p className="text-text-muted mb-6">Please sign in to access your seller dashboard.</p>
          <Link to="/login" className="bg-primary text-surface px-6 py-2.5 rounded-lg text-sm font-bold inline-block hover:opacity-90 transition-opacity">Sign In</Link>
        </main>
        <Footer />
      </>
    )
  }

  if (currentUser && !currentUser.isSeller) {
    return (
      <>
        <Navbar />
        <main className="w-full max-w-[1200px] mx-auto px-6 py-16 text-center">
          <span className="material-symbols-outlined text-5xl text-text-muted mb-4 inline-block" style={{ fontSize: 48 }}>hourglass_empty</span>
          <h1 className="text-2xl font-bold text-text-main mb-2">Approval Pending</h1>
          <p className="text-text-muted max-w-md mx-auto">Your seller request has been submitted. An admin will review and approve your account shortly.</p>
        </main>
        <Footer />
      </>
    )
  }

  const totalSales = products.reduce((s, p) => s + (p.sales || 0), 0)
  const totalEarnings = products.reduce((s, p) => {
    const price = parseFloat((p.price || '$0').replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
    return s + price * (p.sales || 0)
  }, 0)

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Seller Dashboard</h1>
            <p className="text-sm text-text-muted mt-1">Welcome back, {currentUser.name}</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-primary text-surface px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: products.length, label: 'Products Listed', icon: 'inventory_2' },
            { value: totalSales, label: 'Total Sales', icon: 'trending_up' },
            { value: `$${totalEarnings.toLocaleString('en-US')}`, label: 'Earnings', icon: 'payments' },
            { value: products.length > 0 ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1) : '—', label: 'Avg. Rating', icon: 'star' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface rounded-xl border border-border-light p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 22 }}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-xl font-bold text-text-main">{stat.value}</p>
                <p className="text-[11px] font-medium text-text-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="mb-8 bg-surface border border-border-light rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text-main">Add New Product</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-surface-container-low rounded cursor-pointer">
                <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-text-muted mb-1.5 block">Product Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. AI Chatbot Pro" required
                  className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary placeholder:text-text-muted" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted mb-1.5 block">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary text-text-main">
                  {['templates', 'integrations', 'chatbots', 'automation', 'ai-tools', 'voice-ai', 'image-gen', 'analytics', 'fine-tuning', 'monitoring', 'security'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted mb-1.5 block">Price ($)</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="49.99" required
                  className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary placeholder:text-text-muted" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-text-muted mb-1.5 block">Description</label>
                <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Describe your product..." rows={3}
                  className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-primary placeholder:text-text-muted resize-none" />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={!form.name.trim() || !form.price.trim()}
                  className="bg-primary text-surface px-5 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer">Save Product</button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="border border-border-light text-text-muted px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-colors cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border-light">
            <h2 className="text-sm font-bold text-text-main">Your Products ({products.length})</h2>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-text-muted text-5xl mb-3 block">inventory_2</span>
              <p className="text-sm text-text-muted">No products yet. Click "Add Product" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-light bg-surface-container-low">
                    <th className="text-left px-6 py-3 font-semibold text-text-muted">Product</th>
                    <th className="text-left px-6 py-3 font-semibold text-text-muted">Category</th>
                    <th className="text-left px-6 py-3 font-semibold text-text-muted">Price</th>
                    <th className="text-center px-6 py-3 font-semibold text-text-muted">Sales</th>
                    <th className="text-center px-6 py-3 font-semibold text-text-muted">Rating</th>
                    <th className="text-right px-6 py-3 font-semibold text-text-muted">Date</th>
                    <th className="text-right px-6 py-3 font-semibold text-text-muted">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-border-light hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-text-main truncate max-w-[200px]">{p.title}</p>
                      </td>
                      <td className="px-6 py-4 text-text-muted capitalize">{p.category}</td>
                      <td className="px-6 py-4 font-semibold text-text-main">{p.price}</td>
                      <td className="px-6 py-4 text-center text-text-muted">{p.sales}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-amber-500">{p.rating > 0 ? p.rating : '—'}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-text-muted">{p.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteProduct(p.id)}
                          className="text-red-500 hover:text-red-600 font-semibold cursor-pointer">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
