import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import UserProfileModal from '../components/UserProfileModal'

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
  { key: 'overview', label: 'Overview', icon: 'dashboard' },
  { key: 'users', label: 'Users', icon: 'people' },
  { key: 'sellers', label: 'Sellers', icon: 'storefront' },
  { key: 'products', label: 'Products', icon: 'inventory_2' },
  { key: 'orders', label: 'Orders', icon: 'receipt_long' },
  { key: 'reviews', label: 'Reviews', icon: 'rate_review' },
]

export default function AdminDashboard() {
  const { currentUser, logout, becomeAdmin } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  const readUsers = () => { try { return JSON.parse(localStorage.getItem('auth_users') || '[]').map(user => ({ ...user, isAdmin: user.isAdmin || false, isSeller: user.isSeller || false, sellerRequested: user.sellerRequested || false })) } catch { return [] } }
  const readOrders = () => {
    try {
      const all = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('orders_')) {
          const data = JSON.parse(localStorage.getItem(key))
          if (Array.isArray(data)) data.forEach(o => all.push(o))
        }
      }
      return all
    } catch { return [] }
  }
  const readOrderStatuses = () => { try { return JSON.parse(localStorage.getItem('order_statuses') || '{}') } catch { return {} } }
  const readSellerProducts = () => { try { return JSON.parse(localStorage.getItem('seller_products') || '[]') } catch { return [] } }
  const readReviews = () => {
    try {
      const prefix = 'reviews_'
      const result = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(prefix)) {
          const data = JSON.parse(localStorage.getItem(key))
          if (Array.isArray(data)) data.forEach(r => result.push({ ...r, _key: key, _category: key.replace(prefix, '').split('_')[0], _slug: key.replace(prefix, '').split('_').slice(1).join('_') }))
        }
      }
      return result
    } catch { return [] }
  }

  const [users, setUsers] = useState(readUsers)
  const [orders, setOrders] = useState(readOrders)
  const [orderStatuses, setOrderStatuses] = useState(readOrderStatuses)
  const [sellerProducts, setSellerProducts] = useState(readSellerProducts)
  const [allReviews, setAllReviews] = useState(readReviews)

  const refresh = () => { setUsers(readUsers()); setOrders(readOrders()); setOrderStatuses(readOrderStatuses()); setSellerProducts(readSellerProducts()); setAllReviews(readReviews()) }

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) becomeAdmin()
  }, [])

  useEffect(() => {
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const approveSeller = (userId) => {
    const updated = users.map(u => u.id === userId ? { ...u, isSeller: true, sellerRequested: false } : u)
    setUsers(updated)
    localStorage.setItem('auth_users', JSON.stringify(updated))
  }

  const rejectSeller = (userId) => {
    const updated = users.map(u => u.id === userId ? { ...u, sellerRequested: false } : u)
    setUsers(updated)
    localStorage.setItem('auth_users', JSON.stringify(updated))
  }

  const deleteUser = (userId) => {
    const updated = users.filter(u => u.id !== userId)
    setUsers(updated)
    localStorage.setItem('auth_users', JSON.stringify(updated))
  }

  const toggleSellerStatus = (userId) => {
    const updated = users.map(u => u.id === userId ? { ...u, isSeller: !u.isSeller, sellerRequested: false } : u)
    setUsers(updated)
    localStorage.setItem('auth_users', JSON.stringify(updated))
  }

  const deleteProduct = (id) => {
    const updated = sellerProducts.filter(p => p.id !== id)
    setSellerProducts(updated)
    localStorage.setItem('seller_products', JSON.stringify(updated))
  }

  const updateOrderStatus = (orderId, status) => {
    const updated = { ...orderStatuses, [orderId]: status }
    setOrderStatuses(updated)
    localStorage.setItem('order_statuses', JSON.stringify(updated))
  }

  const deleteReview = (key, idx) => {
    try {
      const data = JSON.parse(localStorage.getItem(key)) || []
      data.splice(idx, 1)
      if (data.length === 0) localStorage.removeItem(key)
      else localStorage.setItem(key, JSON.stringify(data))
      setAllReviews(prev => prev.filter((_, i) => !(prev[i]._key === key && i === idx)))
    } catch {}
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5 ring-1 ring-blue-500/20">
            <span className="material-symbols-outlined text-blue-400" style={{ fontSize: 32 }}>admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Admin Access</h1>
          <p className="text-text-muted mb-6 text-sm">Sign in to manage your marketplace.</p>
          <Link to="/login" className="bg-blue-500 text-on-surface px-6 py-2.5 rounded-lg text-sm font-bold inline-block hover:bg-blue-400 transition-colors">Sign In</Link>
        </div>
      </div>
    )
  }

  const sellers = users.filter(u => u.isSeller)
  const pendingSellers = users.filter(u => u.sellerRequested && !u.isSeller)
  const totalRevenue = orders.reduce((sum, o) => {
    const num = parseFloat(o.total?.replace(/[^0-9.,]/g, '').replace(/,/g, '')) || 0
    return sum + num
  }, 0)
  const totalJSON = categoryData.reduce((s, c) => s + c.count, 0)
  const totalProducts = totalJSON + sellerProducts.length

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:sticky top-0 left-0 z-30 h-screen w-60 bg-surface border-r border-border-light flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-border-light">
          <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: 16 }}>admin_panel_settings</span>
          </div>
          <span className="text-sm font-bold text-on-surface">Admin Panel</span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => (
            <button key={item.key} onClick={() => { setActiveTab(item.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-2.5 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${activeTab === item.key ? 'bg-blue-500/10 text-blue-400' : 'text-text-muted hover:text-text-main hover:bg-surface-container-low'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
              {item.key === 'sellers' && pendingSellers.length > 0 && (
                <span className="ml-auto bg-red-500 text-on-surface text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{pendingSellers.length}</span>
              )}
              {item.key === 'reviews' && allReviews.length > 0 && (
                <span className="ml-auto bg-surface-container text-text-muted text-[9px] font-bold px-1.5 py-0.5 rounded-full">{allReviews.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border-light">
          <div className="relative">
            <button onClick={() => setAccountOpen(!accountOpen)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
              <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
                {currentUser.picture
                  ? <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
                  : currentUser.name[0].toUpperCase()}
              </span>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-semibold text-text-main truncate">{currentUser.name}</p>
                <p className="text-[10px] text-text-muted/70 truncate">{currentUser.email}</p>
              </div>
              <span className="material-symbols-outlined text-text-muted/70" style={{ fontSize: 16 }}>more_vert</span>
            </button>

            {accountOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-surface-container border border-border-light rounded-xl shadow-2xl z-20 py-1.5">
                  <Link to="/" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 text-xs text-text-main/90 hover:text-on-surface hover:bg-surface-container-low px-3 py-2 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>store</span>
                    Back to Store
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-surface-container-low px-3 py-2 transition-colors cursor-pointer">
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
        <div className="md:hidden h-14 bg-surface border-b border-border-light flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-text-muted cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface" style={{ fontSize: 14 }}>admin_panel_settings</span>
            </div>
            <span className="text-xs font-bold text-text-main">Admin Panel</span>
          </div>
          <button onClick={toggle} className="text-text-muted hover:text-text-main transition-colors cursor-pointer p-1 flex items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{dark ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>

        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg md:text-xl font-bold text-on-surface capitalize">{activeTab === 'overview' ? 'Dashboard Overview' : `${activeTab} Management`}</h1>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="text-text-muted hover:text-text-main transition-colors cursor-pointer p-1.5 flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{dark ? 'light_mode' : 'dark_mode'}</span>
              </button>
              <button onClick={refresh} className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main bg-surface-container-low hover:bg-surface-container px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span>
                Refresh
              </button>
            </div>
          </div>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { label: 'Total Users', value: users.length, icon: 'people' },
                  { label: 'Total Products', value: totalProducts, icon: 'inventory_2' },
                  { label: 'Total Orders', value: orders.length, icon: 'receipt_long' },
                  { label: 'Revenue', value: `$${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, icon: 'payments' },
                ].map((card, i) => (
                  <div key={i} className="bg-surface border border-border-light rounded-xl p-4 md:p-5">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-blue-400" style={{ fontSize: 18 }}>{card.icon}</span>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-on-surface">{card.value}</p>
                    <p className="text-[11px] text-text-muted/70 mt-0.5">{card.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent Orders */}
                <div className="bg-surface border border-border-light rounded-xl p-5">
                  <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Recent Orders</h2>
                  {orders.length === 0 ? (
                    <p className="text-xs text-text-muted/70 py-4 text-center">No orders yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((o, i) => (
                        <div key={i} className="flex items-center justify-between bg-surface-container-low rounded-lg px-3.5 py-2.5">
                          <div>
                            <p className="text-xs font-bold text-text-main font-mono">{o.orderId}</p>
                            <p className="text-[10px] text-text-muted/70 mt-0.5">{o.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-text-main">{o.total}</p>
                            <p className="text-[10px] text-text-muted/70 capitalize">{o.paymentMethod || 'qris'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pending Sellers */}
                <div className="bg-surface border border-border-light rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Pending Seller Requests</h2>
                    {pendingSellers.length > 0 && <span className="bg-red-500 text-on-surface text-[9px] font-bold px-1.5 py-0.5 rounded-full">{pendingSellers.length}</span>}
                  </div>
                  {pendingSellers.length === 0 ? (
                    <p className="text-xs text-text-muted/70 py-4 text-center">No pending requests.</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingSellers.map((u, i) => (
                        <div key={i} className="flex items-center justify-between bg-surface-container-low rounded-lg px-3.5 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-[9px] font-bold flex items-center justify-center flex-shrink-0">{u.name[0].toUpperCase()}</span>
                            <div>
                              <p className="text-xs font-semibold text-text-main">{u.name}</p>
                              <p className="text-[10px] text-text-muted/70">{u.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => approveSeller(u.id)} className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2 py-1 rounded-md hover:bg-green-500/30 transition-colors cursor-pointer">Approve</button>
                            <button onClick={() => rejectSeller(u.id)} className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-1 rounded-md hover:bg-red-500/30 transition-colors cursor-pointer">Reject</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-surface border border-border-light rounded-xl p-5">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Manage Users', tab: 'users', icon: 'people', color: 'blue' },
                    { label: 'Seller Requests', tab: 'sellers', icon: 'storefront', color: 'emerald' },
                    { label: 'View Orders', tab: 'orders', icon: 'receipt_long', color: 'amber' },
                    { label: 'Moderate Reviews', tab: 'reviews', icon: 'rate_review', color: 'violet' },
                  ].map((action, i) => (
                    <button key={i} onClick={() => setActiveTab(action.tab)}
                      className="flex items-center gap-2.5 bg-surface-container-low hover:bg-surface-container-high border border-border-light rounded-xl p-3.5 transition-colors text-left cursor-pointer">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color === 'blue' ? 'bg-blue-500/10' : action.color === 'emerald' ? 'bg-emerald-500/10' : action.color === 'amber' ? 'bg-amber-500/10' : 'bg-violet-500/10'}`}>
                        <span className={`material-symbols-outlined ${action.color === 'blue' ? 'text-blue-400' : action.color === 'emerald' ? 'text-emerald-400' : action.color === 'amber' ? 'text-amber-400' : 'text-violet-400'}`} style={{ fontSize: 18 }}>{action.icon}</span>
                      </div>
                      <span className="text-xs font-semibold text-text-main">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === 'users' && (
            <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">All Users</h2>
                <span className="text-[11px] text-text-muted/70">{users.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-text-muted/70 bg-surface-container-low/50">
                      <th className="text-left py-3 px-5 font-semibold">User</th>
                      <th className="text-left py-3 px-5 font-semibold">Email</th>
                      <th className="text-left py-3 px-5 font-semibold">Role</th>
                      <th className="text-right py-3 px-5 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i} className="border-t border-border-light hover:bg-surface-container-low transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {u.picture ? <img src={u.picture} alt="" className="w-full h-full object-cover" /> : u.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                            <span className="font-semibold text-text-main">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-text-muted">{u.email}</td>
                        <td className="py-3.5 px-5">
                          <div className="flex gap-1">
                            {u.isAdmin && <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-bold">Admin</span>}
                            {u.isSeller && !u.isAdmin && <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold">Seller</span>}
                            {u.sellerRequested && <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold">Pending</span>}
                            {!u.isAdmin && !u.isSeller && !u.sellerRequested && <span className="bg-surface-container text-text-muted px-2 py-0.5 rounded-full text-[10px] font-bold">Buyer</span>}
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          {!u.isAdmin && (
                            <div className="flex gap-1.5 justify-end">
                              <button onClick={() => setSelectedUser(u)}
                                className="text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">View</button>
                              {!u.isSeller ? (
                                <button onClick={() => approveSeller(u.id)}
                                  className="text-[10px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold px-2 py-1 rounded-md transition-colors cursor-pointer">Make Seller</button>
                              ) : (
                                <button onClick={() => toggleSellerStatus(u.id)}
                                  className="text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold px-2 py-1 rounded-md transition-colors cursor-pointer">Revoke</button>
                              )}
                              <button onClick={() => deleteUser(u.id)}
                                className="text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold px-2 py-1 rounded-md transition-colors cursor-pointer">Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SELLERS */}
          {activeTab === 'sellers' && (
            <div className="space-y-6">
              {pendingSellers.length > 0 && (
                <div className="bg-surface border border-amber-500/20 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border-light flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 16 }}>hourglass_empty</span>
                    <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Pending Approval ({pendingSellers.length})</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-text-muted/70 bg-surface-container-low/50">
                          <th className="text-left py-3 px-5 font-semibold">User</th>
                          <th className="text-left py-3 px-5 font-semibold">Email</th>
                          <th className="text-right py-3 px-5 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingSellers.map((u, i) => (
                          <tr key={i} className="border-t border-border-light">
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{u.name[0].toUpperCase()}</span>
                                <span className="font-semibold text-text-main">{u.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 text-text-muted">{u.email}</td>
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex gap-1.5 justify-end">
                                <button onClick={() => navigate(`/admin/preview/seller/${u.id}`)} className="text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">View</button>
                                <button onClick={() => approveSeller(u.id)} className="text-[10px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">Approve</button>
                                <button onClick={() => rejectSeller(u.id)} className="text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">Reject</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
                  <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Active Sellers</h2>
                  <span className="text-[11px] text-text-muted/70">{sellers.length} registered</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-text-muted/70 bg-surface-container-low/50">
                        <th className="text-left py-3 px-5 font-semibold">Seller</th>
                        <th className="text-left py-3 px-5 font-semibold">Email</th>
                        <th className="text-left py-3 px-5 font-semibold">Products</th>
                        <th className="text-right py-3 px-5 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellers.length === 0 ? (
                        <tr><td colSpan={4} className="py-12 text-center text-text-muted/70">No approved sellers yet.</td></tr>
                      ) : (
                        sellers.map((u, i) => {
                          const productCount = sellerProducts.filter(p => p.sellerId === u.id).length
                          return (
                            <tr key={i} className="border-t border-border-light hover:bg-surface-container-low transition-colors">
                              <td className="py-3.5 px-5">
                                <div className="flex items-center gap-2.5">
                                  <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {u.picture ? <img src={u.picture} alt="" className="w-full h-full object-cover" /> : u.name?.[0]?.toUpperCase() || 'U'}
                                  </span>
                                  <span className="font-semibold text-text-main">{u.name}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-5 text-text-muted">{u.email}</td>
                              <td className="py-3.5 px-5 text-text-main/90">{productCount}</td>
                              <td className="py-3.5 px-5 text-right">
                                <div className="flex gap-1.5 justify-end">
                                  <button onClick={() => navigate(`/admin/preview/seller/${u.id}`)}
                                    className="text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">View</button>
                                  <button onClick={() => toggleSellerStatus(u.id)}
                                    className="text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer">Revoke</button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-surface border border-border-light rounded-xl p-5">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">JSON Products by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="bg-surface-container-low rounded-xl p-3.5 md:p-4">
                      <p className="text-xs font-semibold text-text-main truncate">{cat.name}</p>
                      <p className="text-xl font-bold text-blue-400 mt-1">{cat.count}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-main">Total JSON Products</span>
                  <span className="text-lg font-bold text-blue-400">{totalJSON}</span>
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
                                <button onClick={() => deleteProduct(p.id)}
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
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">All Orders</h2>
                <span className="text-[11px] text-text-muted/70">{orders.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-text-muted/70 bg-surface-container-low/50">
                      <th className="text-left py-3 px-5 font-semibold">Order ID</th>
                      <th className="text-left py-3 px-5 font-semibold">Payment</th>
                      <th className="text-left py-3 px-5 font-semibold">Items</th>
                      <th className="text-left py-3 px-5 font-semibold">Status</th>
                      <th className="text-left py-3 px-5 font-semibold">Date</th>
                      <th className="text-right py-3 px-5 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={6} className="py-12 text-center text-text-muted/70">No orders placed yet.</td></tr>
                    ) : (
                      orders.map((o, i) => {
                        const isOpen = expandedOrder === i
                        const status = orderStatuses[o.orderId] || 'completed'
                        const statusColors = {
                          completed: 'bg-emerald-500/10 text-emerald-400',
                          processing: 'bg-blue-500/10 text-blue-400',
                          shipped: 'bg-violet-500/10 text-violet-400',
                          cancelled: 'bg-red-500/10 text-red-400',
                        }
                        return (
                          <>
                            <tr key={i} className="border-t border-border-light hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => setExpandedOrder(isOpen ? null : i)}>
                              <td className="py-3.5 px-5 font-mono font-bold text-text-main text-[11px]">{o.orderId}</td>
                              <td className="py-3.5 px-5"><span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize">{o.paymentMethod || 'qris'}</span></td>
                              <td className="py-3.5 px-5 text-text-muted">{o.items?.reduce((s, it) => s + (it.qty || 1), 0) || 0} items</td>
                              <td className="py-3.5 px-5">
                                <select value={status} onChange={e => { e.stopPropagation(); updateOrderStatus(o.orderId, e.target.value) }}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-0 outline-none cursor-pointer ${statusColors[status] || 'bg-surface-container text-text-muted'}`}
                                  onClick={e => e.stopPropagation()}>
                                  <option value="completed">Completed</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="py-3.5 px-5 text-text-muted">{o.date}</td>
                              <td className="py-3.5 px-5 text-right font-bold text-text-main">{o.total}</td>
                            </tr>
                            {isOpen && (
                              <tr key={`${i}-detail`} className="bg-white/[0.015]">
                                <td colSpan={6} className="px-5 py-4">
                                  <div className="bg-surface-container-low rounded-xl p-4 space-y-2.5 max-w-lg">
                                    {o.items?.map((item, idx) => {
                                      const itemName = item.title || item.name
                                      const itemTotal = item.price ? parseFloat(item.price.replace(/[^0-9.,]/g, '').replace(',', '.')) * (item.qty || 1) : 0
                                      return (
                                        <div key={idx} className="flex items-center gap-3">
                                          <img src={`https://picsum.photos/seed/${item.seed}/40/40`} alt="" className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-text-main truncate">{itemName}</p>
                                            <p className="text-[10px] text-text-muted/70">Qty: {item.qty || 1}</p>
                                          </div>
                                          <p className="text-xs font-bold text-text-main">{item.price}</p>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">All Reviews</h2>
                <span className="text-[11px] text-text-muted/70">{allReviews.length} total</span>
              </div>
              {allReviews.length === 0 ? (
                <div className="py-12 text-center text-text-muted/70 text-xs">No reviews from users yet.</div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {allReviews.map((r, i) => (
                    <div key={i} className="px-5 py-4 hover:bg-surface-container-low transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-text-main">{r.name}</span>
                            <span className="text-[10px] text-text-muted/70">{r.date}</span>
                            <span className="text-[10px] bg-surface-container text-text-muted px-1.5 py-0.5 rounded-full">{r._category}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <span key={s} className={`material-symbols-outlined ${s <= (r.rating || 0) ? 'text-amber-400' : 'text-text-muted'}`} style={{ fontSize: 12 }}>star</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-text-muted mt-1.5">{r.text}</p>
                        </div>
                        <button onClick={() => deleteReview(r._key, i)}
                          className="text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded-md transition-colors flex-shrink-0 cursor-pointer">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          productCount={sellerProducts.filter(p => p.sellerId === selectedUser.id).length}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}





