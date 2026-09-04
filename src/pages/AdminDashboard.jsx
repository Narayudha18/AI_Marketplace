import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import { ALL_SEED_PRODUCTS } from '../data/seed-sellers'
import AdminSidebar from './admin/AdminSidebar'
import AdminOverview from './admin/AdminOverview'
import AdminUsers from './admin/AdminUsers'
import AdminSellers from './admin/AdminSellers'
import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'
import AdminReviews from './admin/AdminReviews'

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

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
  }

  const [users, setUsers] = useState(readUsers)
  const [orders, setOrders] = useState(readOrders)
  const [orderStatuses, setOrderStatuses] = useState(readOrderStatuses)
  const [sellerProducts, setSellerProducts] = useState(readSellerProducts)
  const [allReviews, setAllReviews] = useState(readReviews)

  const refresh = () => { setUsers(readUsers()); setOrders(readOrders()); setOrderStatuses(readOrderStatuses()); setSellerProducts(readSellerProducts()); setAllReviews(readReviews()) }

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

  const deleteReview = (key, reviewIdentity) => {
    try {
      const data = JSON.parse(localStorage.getItem(key)) || []
      const idx = data.findIndex(r => r.name === reviewIdentity.name && r.date === reviewIdentity.date && r.text === reviewIdentity.text)
      if (idx !== -1) {
        data.splice(idx, 1)
        if (data.length === 0) localStorage.removeItem(key)
        else localStorage.setItem(key, JSON.stringify(data))
        setAllReviews(prev => prev.filter(r => !(r._key === key && r.name === reviewIdentity.name && r.date === reviewIdentity.date && r.text === reviewIdentity.text)))
      }
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

  if (!currentUser.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5 ring-1 ring-red-500/20">
            <span className="material-symbols-outlined text-red-400" style={{ fontSize: 32 }}>block</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Access Denied</h1>
          <p className="text-text-muted mb-6 text-sm">You do not have admin privileges.</p>
          <Link to="/" className="bg-blue-500 text-on-surface px-6 py-2.5 rounded-lg text-sm font-bold inline-block hover:bg-blue-400 transition-colors">Go Home</Link>
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
  const totalProducts = ALL_SEED_PRODUCTS.length + sellerProducts.length

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        activeTab={activeTab} setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        accountOpen={accountOpen} setAccountOpen={setAccountOpen}
        currentUser={currentUser} pendingSellers={pendingSellers}
        allReviews={allReviews} handleLogout={handleLogout}
        dark={dark} toggle={toggle}
      />

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

          {activeTab === 'overview' && (
            <AdminOverview
              users={users} orders={orders} orderStatuses={orderStatuses}
              pendingSellers={pendingSellers} totalProducts={totalProducts}
              totalRevenue={totalRevenue} setActiveTab={setActiveTab}
              approveSeller={approveSeller} rejectSeller={rejectSeller}
            />
          )}
          {activeTab === 'users' && (
            <AdminUsers users={users} approveSeller={approveSeller}
              toggleSellerStatus={toggleSellerStatus} deleteUser={deleteUser}
            />
          )}
          {activeTab === 'sellers' && (
            <AdminSellers sellers={sellers} pendingSellers={pendingSellers}
              sellerProducts={sellerProducts} approveSeller={approveSeller}
              rejectSeller={rejectSeller} toggleSellerStatus={toggleSellerStatus}
            />
          )}
          {activeTab === 'products' && (
            <AdminProducts sellerProducts={sellerProducts} deleteProduct={deleteProduct} />
          )}
          {activeTab === 'orders' && (
            <AdminOrders orders={orders} orderStatuses={orderStatuses} updateOrderStatus={updateOrderStatus} />
          )}
          {activeTab === 'reviews' && (
            <AdminReviews allReviews={allReviews} deleteReview={deleteReview} />
          )}
        </div>
      </div>
    </div>
  )
}
