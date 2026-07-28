import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const categoryData = [
  { name: 'Templates', count: 38 },
  { name: 'Integrations', count: 34 },
  { name: 'Chatbots', count: 30 },
  { name: 'Automation', count: 30 },
  { name: 'AI Tools', count: 36 },
  { name: 'Voice AI', count: 30 },
  { name: 'Image Gen', count: 30 },
  { name: 'Analytics', count: 30 },
  { name: 'Fine-Tuning', count: 30 },
  { name: 'Monitoring', count: 30 },
  { name: 'Security', count: 30 },
]

export default function AdminDashboard() {
  const { currentUser, logout, becomeAdmin } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [sellerProducts, setSellerProducts] = useState([])
  const [activeTab, setActiveTab] = useState('sellers')
  const [accountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) becomeAdmin()
  }, [])

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('auth_users') || '[]').map(user => ({
        ...user, isAdmin: user.isAdmin || false, isSeller: user.isSeller || false,
      }))
      setUsers(u)
    } catch {}
    try {
      const o = JSON.parse(localStorage.getItem('orders') || '[]')
      setOrders(o)
    } catch {}
    try {
      const sp = JSON.parse(localStorage.getItem('seller_products') || '[]')
      setSellerProducts(sp)
    } catch {}
  }, [])

  const toggleSellerStatus = (userId) => {
    const updated = users.map(u => u.id === userId ? { ...u, isSeller: !u.isSeller } : u)
    setUsers(updated)
    localStorage.setItem('auth_users', JSON.stringify(updated))
    const user = updated.find(u => u.id === userId)
    if (currentUser?.id === userId) {
      const u = { ...currentUser, isSeller: user.isSeller }
      localStorage.setItem('auth_current', JSON.stringify(u))
    }
  }

  const deleteProduct = (id) => {
    const updated = sellerProducts.filter(p => p.id !== id)
    setSellerProducts(updated)
    localStorage.setItem('seller_products', JSON.stringify(updated))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-5 ring-1 ring-indigo-500/30">
            <span className="material-symbols-outlined text-indigo-400" style={{ fontSize: 32 }}>admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-slate-400 mb-6 text-sm">Sign in to manage your marketplace.</p>
          <Link to="/login" className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-lg text-sm font-bold inline-block transition-all shadow-lg shadow-indigo-500/25">Sign In</Link>
        </div>
      </div>
    )
  }

  const sellers = users.filter(u => u.isSeller)
  const totalRevenue = orders.reduce((sum, o) => {
    const num = parseFloat(o.total?.replace(/[^0-9.,]/g, '').replace(/,/g, '')) || 0
    return sum + num
  }, 0)
  const totalJSON = categoryData.reduce((s, c) => s + c.count, 0)

  const tabs = [
    { key: 'sellers', label: 'Sellers', icon: 'storefront' },
    { key: 'products', label: 'Products', icon: 'inventory_2' },
    { key: 'orders', label: 'Orders', icon: 'receipt_long' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-800">
      <div className="border-b border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/30">
              <span className="material-symbols-outlined text-indigo-400" style={{ fontSize: 18 }}>admin_panel_settings</span>
            </div>
            <span className="text-sm font-bold text-white">Admin Panel</span>
          </div>

          <div className="relative">
            <button onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold pl-2.5 pr-1.5 py-1.5 rounded-lg transition-colors cursor-pointer">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center overflow-hidden">
                {currentUser.picture
                  ? <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
                  : currentUser.name[0].toUpperCase()}
              </span>
              <span className="hidden sm:inline">{currentUser.name}</span>
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 16 }}>arrow_drop_down</span>
            </button>

            {accountOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-slate-800 border border-white/10 rounded-xl shadow-2xl shadow-black/40 z-20 py-1.5 backdrop-blur-sm">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <Link to="/" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2 transition-colors">
                    <span className="material-symbols-outlined text-slate-500" style={{ fontSize: 14 }}>store</span>
                    Back to Store
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-white/5 px-3 py-2 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-red-400" style={{ fontSize: 14 }}>logout</span>
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Sellers', value: sellers.length, icon: 'storefront', color: 'from-emerald-500 to-teal-600' },
            { label: 'Products', value: totalJSON + sellerProducts.length, icon: 'inventory_2', color: 'from-blue-500 to-indigo-600' },
            { label: 'Orders', value: orders.length, icon: 'receipt_long', color: 'from-amber-500 to-orange-600' },
            { label: 'Revenue', value: `$${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, icon: 'payments', color: 'from-violet-500 to-purple-600' },
          ].map((card, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/5 rounded-xl p-4 md:p-5 hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>{card.icon}</span>
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{card.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white/[0.04] border border-white/5 rounded-xl overflow-hidden">
          <div className="flex border-b border-white/5">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-3.5 transition-colors cursor-pointer ${activeTab === tab.key ? 'text-indigo-400 border-b-2 border-indigo-400 bg-white/[0.02]' : 'text-slate-400 hover:text-slate-200'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-6">
            {activeTab === 'sellers' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/5">
                      <th className="text-left py-2.5 pr-3 font-semibold">Seller</th>
                      <th className="text-left py-2.5 pr-3 font-semibold">Email</th>
                      <th className="text-left py-2.5 pr-3 font-semibold">Products Listed</th>
                      <th className="text-right py-2.5 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.length === 0 ? (
                      <tr><td colSpan={4} className="py-10 text-center text-slate-500">No sellers registered yet.</td></tr>
                    ) : (
                      sellers.map((u, i) => {
                        const productCount = sellerProducts.filter(p => p.sellerId === u.id).length
                        return (
                          <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 overflow-hidden ring-1 ring-indigo-500/20">
                                  {u.picture ? <img src={u.picture} alt="" className="w-full h-full object-cover" /> : u.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                                <span className="font-semibold text-slate-200">{u.name}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-3 text-slate-400">{u.email}</td>
                            <td className="py-3 pr-3 text-slate-300">{productCount} product{productCount !== 1 ? 's' : ''}</td>
                            <td className="py-3 text-right">
                              <button onClick={() => toggleSellerStatus(u.id)}
                                className="text-[10px] text-red-400 hover:text-red-300 font-bold cursor-pointer bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 rounded-md transition-colors">Revoke</button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">JSON Products by Category</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categoryData.map((cat, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 md:p-4 hover:bg-white/[0.05] transition-colors">
                        <p className="text-xs font-semibold text-slate-200 truncate">{cat.name}</p>
                        <p className="text-xl font-bold text-indigo-400 mt-1">{cat.count}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">Total JSON Products</span>
                    <span className="text-lg font-bold text-indigo-400">{totalJSON}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Seller Products ({sellerProducts.length})</h3>
                  </div>
                  {sellerProducts.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center bg-white/[0.03] border border-white/5 rounded-xl">No seller products listed yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-slate-400 border-b border-white/5">
                            <th className="text-left py-2.5 pr-3 font-semibold">Product</th>
                            <th className="text-left py-2.5 pr-3 font-semibold">Category</th>
                            <th className="text-left py-2.5 pr-3 font-semibold">Price</th>
                            <th className="text-right py-2.5 font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerProducts.map((p, i) => (
                            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 pr-3 font-semibold text-slate-200">{p.title}</td>
                              <td className="py-3 pr-3 capitalize text-slate-400">{p.category}</td>
                              <td className="py-3 pr-3 text-slate-200">{p.price}</td>
                              <td className="py-3 text-right">
                                <button onClick={() => deleteProduct(p.id)}
                                  className="text-[10px] text-red-400 hover:text-red-300 font-bold cursor-pointer bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 rounded-md transition-colors">Delete</button>
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

            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/5">
                      <th className="text-left py-2.5 pr-3 font-semibold">Order ID</th>
                      <th className="text-left py-2.5 pr-3 font-semibold">Payment</th>
                      <th className="text-left py-2.5 pr-3 font-semibold">Items</th>
                      <th className="text-left py-2.5 pr-3 font-semibold">Date</th>
                      <th className="text-right py-2.5 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="py-10 text-center text-slate-500">No orders placed yet.</td></tr>
                    ) : (
                      orders.map((o, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 pr-3 font-mono font-bold text-slate-200 text-[11px]">{o.orderId}</td>
                          <td className="py-3 pr-3 capitalize text-slate-300">{o.paymentMethod || 'qris'}</td>
                          <td className="py-3 pr-3 text-slate-400">{o.items?.reduce((s, it) => s + (it.qty || 1), 0) || 0} items</td>
                          <td className="py-3 pr-3 text-slate-400">{o.date}</td>
                          <td className="py-3 text-right font-bold text-slate-200">{o.total}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
