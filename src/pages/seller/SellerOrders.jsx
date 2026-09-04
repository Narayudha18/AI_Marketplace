import { useState, useEffect } from 'react'

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled']
const STATUS_COLORS = {
  Processing: 'bg-amber-500/10 text-amber-400',
  Shipped: 'bg-blue-500/10 text-blue-400',
  Delivered: 'bg-emerald-500/10 text-emerald-400',
  Cancelled: 'bg-red-500/10 text-red-400',
}

export default function SellerOrders({ orders }) {
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [statuses, setStatuses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('order_statuses') || '{}') } catch { return {} }
  })

  useEffect(() => {
    try { localStorage.setItem('order_statuses', JSON.stringify(statuses)) } catch {}
  }, [statuses])

  const updateStatus = (orderId, status) => {
    setStatuses(prev => ({ ...prev, [orderId]: status }))
  }

  return (
    <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border-light">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">All Orders ({orders.length})</h2>
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-text-muted text-4xl mb-3 block">receipt_long</span>
          <p className="text-xs text-text-muted">No orders received yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-light bg-surface-container-low/50">
                <th className="text-left px-5 py-3 font-semibold text-text-muted">Order ID</th>
                <th className="text-left px-5 py-3 font-semibold text-text-muted">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-text-muted">Payment</th>
                <th className="text-left px-5 py-3 font-semibold text-text-muted">Items</th>
                <th className="text-left px-5 py-3 font-semibold text-text-muted">Date</th>
                <th className="text-right px-5 py-3 font-semibold text-text-muted">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => {
                const isOpen = expandedOrder === i
                const status = statuses[o.orderId] || 'Processing'
                return (
                  <tr key={i}>
                    <td className="border-b border-border-light/50 hover:bg-surface-container-low transition-colors cursor-pointer px-5 py-3.5 font-mono font-bold text-text-main text-[11px]" colSpan={isOpen ? 1 : 6} onClick={() => setExpandedOrder(isOpen ? null : i)}>
                      {o.orderId}
                    </td>
                    {!isOpen && <>
                      <td className="border-b border-border-light/50 px-5 py-3.5">
                        <select value={status} onChange={e => { e.stopPropagation(); updateStatus(o.orderId, e.target.value) }}
                          onClick={e => e.stopPropagation()}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[status] || STATUS_COLORS.Processing}`}>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="border-b border-border-light/50 px-5 py-3.5">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize">{o.paymentMethod || 'qris'}</span>
                      </td>
                      <td className="border-b border-border-light/50 px-5 py-3.5 text-text-muted">{o.items?.reduce((s, it) => s + (it.qty || 1), 0) || 0} items</td>
                      <td className="border-b border-border-light/50 px-5 py-3.5 text-text-muted">{o.date}</td>
                      <td className="border-b border-border-light/50 px-5 py-3.5 text-right font-bold text-text-main">{o.total}</td>
                    </>}
                    {isOpen && (
                      <td colSpan={5} className="border-b border-border-light/50 px-5 py-4">
                        <div className="bg-surface-container-low rounded-xl p-4 space-y-2.5 max-w-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-text-main font-mono">{o.orderId}</span>
                            <span className="text-[10px] text-text-muted">{o.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-text-muted">Status:</span>
                            <select value={status} onChange={e => updateStatus(o.orderId, e.target.value)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[status] || STATUS_COLORS.Processing}`}>
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          {o.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <img src={`https://picsum.photos/seed/${item.seed}/40/40`} alt="" className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-text-main truncate">{item.title || item.name}</p>
                                <p className="text-[10px] text-text-muted">Qty: {item.qty || 1}</p>
                              </div>
                              <p className="text-xs font-bold text-text-main">{item.price}</p>
                            </div>
                          ))}
                          <div className="border-t border-border-light pt-2.5 mt-2.5 flex items-center justify-between">
                            <span className="text-[10px] text-text-muted">Shipping to: {o.address || o.shippingAddress || '—'}</span>
                            <span className="text-xs font-bold text-text-main">Total: {o.total}</span>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
