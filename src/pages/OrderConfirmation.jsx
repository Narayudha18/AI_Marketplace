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

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderId)
    }
  }

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[700px] mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-600" style={{ fontSize: 36 }}>check_circle</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-1">Payment Successful!</h1>
          <p className="text-sm text-text-muted">Your order has been received and is being processed.</p>
        </div>

        {order && (
          <div className="bg-surface border border-border-light rounded-xl overflow-hidden mb-8">
            <div className="bg-primary-container/5 px-6 py-5 border-b border-border-light">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-text-muted mb-1">Order Status</p>
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Completed
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-text-muted mb-1">Order ID</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-text-main font-mono tracking-wider">{order.orderId}</span>
                    <button onClick={copyOrderId} className="text-primary hover:text-primary-container transition-colors cursor-pointer">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-b border-border-light">
              <div className="bg-surface-container-low rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-text-muted">Date</span>
                  <span className="text-xs font-semibold text-text-main">{order.date}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-text-muted">Payment Method</span>
                  <span className="text-xs font-semibold text-text-main capitalize">{(order.paymentMethod || 'qris').replace(/-/g, ' ')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">Email</span>
                  <span className="text-xs font-semibold text-text-main">buyer@example.com</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-b border-border-light">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Items Purchased</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => {
                  const itemName = item.title || item.name
                  const itemTotal = item.price ? parseFloat(item.price.replace(/[^0-9.,]/g, '').replace(',', '.')) * (item.qty || 1) : 0
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={`https://picsum.photos/seed/${item.seed}/60/60`} alt={itemName} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-main truncate">{itemName}</p>
                        <p className="text-[11px] text-text-muted">Qty: {item.qty || 1}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-text-main">{item.price}</p>
                        {item.qty > 1 && <p className="text-[10px] text-text-muted">${itemTotal.toFixed(2)}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-semibold text-text-main">{order.total}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Service Fee</span>
                  <span className="font-semibold text-text-main">$0.00</span>
                </div>
                <div className="border-t border-border-light pt-2 mt-2 flex justify-between">
                  <span className="text-sm font-bold text-text-main">Total Paid</span>
                  <span className="text-lg font-bold text-primary">{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/profile" className="bg-primary text-surface px-6 py-2.5 rounded-lg text-sm font-semibold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
            View My Purchases
          </Link>
          <Link to="/" className="border border-primary text-primary px-6 py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-primary hover:text-surface transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>home</span>
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
