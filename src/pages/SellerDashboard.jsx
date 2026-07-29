import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const STORAGE_KEY = 'seller_products'

function loadProducts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

const sidebarItems = [
  { key: 'overview', label: 'Overview', icon: 'dashboard' },
  { key: 'products', label: 'Products', icon: 'inventory_2' },
  { key: 'orders', label: 'Orders', icon: 'receipt_long' },
]

export default function SellerDashboard() {
  const { currentUser, logout, requestSeller } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [products, setProducts] = useState(loadProducts)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'templates', price: '', desc: '' })
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (currentUser && !currentUser.isSeller && !currentUser.sellerRequested) requestSeller()
  }, [currentUser, requestSeller])

  useEffect(() => {
    try {
      const all = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('orders_')) {
          const data = JSON.parse(localStorage.getItem(key))
          if (Array.isArray(data)) data.forEach(o => all.push(o))
        }
      }
      setOrders(all)
    } catch {}
  }, [])

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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const totalSales = products.reduce((s, p) => s + (p.sales || 0), 0)
  const totalEarnings = products.reduce((s, p) => {
    const price = parseFloat((p.price || '$0').replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
    return s + price * (p.sales || 0)
  }, 0)

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="bg-[#1a1d23] rounded-2xl p-8 text-center max-w-sm mx-4 border border-gray-800">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-blue-400" style={{ fontSize: 28 }}>store</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-5 text-sm">Please sign in to access your seller dashboard.</p>
          <Link to="/login" className="bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold inline-block hover:bg-blue-400 transition-colors">Sign In</Link>
        </div>
      </div>
    )
  }

  if (!currentUser.isSeller) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="bg-[#1a1d23] rounded-2xl p-8 text-center max-w-sm mx-4 border border-gray-800">
          <span className="material-symbols-outlined text-5xl text-gray-500 mb-4 inline-block" style={{ fontSize: 48 }}>hourglass_empty</span>
          <h1 className="text-xl font-bold text-white mb-2">Approval Pending</h1>
          <p className="text-gray-400 max-w-sm text-sm">Your seller request has been submitted. An admin will review and approve your account shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:sticky top-0 left-0 z-30 h-screen w-60 bg-[#1a1d23] border-r border-gray-800 flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-gray-800">
          <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 16 }}>store</span>
          </div>
          <span className="text-sm font-bold text-white">Seller Panel</span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => (
            <button key={item.key} onClick={() => { setActiveTab(item.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-2.5 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${activeTab === item.key ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
              {item.key === 'products' && products.length > 0 && (
                <span className="ml-auto bg-white/10 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">{products.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <div className="relative">
            <button onClick={() => setAccountOpen(!accountOpen)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
                {currentUser.picture
                  ? <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
                  : currentUser.name[0].toUpperCase()}
              </span>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-semibold text-gray-200 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
              </div>
              <span className="material-symbols-outlined text-gray-500" style={{ fontSize: 16 }}>more_vert</span>
            </button>

            {accountOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#25282d] border border-gray-700 rounded-xl shadow-2xl z-20 py-1.5">
                  <Link to="/" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>storefront</span>
                    Back to Store
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-white/5 px-3 py-2 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>logout</span>
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="md:hidden h-14 bg-[#1a1d23] border-b border-gray-800 flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontSize: 14 }}>store</span>
            </div>
            <span className="text-xs font-bold text-gray-200">Seller Panel</span>
          </div>
          <div className="w-6" />
        </div>

        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg md:text-xl font-bold text-white capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : `${activeTab} Management`}
            </h1>
            {activeTab === 'products' && (
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-400 transition-colors cursor-pointer">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                Add Product
              </button>
            )}
          </div>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { value: products.length, label: 'Products Listed', icon: 'inventory_2' },
                  { value: totalSales, label: 'Total Sales', icon: 'trending_up' },
                  { value: `$${totalEarnings.toLocaleString('en-US')}`, label: 'Earnings', icon: 'payments' },
                  { value: products.length > 0 ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1) : '—', label: 'Avg. Rating', icon: 'star' },
                ].map(stat => (
                  <div key={stat.label} className="bg-[#1a1d23] border border-gray-800 rounded-xl p-4 md:p-5">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: 20 }}>{stat.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg md:text-xl font-bold text-white truncate">{stat.value}</p>
                        <p className="text-[11px] font-medium text-gray-500">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Products */}
              <div className="bg-[#1a1d23] border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-gray-200">Recent Products</h2>
                  <button onClick={() => setActiveTab('products')}
                    className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">View All</button>
                </div>
                {products.length === 0 ? (
                  <div className="text-center py-10">
                    <span className="material-symbols-outlined text-gray-600 text-4xl mb-2 block">inventory_2</span>
                    <p className="text-xs text-gray-500">No products yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-800/50">
                    {products.slice(0, 5).map(p => (
                      <div key={p.id} className="flex items-center justify-between px-5 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-200 truncate">{p.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 capitalize">{p.category} &middot; {p.date}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="text-xs font-bold text-gray-200">{p.price}</p>
                          <p className="text-[10px] text-gray-500">{p.sales} sales</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="bg-[#1a1d23] border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-gray-200">Recent Orders</h2>
                  <button onClick={() => setActiveTab('orders')}
                    className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">View All</button>
                </div>
                {orders.length === 0 ? (
                  <div className="text-center py-10">
                    <span className="material-symbols-outlined text-gray-600 text-4xl mb-2 block">receipt_long</span>
                    <p className="text-xs text-gray-500">No orders yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-800/50">
                    {orders.slice(0, 5).map((o, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-200">{o.orderId}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{o.items?.length || 0} items &middot; {o.date}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="text-xs font-bold text-gray-200">{o.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {showForm && (
                <div className="bg-[#1a1d23] border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-gray-200">Add New Product</h2>
                    <button onClick={() => setShowForm(false)} className="p-1 hover:bg-white/5 rounded cursor-pointer">
                      <span className="material-symbols-outlined text-gray-500" style={{ fontSize: 18 }}>close</span>
                    </button>
                  </div>
                  <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-medium text-gray-500 mb-1 block">Product Name</label>
                      <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. AI Chatbot Pro" required
                        className="w-full text-xs bg-[#0f1117] border border-gray-800 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 text-gray-200 placeholder:text-gray-600" />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-gray-500 mb-1 block">Category</label>
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                        className="w-full text-xs bg-[#0f1117] border border-gray-800 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 text-gray-200">
                        {['templates', 'integrations', 'chatbots', 'automation', 'ai-tools', 'voice-ai', 'image-gen', 'analytics', 'fine-tuning', 'monitoring', 'security'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-gray-500 mb-1 block">Price ($)</label>
                      <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="49.99" required
                        className="w-full text-xs bg-[#0f1117] border border-gray-800 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 text-gray-200 placeholder:text-gray-600" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-medium text-gray-500 mb-1 block">Description</label>
                      <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Describe your product..." rows={3}
                        className="w-full text-xs bg-[#0f1117] border border-gray-800 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 text-gray-200 placeholder:text-gray-600 resize-none" />
                    </div>
                    <div className="md:col-span-2 flex gap-3">
                      <button type="submit" disabled={!form.name.trim() || !form.price.trim()}
                        className="bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-400 transition-colors disabled:opacity-40 cursor-pointer">Save Product</button>
                      <button type="button" onClick={() => setShowForm(false)}
                        className="border border-gray-700 text-gray-400 px-5 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-[#1a1d23] border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-800">
                  <h2 className="text-xs font-bold text-gray-200">Your Products ({products.length})</h2>
                </div>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-gray-600 text-4xl mb-3 block">inventory_2</span>
                    <p className="text-xs text-gray-500">No products yet. Add your first product to start selling.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-800 bg-[#0f1117]/50">
                          <th className="text-left px-5 py-3 font-semibold text-gray-500">Product</th>
                          <th className="text-left px-5 py-3 font-semibold text-gray-500">Category</th>
                          <th className="text-left px-5 py-3 font-semibold text-gray-500">Price</th>
                          <th className="text-center px-5 py-3 font-semibold text-gray-500">Sales</th>
                          <th className="text-center px-5 py-3 font-semibold text-gray-500">Rating</th>
                          <th className="text-right px-5 py-3 font-semibold text-gray-500">Date</th>
                          <th className="text-right px-5 py-3 font-semibold text-gray-500">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3.5">
                              <p className="font-semibold text-gray-200 truncate max-w-[200px]">{p.title}</p>
                            </td>
                            <td className="px-5 py-3.5 text-gray-400 capitalize">{p.category}</td>
                            <td className="px-5 py-3.5 font-semibold text-gray-200">{p.price}</td>
                            <td className="px-5 py-3.5 text-center text-gray-400">{p.sales}</td>
                            <td className="px-5 py-3.5 text-center">
                              <span className="text-amber-500">{p.rating > 0 ? p.rating : '—'}</span>
                            </td>
                            <td className="px-5 py-3.5 text-right text-gray-500">{p.date}</td>
                            <td className="px-5 py-3.5 text-right">
                              <button onClick={() => deleteProduct(p.id)}
                                className="text-red-500 hover:text-red-400 font-semibold cursor-pointer">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-[#1a1d23] border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-800">
                <h2 className="text-xs font-bold text-gray-200">All Orders ({orders.length})</h2>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-gray-600 text-4xl mb-3 block">receipt_long</span>
                  <p className="text-xs text-gray-500">No orders received yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 bg-[#0f1117]/50">
                        <th className="text-left px-5 py-3 font-semibold text-gray-500">Order ID</th>
                        <th className="text-left px-5 py-3 font-semibold text-gray-500">Payment</th>
                        <th className="text-left px-5 py-3 font-semibold text-gray-500">Items</th>
                        <th className="text-left px-5 py-3 font-semibold text-gray-500">Date</th>
                        <th className="text-right px-5 py-3 font-semibold text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o, i) => {
                        const isOpen = expandedOrder === i
                        return (
                          <>
                            <tr key={i} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setExpandedOrder(isOpen ? null : i)}>
                              <td className="px-5 py-3.5 font-mono font-bold text-gray-200 text-[11px]">{o.orderId}</td>
                              <td className="px-5 py-3.5">
                                <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize">{o.paymentMethod || 'qris'}</span>
                              </td>
                              <td className="px-5 py-3.5 text-gray-400">{o.items?.reduce((s, it) => s + (it.qty || 1), 0) || 0} items</td>
                              <td className="px-5 py-3.5 text-gray-400">{o.date}</td>
                              <td className="px-5 py-3.5 text-right font-bold text-gray-200">{o.total}</td>
                            </tr>
                            {isOpen && (
                              <tr key={`${i}-detail`} className="bg-white/[0.015]">
                                <td colSpan={5} className="px-5 py-4">
                                  <div className="bg-white/[0.03] rounded-xl p-4 space-y-2.5 max-w-lg">
                                    {o.items?.map((item, idx) => (
                                      <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                          <span className="text-xs text-gray-300 truncate">{item.title || item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                          <span className="text-[10px] text-gray-500">x{item.qty || 1}</span>
                                          <span className="text-xs font-semibold text-gray-200">{item.price}</span>
                                        </div>
                                      </div>
                                    ))}
                                    <div className="border-t border-gray-800 pt-2.5 mt-2.5 flex items-center justify-between">
                                      <span className="text-[10px] text-gray-500">Shipping to: {o.address || o.shippingAddress || '—'}</span>
                                      <span className="text-xs font-bold text-gray-200">Total: {o.total}</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
