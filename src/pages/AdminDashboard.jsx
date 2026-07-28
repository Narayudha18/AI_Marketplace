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
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 32 }}>admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-2">Admin Access</h1>
          <p className="text-text-muted mb-6 text-sm">Sign in to manage your marketplace.</p>
          <Link to="/login" className="bg-primary text-surface px-6 py-2.5 rounded-lg text-sm font-bold inline-block hover:opacity-90 transition-opacity">Sign In</Link>
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
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-30 h-screen w-60 bg-surface border-r border-border-light flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-border-light">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-surface" style={{ fontSize: 16 }}>admin_panel_settings</span>
          </div>
          <span className="text-sm font-bold text-text-main">Admin Panel</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map(item => (
            <button key={item.key} onClick={() => { setActiveTab(item.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-2.5 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${activeTab === item.key ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text-main hover:bg-surface-container-low'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
              {item.key === 'sellers' && sellers.length > 0 && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === item.key ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-text-muted'}`}>{sellers.length}</span>
              )}
              {item.key === 'orders' && orders.length > 0 && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === item.key ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-text-muted'}`}>{orders.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border-light">
          <div className="relative">
            <button onClick={() => setAccountOpen(!accountOpen)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
                {currentUser.picture
                  ? <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
                  : currentUser.name[0].toUpperCase()}
              </span>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-semibold text-text-main truncate">{currentUser.name}</p>
                <p className="text-[10px] text-text-muted truncate">{currentUser.email}</p>
              </div>
              <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 16 }}>more_vert</span>
            </button>

            {accountOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-surface border border-border-light rounded-xl shadow-lg z-20 py-1.5">
                  <Link to="/" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 text-xs text-text-muted hover:text-text-main hover:bg-surface-container-low px-3 py-2 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>store</span>
                    Back to Store
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-xs text-red-500 hover:text-red-600 hover:bg-surface-container-low px-3 py-2 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>logout</span>
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar (mobile) */}
        <div className="md:hidden h-14 bg-surface border-b border-border-light flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-text-muted cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-surface" style={{ fontSize: 14 }}>admin_panel_settings</span>
            </div>
            <span className="text-xs font-bold text-text-main">Admin Panel</span>
          </div>
          <div className="w-6" />
        </div>

        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg md:text-xl font-bold text-text-main capitalize">{activeTab} Management</h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {[
              { label: 'Sellers', value: sellers.length, icon: 'storefront' },
              { label: 'Products', value: totalProducts, icon: 'inventory_2' },
              { label: 'Orders', value: orders.length, icon: 'receipt_long' },
              { label: 'Revenue', value: `$${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, icon: 'payments' },
            ].map((card, i) => (
              <div key={i} className="bg-surface border border-border-light rounded-xl p-4 md:p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>{card.icon}</span>
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-bold text-text-main">{card.value}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Sellers */}
          {activeTab === 'sellers' && (
            <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">All Sellers</h2>
                <span className="text-[11px] text-text-muted">{sellers.length} registered</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-text-muted bg-surface-container-low">
                      <th className="text-left py-3 px-5 font-semibold">Seller</th>
                      <th className="text-left py-3 px-5 font-semibold">Email</th>
                      <th className="text-left py-3 px-5 font-semibold">Products</th>
                      <th className="text-right py-3 px-5 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.length === 0 ? (
                      <tr><td colSpan={4} className="py-12 text-center text-text-muted">No sellers registered yet.</td></tr>
                    ) : (
                      sellers.map((u, i) => {
                        const productCount = sellerProducts.filter(p => p.sellerId === u.id).length
                        return (
                          <tr key={i} className="border-t border-border-light hover:bg-surface-container-low/50 transition-colors">
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {u.picture ? <img src={u.picture} alt="" className="w-full h-full object-cover" /> : u.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                                <span className="font-semibold text-text-main">{u.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 text-text-muted">{u.email}</td>
                            <td className="py-3.5 px-5 text-text-main">{productCount}</td>
                            <td className="py-3.5 px-5 text-right">
                              <button onClick={() => toggleSellerStatus(u.id)}
                                className="text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer">Revoke</button>
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

          {/* Products */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-surface border border-border-light rounded-xl p-5">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">JSON Products by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="bg-surface-container-low rounded-xl p-3.5 md:p-4">
                      <p className="text-xs font-semibold text-text-main truncate">{cat.name}</p>
                      <p className="text-xl font-bold text-primary mt-1">{cat.count}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-main">Total JSON Products</span>
                  <span className="text-lg font-bold text-primary">{totalJSON}</span>
                </div>
              </div>

              <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
                  <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Seller Products ({sellerProducts.length})</h2>
                </div>
                {sellerProducts.length === 0 ? (
                  <div className="py-12 text-center text-text-muted text-xs">No seller products listed yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-text-muted bg-surface-container-low">
                          <th className="text-left py-3 px-5 font-semibold">Product</th>
                          <th className="text-left py-3 px-5 font-semibold">Category</th>
                          <th className="text-left py-3 px-5 font-semibold">Price</th>
                          <th className="text-right py-3 px-5 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellerProducts.map((p, i) => (
                          <tr key={i} className="border-t border-border-light hover:bg-surface-container-low/50 transition-colors">
                            <td className="py-3.5 px-5 font-semibold text-text-main">{p.title}</td>
                            <td className="py-3.5 px-5 capitalize text-text-muted">{p.category}</td>
                            <td className="py-3.5 px-5 text-text-main">{p.price}</td>
                            <td className="py-3.5 px-5 text-right">
                              <button onClick={() => deleteProduct(p.id)}
                                className="text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer">Delete</button>
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

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">All Orders</h2>
                <span className="text-[11px] text-text-muted">{orders.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-text-muted bg-surface-container-low">
                      <th className="text-left py-3 px-5 font-semibold">Order ID</th>
                      <th className="text-left py-3 px-5 font-semibold">Payment</th>
                      <th className="text-left py-3 px-5 font-semibold">Items</th>
                      <th className="text-left py-3 px-5 font-semibold">Date</th>
                      <th className="text-right py-3 px-5 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-text-muted">No orders placed yet.</td></tr>
                    ) : (
                      orders.map((o, i) => (
                        <tr key={i} className="border-t border-border-light hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-3.5 px-5 font-mono font-bold text-text-main text-[11px]">{o.orderId}</td>
                          <td className="py-3.5 px-5 capitalize"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">{o.paymentMethod || 'qris'}</span></td>
                          <td className="py-3.5 px-5 text-text-muted">{o.items?.reduce((s, it) => s + (it.qty || 1), 0) || 0} items</td>
                          <td className="py-3.5 px-5 text-text-muted">{o.date}</td>
                          <td className="py-3.5 px-5 text-right font-bold text-text-main">{o.total}</td>
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
