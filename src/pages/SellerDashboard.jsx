import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import SellerSidebar from './seller/SellerSidebar'
import SellerOverview from './seller/SellerOverview'
import SellerProducts from './seller/SellerProducts'
import SellerOrders from './seller/SellerOrders'

const STORAGE_KEY = 'seller_products'

function loadProducts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

export default function SellerDashboard() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [products, setProducts] = useState(() => {
    if (!currentUser) return []
    return loadProducts().filter(p => p.sellerId === currentUser.id)
  })
  const [orders, setOrders] = useState([])
  const [addTrigger, setAddTrigger] = useState(0)

  useEffect(() => {
    if (!currentUser) return
    try {
      const all = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('orders_')) {
          const data = JSON.parse(localStorage.getItem(key))
          if (Array.isArray(data)) {
            data.forEach(o => {
              const hasSellerProduct = o.items?.some(item =>
                products.some(p => p.id === item.productId) ||
                (item.sellerId === currentUser.id)
              )
              if (hasSellerProduct) all.push(o)
            })
          }
        }
      }
      setOrders(all)
    } catch {}
  }, [currentUser, products])

  useEffect(() => {
    const onFocus = () => {
      setProducts(loadProducts().filter(p => p.sellerId === currentUser?.id))
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [currentUser])

  const saveProducts = (updated) => {
    setProducts(updated)
    const others = loadProducts().filter(p => p.sellerId !== currentUser.id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...updated, ...others]))
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm mx-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: 28 }}>store</span>
          </div>
          <h1 className="text-xl font-bold text-on-surface mb-2">Sign in required</h1>
          <p className="text-text-muted mb-5 text-sm">Please sign in to access your seller dashboard.</p>
          <Link to="/login" className="bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold inline-block hover:bg-emerald-400 transition-colors">Sign In</Link>
        </div>
      </div>
    )
  }

  if (!currentUser.isSeller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm mx-4">
          <span className="material-symbols-outlined text-5xl text-text-muted mb-4 inline-block" style={{ fontSize: 48 }}>hourglass_empty</span>
          <h1 className="text-xl font-bold text-on-surface mb-2">Approval Pending</h1>
          <p className="text-text-muted max-w-sm text-sm">Your seller request has been submitted. An admin will review and approve your account shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <SellerSidebar
        activeTab={activeTab} setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        accountOpen={accountOpen} setAccountOpen={setAccountOpen}
        currentUser={currentUser} products={products}
        handleLogout={handleLogout}
      />

      <div className="flex-1 min-w-0">
        <div className="md:hidden h-14 bg-surface border-b border-border-light flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-text-muted cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface" style={{ fontSize: 14 }}>store</span>
            </div>
            <span className="text-xs font-bold text-text-main">Seller Panel</span>
          </div>
          <div className="w-6" />
        </div>

        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg md:text-xl font-bold text-on-surface capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : `${activeTab} Management`}
            </h1>
            {activeTab === 'products' && (
              <button onClick={() => { setActiveTab('products'); setAddTrigger(t => t + 1) }}
                className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-400 transition-colors cursor-pointer">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                Add Product
              </button>
            )}
          </div>

          {activeTab === 'overview' && (
            <SellerOverview
              products={products} orders={orders}
              totalSales={totalSales} totalEarnings={totalEarnings}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'products' && (
            <SellerProducts products={products} saveProducts={saveProducts} currentUser={currentUser} addTrigger={addTrigger} />
          )}
          {activeTab === 'orders' && (
            <SellerOrders orders={orders} />
          )}
        </div>
      </div>
    </div>
  )
}
