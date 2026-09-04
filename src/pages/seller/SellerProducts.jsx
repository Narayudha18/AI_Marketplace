import { useState, useEffect } from 'react'

const CATEGORIES = ['templates', 'integrations', 'chatbots', 'automation', 'ai-tools', 'voice-ai', 'image-gen', 'analytics', 'fine-tuning', 'monitoring', 'security', 'ai-agents', 'ai-prompts', 'ai-skills', 'ai-tokens', 'ai-workflows']

export default function SellerProducts({ products, saveProducts, currentUser, addTrigger }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', category: 'templates', price: '', desc: '' })

  useEffect(() => {
    if (addTrigger > 0) {
      setForm({ name: '', category: 'templates', price: '', desc: '' })
      setEditingId(null)
      setShowForm(true)
    }
  }, [addTrigger])

  const resetForm = () => {
    setForm({ name: '', category: 'templates', price: '', desc: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const openEdit = (product) => {
    setForm({
      name: product.title,
      category: product.category,
      price: product.price.replace(/[^0-9.]/g, ''),
      desc: product.desc || '',
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const saveProduct = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price.trim()) return

    if (editingId) {
      const updated = products.map(p =>
        p.id === editingId ? { ...p, title: form.name.trim(), category: form.category, price: `$${parseFloat(form.price).toFixed(0)}`, desc: form.desc.trim() || p.desc } : p
      )
      saveProducts(updated)
    } else {
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
        sellerId: currentUser.id,
      }
      saveProducts([newProduct, ...products])
    }
    resetForm()
  }

  const deleteProduct = (id) => {
    const product = products.find(p => p.id === id)
    if (window.confirm(`Delete "${product?.title}"? This cannot be undone.`)) {
      saveProducts(products.filter(p => p.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="bg-surface border border-border-light rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={resetForm} className="p-1 hover:bg-surface-container-low rounded cursor-pointer">
              <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>close</span>
            </button>
          </div>
          <form onSubmit={saveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] font-medium text-text-muted mb-1 block">Product Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. AI Chatbot Pro" required
                className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 text-text-main placeholder:text-text-muted" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 text-text-main">
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-text-muted mb-1 block">Price ($)</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="49.99" required
                className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 text-text-main placeholder:text-text-muted" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-medium text-text-muted mb-1 block">Description</label>
              <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Describe your product..." rows={3}
                className="w-full text-xs bg-surface-container-low border border-border-light rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 text-text-main placeholder:text-text-muted resize-none" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={!form.name.trim() || !form.price.trim()}
                className="bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-400 transition-colors disabled:opacity-40 cursor-pointer">{editingId ? 'Update Product' : 'Save Product'}</button>
              <button type="button" onClick={resetForm}
                className="border border-border-light text-text-muted px-5 py-2 rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-colors cursor-pointer">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-light">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Your Products ({products.length})</h2>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-text-muted text-4xl mb-3 block">inventory_2</span>
            <p className="text-xs text-text-muted">No products yet. Add your first product to start selling.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-light bg-surface-container-low/50">
                  <th className="text-left px-5 py-3 font-semibold text-text-muted">Product</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted">Category</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted">Price</th>
                  <th className="text-center px-5 py-3 font-semibold text-text-muted">Sales</th>
                  <th className="text-center px-5 py-3 font-semibold text-text-muted">Rating</th>
                  <th className="text-right px-5 py-3 font-semibold text-text-muted">Date</th>
                  <th className="text-right px-5 py-3 font-semibold text-text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-border-light/50 hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img src={`https://picsum.photos/seed/${p.seed || p.title}/40/40`} alt="" className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                        <p className="font-semibold text-text-main truncate max-w-[200px]">{p.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-text-muted capitalize">{p.category}</td>
                    <td className="px-5 py-3.5 font-semibold text-text-main">{p.price}</td>
                    <td className="px-5 py-3.5 text-center text-text-muted">{p.sales}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-amber-500">{p.rating > 0 ? p.rating : '—'}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-text-muted">{p.date}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(p)}
                          className="text-emerald-500 hover:text-emerald-400 font-semibold cursor-pointer">Edit</button>
                        <button onClick={() => deleteProduct(p.id)}
                          className="text-red-500 hover:text-red-400 font-semibold cursor-pointer">Delete</button>
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
