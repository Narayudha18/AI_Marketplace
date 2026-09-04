import { useState } from 'react'

export default function AdminOrders({ orders, orderStatuses, updateOrderStatus }) {
  const [expandedOrder, setExpandedOrder] = useState(null)

  return (
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
                  <tr key={i}>
                    <td className="border-t border-border-light hover:bg-surface-container-low transition-colors cursor-pointer py-3.5 px-5 font-mono font-bold text-text-main text-[11px]" colSpan={isOpen ? 1 : 6} onClick={() => setExpandedOrder(isOpen ? null : i)}>
                      {o.orderId}
                    </td>
                    {!isOpen && <>
                      <td className="border-t border-border-light py-3.5 px-5"><span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize">{o.paymentMethod || 'qris'}</span></td>
                      <td className="border-t border-border-light py-3.5 px-5 text-text-muted">{o.items?.reduce((s, it) => s + (it.qty || 1), 0) || 0} items</td>
                      <td className="border-t border-border-light py-3.5 px-5">
                        <select value={status} onChange={e => updateOrderStatus(o.orderId, e.target.value)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-0 outline-none cursor-pointer ${statusColors[status] || 'bg-surface-container text-text-muted'}`}>
                          <option value="completed">Completed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="border-t border-border-light py-3.5 px-5 text-text-muted">{o.date}</td>
                      <td className="border-t border-border-light py-3.5 px-5 text-right font-bold text-text-main">{o.total}</td>
                    </>}
                    {isOpen && (
                      <td colSpan={5} className="border-t border-border-light py-4 px-5">
                        <div className="bg-surface-container-low rounded-xl p-4 space-y-2.5 max-w-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-text-main font-mono">{o.orderId}</span>
                            <select value={status} onChange={e => updateOrderStatus(o.orderId, e.target.value)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-0 outline-none cursor-pointer ${statusColors[status] || 'bg-surface-container text-text-muted'}`}>
                              <option value="completed">Completed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                          <p className="text-[10px] text-text-muted/70">{o.date} · {o.paymentMethod || 'qris'}</p>
                          {o.items?.map((item, idx) => {
                            const itemName = item.title || item.name
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
                          <div className="pt-2 border-t border-border-light flex justify-between">
                            <span className="text-xs font-bold text-text-muted">Total</span>
                            <span className="text-xs font-bold text-text-main">{o.total}</span>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
