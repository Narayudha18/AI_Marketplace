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
  const { currentUser, becomeAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [sellerProducts, setSellerProducts] = useState([])
  const [activeTab, setActiveTab] = useState('sellers')

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) becomeAdmin()
  }, [])

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('auth_users') || '[]').map(user => ({
        ...user,
        isAdmin: user.isAdmin || false,
        isSeller: user.isSeller || false,
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-text-muted mb-4 inline-block" style={{ fontSize: 64 }}>admin_panel_settings</span>
          <h1 className="text-2xl font-bold text-text-main mb-2">Sign in required</h1>
          <p className="text-text-muted mb-6">Please sign in to access admin panel.</p>
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

  return (
    <div className="min-h-screen bg-surface">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>admin_panel_settings</span>
          <h1 className="text-xl font-bold text-text-main">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-surface border border-border-light rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>storefront</span>
              <p className="text-xs text-text-muted">Sellers</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-text-main">{sellers.length}</p>
          </div>
          <div className="bg-surface border border-border-light rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>inventory_2</span>
              <p className="text-xs text-text-muted">Products</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-text-main">{totalJSON + sellerProducts.length}</p>
          </div>
          <div className="bg-surface border border-border-light rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>receipt_long</span>
              <p className="text-xs text-text-muted">Orders</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-text-main">{orders.length}</p>
          </div>
          <div className="bg-surface border border-border-light rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>payments</span>
              <p className="text-xs text-text-muted">Revenue</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-text-main">${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
          </div>
        </div>

        <div className="mt-6 bg-surface border border-border-light rounded-xl overflow-hidden">
          <div className="flex border-b border-border-light">
            {[
              { key: 'sellers', label: 'Sellers', icon: 'storefront' },
              { key: 'products', label: 'Products', icon: 'inventory_2' },
              { key: 'orders', label: 'Orders', icon: 'receipt_long' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-3.5 transition-colors cursor-pointer ${activeTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`}>
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
                    <tr className="text-text-muted border-b border-border-light">
                      <th className="text-left py-2 pr-3 font-semibold">Seller</th>
                      <th className="text-left py-2 pr-3 font-semibold">Email</th>
                      <th className="text-left py-2 pr-3 font-semibold">Products Listed</th>
                      <th className="text-right py-2 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.length === 0 ? (
                      <tr><td colSpan={4} className="py-8 text-center text-text-muted">No sellers yet</td></tr>
                    ) : (
                      sellers.map((u, i) => {
                        const productCount = sellerProducts.filter(p => p.sellerId === u.id).length
                        return (
                          <tr key={i} className="border-b border-border-light last:border-0">
                            <td className="py-2.5 pr-3">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {u.picture ? <img src={u.picture} alt="" className="w-full h-full object-cover" /> : u.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                                <span className="font-semibold text-text-main">{u.name}</span>
                              </div>
                            </td>
                            <td className="py-2.5 pr-3 text-text-muted">{u.email}</td>
                            <td className="py-2.5 pr-3">{productCount} product{productCount !== 1 ? 's' : ''}</td>
                            <td className="py-2.5 text-right">
                              <button onClick={() => toggleSellerStatus(u.id)}
                                className="text-[10px] text-red-500 hover:text-red-600 font-bold cursor-pointer">Revoke Seller</button>
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
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">JSON Products by Category</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categoryData.map((cat, i) => (
                      <div key={i} className="bg-surface-container-low rounded-xl p-3 md:p-4">
                        <p className="text-xs font-semibold text-text-main truncate">{cat.name}</p>
                        <p className="text-lg font-bold text-primary mt-1">{cat.count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Seller Products ({sellerProducts.length})</h3>
                  </div>
                  {sellerProducts.length === 0 ? (
                    <p className="text-xs text-text-muted py-4 text-center bg-surface-container-low rounded-xl">No seller products yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-text-muted border-b border-border-light">
                            <th className="text-left py-2 pr-3 font-semibold">Product</th>
                            <th className="text-left py-2 pr-3 font-semibold">Category</th>
                            <th className="text-left py-2 pr-3 font-semibold">Price</th>
                            <th className="text-right py-2 font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerProducts.map((p, i) => (
                            <tr key={i} className="border-b border-border-light last:border-0">
                              <td className="py-2.5 pr-3 font-semibold text-text-main">{p.title}</td>
                              <td className="py-2.5 pr-3 capitalize text-text-muted">{p.category}</td>
                              <td className="py-2.5 pr-3 text-text-main">{p.price}</td>
                              <td className="py-2.5 text-right">
                                <button onClick={() => deleteProduct(p.id)}
                                  className="text-[10px] text-red-500 hover:text-red-600 font-bold cursor-pointer">Delete</button>
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
                    <tr className="text-text-muted border-b border-border-light">
                      <th className="text-left py-2 pr-3 font-semibold">Order ID</th>
                      <th className="text-left py-2 pr-3 font-semibold">Payment</th>
                      <th className="text-left py-2 pr-3 font-semibold">Items</th>
                      <th className="text-left py-2 pr-3 font-semibold">Date</th>
                      <th className="text-right py-2 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-text-muted">No orders yet</td></tr>
                    ) : (
                      orders.map((o, i) => (
                        <tr key={i} className="border-b border-border-light last:border-0">
                          <td className="py-2.5 pr-3 font-mono font-bold text-text-main text-[11px]">{o.orderId}</td>
                          <td className="py-2.5 pr-3 capitalize">{o.paymentMethod || 'qris'}</td>
                          <td className="py-2.5 pr-3 text-text-muted">{o.items?.reduce((s, it) => s + (it.qty || 1), 0) || 0} items</td>
                          <td className="py-2.5 pr-3 text-text-muted">{o.date}</td>
                          <td className="py-2.5 text-right font-bold text-text-main">{o.total}</td>
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
