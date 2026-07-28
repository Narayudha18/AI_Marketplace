import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const categoryFiles = [
  { name: 'Templates', json: 'templates.json' },
  { name: 'Integrations', json: 'integrations.json' },
  { name: 'Chatbots', json: 'chatbots.json' },
  { name: 'Automation', json: 'automation.json' },
  { name: 'AI Tools', json: 'aitools.json' },
  { name: 'Voice AI', json: 'voice-ai.json' },
  { name: 'Image Gen', json: 'image-gen.json' },
  { name: 'Analytics', json: 'analytics.json' },
  { name: 'Fine-Tuning', json: 'fine-tuning.json' },
  { name: 'Monitoring', json: 'monitoring.json' },
  { name: 'Security', json: 'security.json' },
]

export default function AdminDashboard() {
  const { currentUser, becomeAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('users')

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
  }, [])

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <main className="w-full max-w-[1440px] mx-auto px-6 py-16 text-center">
          <span className="material-symbols-outlined text-6xl text-text-muted mb-4" style={{ fontSize: 64 }}>admin_panel_settings</span>
          <h1 className="text-2xl font-bold text-text-main mb-2">Sign in required</h1>
          <p className="text-text-muted mb-6">Please sign in to access admin panel.</p>
          <Link to="/login" className="bg-primary text-surface px-6 py-2.5 rounded-lg text-sm font-bold inline-block hover:opacity-90 transition-opacity">Sign In</Link>
        </main>
        <Footer />
      </>
    )
  }

  const totalProducts = 348
  const totalRevenue = orders.reduce((sum, o) => {
    const num = parseFloat(o.total?.replace(/[^0-9.,]/g, '').replace(/,/g, '')) || 0
    return sum + num
  }, 0)

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>admin_panel_settings</span>
          <h1 className="text-xl font-bold text-text-main">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-surface border border-border-light rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>people</span>
              <p className="text-xs text-text-muted">Users</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-text-main">{users.length}</p>
          </div>
          <div className="bg-surface border border-border-light rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>inventory_2</span>
              <p className="text-xs text-text-muted">Products</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-text-main">{totalProducts}</p>
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
            {['users', 'orders', 'products'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 text-xs font-bold py-3.5 transition-colors cursor-pointer capitalize ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-6">
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-text-muted border-b border-border-light">
                      <th className="text-left py-2 pr-3 font-semibold">Name</th>
                      <th className="text-left py-2 pr-3 font-semibold">Email</th>
                      <th className="text-left py-2 pr-3 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={3} className="py-8 text-center text-text-muted">No registered users</td></tr>
                    ) : (
                      users.map((u, i) => (
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
                          <td className="py-2.5">
                            <div className="flex gap-1">
                              {u.isAdmin && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Admin</span>}
                              {u.isSeller && !u.isAdmin && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Seller</span>}
                              {!u.isAdmin && !u.isSeller && <span className="text-[10px] bg-surface-container-high text-text-muted px-2 py-0.5 rounded-full font-bold">Buyer</span>}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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

            {activeTab === 'products' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categoryFiles.map((cat, i) => (
                    <div key={i} className="bg-surface-container-low rounded-xl p-3 md:p-4">
                      <p className="text-xs font-semibold text-text-main truncate">{cat.name}</p>
                      <p className="text-lg font-bold text-primary mt-1">{cat.json === 'templates.json' ? 38 : cat.json === 'aitools.json' ? 36 : cat.json === 'integrations.json' ? 34 : 30}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-surface-container-low rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-main">Total All Categories</span>
                  <span className="text-lg font-bold text-primary">{totalProducts}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
