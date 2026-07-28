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

const sidebarItems = [
  { key: 'sellers', label: 'Sellers', icon: 'storefront' },
  { key: 'products', label: 'Products', icon: 'inventory_2' },
  { key: 'orders', label: 'Orders', icon: 'receipt_long' },
]

export default function AdminDashboard() {
  const { currentUser, logout, becomeAdmin } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [sellerProducts, setSellerProducts] = useState([])
  const [activeTab, setActiveTab] = useState('sellers')
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5 ring-1 ring-blue-500/20">
            <span className="material-symbols-outlined text-blue-400" style={{ fontSize: 32 }}>admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 mb-6 text-sm">Sign in to manage your marketplace.</p>
          <Link to="/login" className="bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold inline-block hover:bg-blue-400 transition-colors">Sign In</Link>
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
  const totalProducts = totalJSON + sellerProducts.length

  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:sticky top-0 left-0 z-30 h-screen w-60 bg-[#1a1d23] border-r border-gray-800 flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-gray-800">
          <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 16 }}>admin_panel_settings</span>
          </div>
          <span className="text-sm font-bold text-white">Admin Panel</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map(item => (
            <button key={item.key} onClick={() => { setActiveTab(item.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-2.5 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${activeTab === item.key ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
              {(item.key === 'sellers' && sellers.length > 0) && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === item.key ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400'}`}>{sellers.length}</span>
              )}
              {(item.key === 'orders' && orders.length > 0) && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === item.key ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400'}`}>{orders.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <div className="relative">
            <button onClick={() => setAccountOpen(!accountOpen)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
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
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>store</span>
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
            <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontSize: 14 }}>admin_panel_settings</span>
            </div>
            <span className="text-xs font-bold text-gray-200">Admin Panel</span>
          </div>
          <div className="w-6" />
        </div>

        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px]">
          <h1 className="text-lg md:text-xl font-bold text-white mb-6 capitalize">{activeTab} Management</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {[
              { label: 'Sellers', value: sellers.length, icon: 'storefront' },
              { label: 'Products', value: totalProducts, icon: 'inventory_2' },
              { label: 'Orders', value: orders.length, icon: 'receipt_long' },
              { label: 'Revenue', value: `$${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, icon: 'payments' },
            ].map((card, i) => (
              <div key={i} className="bg-[#1a1d23] border border-gray-800 rounded-xl p-4 md:p-5">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-blue-400" style={{ fontSize: 18 }}>{card.icon}</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-white">{card.value}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{card.label}</p>
              </div>
            ))}
          </div>

          {activeTab === 'sellers' && (
            <div className="bg-[#1a1d23] border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Sellers</h2>
                <span className="text-[11px] text-gray-500">{sellers.length} registered</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 bg-white/[0.02]">
                      <th className="text-left py-3 px-5 font-semibold">Seller</th>
                      <th className="text-left py-3 px-5 font-semibold">Email</th>
                      <th className="text-left py-3 px-5 font-semibold">Products</th>
                      <th className="text-right py-3 px-5 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.length === 0 ? (
                      <tr><td colSpan={4} className="py-12 text-center text-gray-500">No sellers registered yet.</td></tr>
                    ) : (
                      sellers.map((u, i) => {
                        const productCount = sellerProducts.filter(p => p.sellerId === u.id).length
                        return (
                          <tr key={i} className="border-t border-gray-800 hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {u.picture ? <img src={u.picture} alt="" className="w-full h-full object-cover" /> : u.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                                <span className="font-semibold text-gray-200">{u.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 text-gray-400">{u.email}</td>
                            <td className="py-3.5 px-5 text-gray-300">{productCount}</td>
                            <td className="py-3.5 px-5 text-right">
                              <button onClick={() => toggleSellerStatus(u.id)}
                                className="text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 rounded-md transition-colors cursor-pointer">Revoke</button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-[#1a1d23] border border-gray-800 rounded-xl p-5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">JSON Products by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="bg-white/[0.03] rounded-xl p-3.5 md:p-4">
                      <p className="text-xs font-semibold text-gray-200 truncate">{cat.name}</p>
                      <p className="text-xl font-bold text-blue-400 mt-1">{cat.count}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-200">Total JSON Products</span>
                  <span className="text-lg font-bold text-blue-400">{totalJSON}</span>
                </div>
              </div>

              <div className="bg-[#1a1d23] border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seller Products ({sellerProducts.length})</h2>
                </div>
                {sellerProducts.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 text-xs">No seller products listed yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-500 bg-white/[0.02]">
                          <th className="text-left py-3 px-5 font-semibold">Product</th>
                          <th className="text-left py-3 px-5 font-semibold">Category</th>
                          <th className="text-left py-3 px-5 font-semibold">Price</th>
                          <th className="text-right py-3 px-5 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellerProducts.map((p, i) => (
                          <tr key={i} className="border-t border-gray-800 hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-5 font-semibold text-gray-200">{p.title}</td>
                            <td className="py-3.5 px-5 capitalize text-gray-400">{p.category}</td>
                            <td className="py-3.5 px-5 text-gray-300">{p.price}</td>
                            <td className="py-3.5 px-5 text-right">
                              <button onClick={() => deleteProduct(p.id)}
                                className="text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 rounded-md transition-colors cursor-pointer">Delete</button>
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
            <div className="bg-[#1a1d23] border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Orders</h2>
                <span className="text-[11px] text-gray-500">{orders.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 bg-white/[0.02]">
                      <th className="text-left py-3 px-5 font-semibold">Order ID</th>
                      <th className="text-left py-3 px-5 font-semibold">Payment</th>
                      <th className="text-left py-3 px-5 font-semibold">Items</th>
                      <th className="text-left py-3 px-5 font-semibold">Date</th>
                      <th className="text-right py-3 px-5 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-gray-500">No orders placed yet.</td></tr>
                    ) : (
                      orders.map((o, i) => (
                        <tr key={i} className="border-t border-gray-800 hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-5 font-mono font-bold text-gray-200 text-[11px]">{o.orderId}</td>
                          <td className="py-3.5 px-5"><span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize">{o.paymentMethod || 'qris'}</span></td>
                          <td className="py-3.5 px-5 text-gray-400">{o.items?.reduce((s, it) => s + (it.qty || 1), 0) || 0} items</td>
                          <td className="py-3.5 px-5 text-gray-400">{o.date}</td>
                          <td className="py-3.5 px-5 text-right font-bold text-gray-200">{o.total}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
