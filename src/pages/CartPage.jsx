import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext'
import { useAuth } from '../AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PaymentModal from '../components/PaymentModal'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart, markAsPurchased } = useCart()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selected, setSelected] = useState(() => new Set(cart.map(i => `${i.category}-${i.slug}`)))

  const parsePrice = (price) => {
    if (!price) return 0
    return parseFloat(price.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
  }

  const toggleItem = (key) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleAll = () => {
    setSelected(prev => prev.size === cart.length ? new Set() : new Set(cart.map(i => `${i.category}-${i.slug}`)))
  }

  const selectedItems = cart.filter(i => selected.has(`${i.category}-${i.slug}`))
  const selectedQty = selectedItems.reduce((s, i) => s + i.qty, 0)
  const selectedSubtotal = selectedItems.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0)
  const formattedSelected = `$${selectedSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const handlePaymentSuccess = (method) => {
    if (!currentUser) return
    selectedItems.forEach(item => markAsPurchased(item.slug, item.category))
    const orderData = {
      items: selectedItems,
      total: formattedSelected,
      date: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` })(),
      orderId: 'ORD-' + Date.now().toString(36).toUpperCase(),
      paymentMethod: method,
      userId: currentUser.id,
    }
    const uid = currentUser.id
    localStorage.setItem('lastOrder_' + uid, JSON.stringify(orderData))
    const existingOrders = JSON.parse(localStorage.getItem('orders_' + uid) || '[]')
    localStorage.setItem('orders_' + uid, JSON.stringify([orderData, ...existingOrders]))
    selectedItems.forEach(item => removeFromCart(item.slug, item.category))
    setPaymentOpen(false)
    navigate('/order-confirmation')
  }

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main transition-colors cursor-pointer mb-6">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Kembali ke Halaman Produk
        </button>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Shopping Cart</h1>
            <p className="text-sm text-text-muted mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart}
              className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1.5 cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete_sweep</span>
              Clear All
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-text-muted text-6xl mb-4 block">shopping_cart</span>
            <h2 className="text-lg font-semibold text-text-main mb-2">Your cart is empty</h2>
            <p className="text-sm text-text-muted mb-6">Looks like you have not added any products yet.</p>
            <Link to="/templates" className="bg-primary text-surface px-6 py-2.5 rounded-lg text-sm font-semibold inline-block hover:opacity-90 transition-opacity">Browse Products</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-3">
              <button onClick={toggleAll}
                className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-main transition-colors cursor-pointer mb-3">
                <span className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${selected.size === cart.length ? 'bg-primary border-primary' : 'border-border-strong'}`}>
                  {selected.size === cart.length && <span className="material-symbols-outlined text-surface" style={{ fontSize: 12 }}>check</span>}
                </span>
                Select All ({selected.size}/{cart.length} selected)
              </button>
              {cart.map(item => {
                const itemName = item.title || item.name
                const slug = toSlug(itemName)
                const price = parsePrice(item.price)
                const itemKey = `${item.category}-${item.slug}`
                const isSelected = selected.has(itemKey)
                return (
                  <div key={itemKey} className={`bg-surface border rounded-xl p-4 flex gap-4 transition-colors ${isSelected ? 'border-primary/40' : 'border-border-light'}`}>
                    <button onClick={() => toggleItem(itemKey)}
                      className={`self-center w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${isSelected ? 'bg-primary border-primary' : 'border-border-strong hover:border-primary'}`}>
                      {isSelected && <span className="material-symbols-outlined text-surface" style={{ fontSize: 14 }}>check</span>}
                    </button>
                    <Link to={`/${item.category}/${slug}`} className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-low">
                      <img src={`https://picsum.photos/seed/${item.seed}/150/150`} alt={itemName} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/${item.category}/${slug}`} className="text-sm font-semibold text-text-main hover:text-primary transition-colors line-clamp-1">{itemName}</Link>
                      <p className="text-[11px] text-text-muted mt-0.5 capitalize">{item.category}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-border-light rounded-lg">
                          <button onClick={() => updateQty(item.slug, item.category, item.qty - 1)}
                            className="px-2.5 py-1.5 text-text-muted hover:text-text-main hover:bg-surface-container-low transition-colors cursor-pointer text-sm">-</button>
                          <span className="px-3 py-1.5 text-xs font-semibold text-text-main border-x border-border-light min-w-[32px] text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.slug, item.category, item.qty + 1)}
                            className="px-2.5 py-1.5 text-text-muted hover:text-text-main hover:bg-surface-container-low transition-colors cursor-pointer text-sm">+</button>
                        </div>
                        <span className="text-sm font-bold text-text-main">${(price * item.qty).toLocaleString('en-US')}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.slug, item.category)}
                      className="self-start p-1.5 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 18 }}>close</span>
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="w-full lg:w-80">
              <div className="bg-surface border border-border-light rounded-xl p-6 sticky top-24">
                <h3 className="text-sm font-bold text-text-main mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subtotal ({selectedQty} selected item{selectedQty !== 1 ? 's' : ''})</span>
                    <span className="font-semibold text-text-main">{formattedSelected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Service Fee</span>
                    <span className="font-semibold text-text-main">$0.00</span>
                  </div>
                  <div className="border-t border-border-light pt-3 flex justify-between">
                    <span className="font-bold text-text-main">Total</span>
                    <span className="font-bold text-lg text-text-main">{formattedSelected}</span>
                  </div>
                </div>
                <button onClick={() => setPaymentOpen(true)} disabled={selectedItems.length === 0}
                  className={`w-full bg-primary text-surface py-3 rounded-lg text-sm font-semibold mt-6 transition-opacity ${selectedItems.length === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`}>
                  Proceed to Checkout
                </button>
                {selectedItems.length === 0 && (
                  <p className="text-[11px] text-red-500 text-center mt-2">Pilih minimal satu produk untuk checkout</p>
                )}
                <Link to="/templates" className="block text-center text-xs text-text-muted hover:text-primary mt-3 transition-colors">Continue Shopping</Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} total={formattedSelected} cart={selectedItems} onSuccess={handlePaymentSuccess} />
    </>
  )
}
