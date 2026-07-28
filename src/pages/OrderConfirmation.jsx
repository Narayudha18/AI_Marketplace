import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('lastOrder')
    if (saved) {
      try { setOrder(JSON.parse(saved)) } catch {}
    }
  }, [])

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[700px] mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="material-symbols-outlined text-green-500 text-7xl mb-4 block">check_circle</span>
          <h1 className="text-2xl font-bold text-text-main mb-2">Order Confirmed!</h1>
          <p className="text-sm text-text-muted">Thank you for your purchase. Your order has been received.</p>
        </div>

        {order && (
          <div className="bg-surface border border-border-light rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between pb-4 border-b border-border-light mb-4">
              <div>
                <p className="text-[11px] text-text-muted">Order ID</p>
                <p className="text-sm font-bold text-text-main">{order.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-text-muted">Date</p>
                <p className="text-sm font-semibold text-text-main">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Items Purchased</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => {
                const itemName = item.title || item.name
                return (
                  <div key={idx} className="flex items-center gap-3 bg-surface-container-low rounded-lg p-3">
                    <img src={`https://picsum.photos/seed/${item.seed}/60/60`} alt={itemName} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-main truncate">{itemName}</p>
                      <p className="text-[11px] text-text-muted capitalize">{item.category} x{item.qty}</p>
                    </div>
                    {item.price && <span className="text-xs font-bold text-text-main">{item.price}</span>}
                  </div>
                )
              })}
            </div>

            <div className="border-t border-border-light mt-4 pt-4 flex justify-between">
              <span className="text-sm font-bold text-text-main">Total Paid</span>
              <span className="text-lg font-bold text-text-main">{order.total}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/profile" className="bg-primary text-surface px-6 py-2.5 rounded-lg text-sm font-semibold text-center hover:opacity-90 transition-opacity">View My Purchases</Link>
          <Link to="/" className="border border-primary text-primary px-6 py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-primary hover:text-surface transition-all">Back to Home</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
