import { useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SellerOverview({ products, orders, totalSales, totalEarnings, setActiveTab }) {
  const avgRating = products.length > 0
    ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1)
    : '—'

  const earningsData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const map = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      map[months[d.getMonth()]] = { month: months[d.getMonth()], earnings: 0 }
    }
    orders.forEach(o => {
      const num = parseFloat(o.total?.replace(/[^0-9.,]/g, '').replace(/,/g, '')) || 0
      const d = new Date(o.date)
      const key = months[d.getMonth()]
      if (map[key]) map[key].earnings += num
    })
    return Object.values(map).map(d => ({ ...d, earnings: Math.round(d.earnings) }))
  }, [orders])

  const salesData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const map = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      map[months[d.getMonth()]] = { month: months[d.getMonth()], sales: 0 }
    }
    orders.forEach(o => {
      const d = new Date(o.date)
      const key = months[d.getMonth()]
      if (map[key]) map[key].sales += o.items?.reduce((s, it) => s + (it.qty || 1), 0) || 0
    })
    return Object.values(map)
  }, [orders])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { value: products.length, label: 'Products Listed', icon: 'inventory_2' },
          { value: totalSales, label: 'Total Sales', icon: 'trending_up' },
          { value: `$${totalEarnings.toLocaleString('en-US')}`, label: 'Earnings', icon: 'payments' },
          { value: avgRating, label: 'Avg. Rating', icon: 'star' },
        ].map(stat => (
          <div key={stat.label} className="bg-surface border border-border-light rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: 18 }}>{stat.icon}</span>
              </div>
            </div>
            <p className="text-lg md:text-xl font-bold text-on-surface truncate">{stat.value}</p>
            <p className="text-[11px] text-text-muted/70 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border-light rounded-xl p-5">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Earnings (6 months)</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`$${value}`, 'Earnings']}
                />
                <Bar dataKey="earnings" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface border border-border-light rounded-xl p-5">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Sales Trend (6 months)</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border-light flex items-center justify-between">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Recent Products</h2>
            <button onClick={() => setActiveTab('products')}
              className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">View All</button>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-text-muted text-4xl mb-2 block">inventory_2</span>
              <p className="text-xs text-text-muted">No products yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-light/50">
              {products.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-surface-container-low transition-colors">
                  <div className="min-w-0 flex-1 flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/${p.seed || p.title}/40/40`} alt="" className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-text-main truncate">{p.title}</p>
                      <p className="text-[10px] text-text-muted mt-0.5 capitalize">{p.category} &middot; {p.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-xs font-bold text-text-main">{p.price}</p>
                    <p className="text-[10px] text-text-muted">{p.sales} sales</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border-light flex items-center justify-between">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">Recent Orders</h2>
            <button onClick={() => setActiveTab('orders')}
              className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">View All</button>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-text-muted text-4xl mb-2 block">receipt_long</span>
              <p className="text-xs text-text-muted">No orders yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-light/50">
              {orders.slice(0, 5).map((o, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-surface-container-low transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-text-main font-mono">{o.orderId}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{o.items?.length || 0} items &middot; {o.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-xs font-bold text-text-main">{o.total}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
