import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import PaymentModal from './PaymentModal'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, clearCart, markAsPurchased } = useCart()
  const [paymentOpen, setPaymentOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item.price?.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
    return sum + price
  }, 0)
  const formattedTotal = `Rp${totalPrice.toLocaleString('id-ID')}`

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-surface z-50 shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <h2 className="text-sm font-semibold text-text-main">Keranjang ({cart.length})</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-container-low rounded transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-130px)] px-6 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-text-muted text-5xl mb-4 block">shopping_cart</span>
              <p className="text-sm text-text-muted">Keranjang kosong</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => {
                const itemName = item.title || item.name
                const slug = toSlug(itemName)
                return (
                  <div key={`${item.category}-${item.slug}`} className="flex gap-3 bg-surface-container-low rounded-lg p-3">
                    <Link to={`/${item.category}/${slug}`} onClick={onClose} className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
                      <img src={`https://picsum.photos/seed/${item.seed}/100/100`} alt={itemName} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/${item.category}/${slug}`} onClick={onClose} className="text-xs font-semibold text-text-main hover:text-primary transition-colors line-clamp-1">
                        {itemName}
                      </Link>
                      {'price' in item && <p className="text-xs font-semibold text-text-main mt-1">{item.price}</p>}
                      <p className="text-[11px] text-text-muted mt-0.5 capitalize">{item.category}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.slug, item.category)} className="self-start p-1 hover:bg-surface rounded transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 16 }}>delete</span>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-border-light p-6 bg-surface">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs text-text-muted">Total</span>
              <span className="text-sm font-bold text-text-main">{formattedTotal}</span>
            </div>
            <button onClick={() => setPaymentOpen(true)}
              className="w-full bg-primary text-surface py-3 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
              Checkout ({cart.length})
            </button>
          </div>
        )}
      </div>
      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} total={formattedTotal} cart={cart} onSuccess={() => { cart.forEach(item => markAsPurchased(item.slug, item.category)); clearCart(); onClose(); setPaymentOpen(false) }} />
    </>
  )
}
