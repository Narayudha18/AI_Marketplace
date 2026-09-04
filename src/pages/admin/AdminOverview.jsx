import { useMemo } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminOverview({ users, orders, orderStatuses, pendingSellers, totalProducts, totalRevenue, setActiveTab, approveSeller, rejectSeller }) {
  const revenueData = useMemo(() => {
    const dayMap = {}
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = days[d.getDay()]
      dayMap[key] = { day: key, revenue: 0, orders: 0 }
    }
    orders.forEach(o => {
      const num = parseFloat(o.total?.replace(/[^0-9.,]/g, '').replace(/,/g, '')) || 0
      const d = new Date(o.date)
      const key = days[d.getDay()]
      if (dayMap[key]) {
        dayMap[key].revenue += num
        dayMap[key].orders += 1
      }
    })
    return Object.values(dayMap).map(d => ({ ...d, revenue: Math.round(d.revenue) }))
  }, [orders])

  const userGrowthData = useMemo(() => {
    const weekMap = {}
    for (let i = 7; i >= 0; i--) {
      weekMap[`W${8 - i}`] = { week: `W${8 - i}`, users: 0 }
    }
    users.forEach(u => {
      const created = new Date(u.id > 1e12 ? u.id : Date.now())
      const now = new Date()
      const weeksAgo = Math.floor((now - created) / (7 * 24 * 60 * 60 * 1000))
      if (weeksAgo < 8) {
        const key = `W${8 - weeksAgo}`
        if (weekMap[key]) weekMap[key].users += 1
      }
    })
    let cumulative = 0
    return Object.values(weekMap).map(w => {
      cumulative += w.users
      return { ...w, users: cumulative || Math.max(1, Math.floor(users.length * 0.1)) }
    })
  }, [users])

  const sellerApprovals = pendingSellers.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: 'people', color: 'blue' },
          { label: 'Total Products', value: totalProducts, icon: 'inventory_2', color: 'blue' },
          { label: 'Total Orders', value: orders.length, icon: 'receipt_long', color: 'amber' },
          { label: 'Revenue', value: `$${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, icon: 'payments', color: 'emerald' },
        ].map((card, i) => (
          <div key={i} className="bg-surface border border-border-light rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color === 'blue' ? 'bg-blue-500/10' : card.color === 'amber' ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                <span className={`material-symbols-outlined ${card.color === 'blue' ? 'text-blue-400' : card.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`} style={{ fontSize: 18 }}>{card.icon}</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl font-bold text-on-surface">{card.value}</p>
            <p className="text-[11px] text-text-muted/70 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border-light rounded-xl p-5">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Revenue (7 days)</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface border border-border-light rounded-xl p-5">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">User Growth (8 weeks)</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  )
}
