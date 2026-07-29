import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AvatarCropModal from '../components/AvatarCropModal'

export default function Profile() {
  const { currentUser, updatePicture } = useAuth()
  const fileRef = useRef(null)
  const [orders, setOrders] = useState([])
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [cropImage, setCropImage] = useState(null)

  useEffect(() => {
    if (!currentUser) return
    try {
      const saved = JSON.parse(localStorage.getItem('orders_' + currentUser.id) || '[]')
      setOrders(saved)
    } catch {}
  }, [currentUser])

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <main className="w-full max-w-[1440px] mx-auto px-6 py-16 text-center">
          <span className="material-symbols-outlined text-6xl text-text-muted mb-4" style={{ fontSize: 64 }}>account_circle</span>
          <h1 className="text-2xl font-bold text-text-main mb-2">Sign in required</h1>
          <p className="text-text-muted mb-6">Please sign in to view your profile.</p>
          <Link to="/login" className="bg-primary text-surface px-6 py-2.5 rounded-lg text-sm font-bold inline-block hover:opacity-90 transition-opacity">Sign In</Link>
        </main>
        <Footer />
      </>
    )
  }

  const totalOrders = orders.length
  const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + (i.qty || 1), 0), 0)
  const totalSpent = orders.reduce((sum, o) => {
    const num = parseFloat(o.total.replace(/[^0-9.,]/g, '').replace(/,/g, '')) || 0
    return sum + num
  }, 0)

  const handlePicture = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCropImage(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCropSave = (cropped) => {
    updatePicture(cropped)
    setCropImage(null)
  }

  const toggleOrder = (id) => {
    setExpandedOrder(prev => prev === id ? null : id)
  }

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-surface border border-border-light rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-5">
              <button onClick={() => fileRef.current?.click()} className="relative group w-20 h-20 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden cursor-pointer">
                {currentUser.picture ? (
                  <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary flex items-center justify-center w-full h-full">
                    {currentUser.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <span className="material-symbols-outlined text-surface text-lg">photo_camera</span>
                </div>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePicture} />
              <div>
                <h1 className="text-xl font-bold text-text-main">{currentUser.name}</h1>
                <p className="text-sm text-text-muted mt-0.5">{currentUser.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4">
            <div className="bg-surface border border-border-light rounded-xl p-4 md:p-5 text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">{totalOrders}</p>
              <p className="text-[11px] md:text-xs text-text-muted mt-1">Orders</p>
            </div>
            <div className="bg-surface border border-border-light rounded-xl p-4 md:p-5 text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">{totalItems}</p>
              <p className="text-[11px] md:text-xs text-text-muted mt-1">Items Purchased</p>
            </div>
            <div className="bg-surface border border-border-light rounded-xl p-4 md:p-5 text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">${totalSpent.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              <p className="text-[11px] md:text-xs text-text-muted mt-1">Total Spent</p>
            </div>
          </div>

          <div className="mt-6 bg-surface border border-border-light rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border-light">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>receipt_long</span>
                <h2 className="text-sm font-bold text-text-main">Order History</h2>
                {totalOrders > 0 && <span className="text-[11px] text-text-muted ml-auto">{totalOrders} order{totalOrders > 1 ? 's' : ''}</span>}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <span className="material-symbols-outlined text-5xl text-text-muted mb-3" style={{ fontSize: 48 }}>shopping_bag</span>
                <p className="text-sm text-text-muted">No orders yet</p>
                <Link to="/" className="text-primary text-xs font-bold mt-2 inline-block hover:underline">Start Shopping</Link>
              </div>
            ) : (
              <div className="divide-y divide-border-light">
                {orders.map((order, idx) => {
                  const isOpen = expandedOrder === idx
                  const itemCount = order.items.reduce((s, i) => s + (i.qty || 1), 0)
                  return (
                    <div key={idx}>
                      <button onClick={() => toggleOrder(idx)} className="w-full flex items-center gap-3 px-4 md:px-6 py-4 hover:bg-surface-container-low transition-colors text-left cursor-pointer">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-text-main">{order.orderId}</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold capitalize">{order.paymentMethod || 'qris'}</span>
                          </div>
                          <p className="text-[11px] text-text-muted mt-0.5">{order.date} &middot; {itemCount} item{itemCount > 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className="text-sm font-bold text-text-main">{order.total}</span>
                          <span className={`material-symbols-outlined text-text-muted transition-transform text-lg ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-4 md:px-6 pb-4">
                          <div className="bg-surface-container-low rounded-xl p-4 space-y-3">
                            {order.items.map((item, iidx) => {
                              const itemName = item.title || item.name
                              const itemTotal = item.price ? parseFloat(item.price.replace(/[^0-9.,]/g, '').replace(',', '.')) * (item.qty || 1) : 0
                              return (
                                <div key={iidx} className="flex items-center gap-3">
                                  <img src={`https://picsum.photos/seed/${item.seed}/48/48`} alt={itemName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
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
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      {cropImage && (
        <AvatarCropModal image={cropImage} onCancel={() => setCropImage(null)} onSave={handleCropSave} />
      )}
    </>
  )
}
