import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AvatarCropModal from '../components/AvatarCropModal'

const TABS = [
  { id: 'profile', label: 'My Profile', icon: 'person' },
  { id: 'orders', label: 'Orders', icon: 'receipt_long' },
  { id: 'addresses', label: 'Addresses', icon: 'home' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

export default function Profile() {
  const { currentUser, updateProfile, updatePassword, updatePicture, addAddress, removeAddress, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState([])
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [cropImage, setCropImage] = useState(null)
  const [toast, setToast] = useState(null)

  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', bio: '' })

  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', phone: '' })
  const [showAddressForm, setShowAddressForm] = useState(false)

  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' })
  const [passError, setPassError] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  useEffect(() => {
    if (!currentUser) return
    try {
      const saved = JSON.parse(localStorage.getItem('orders_' + currentUser.id) || '[]')
      setOrders(saved)
    } catch {}
    setEditForm({ name: currentUser.name || '', email: currentUser.email || '', bio: currentUser.bio || '' })
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

  const memberSince = currentUser.id
    ? new Date(Number.isFinite(currentUser.id) ? currentUser.id : Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Unknown'

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
    showToast('Profile picture updated')
  }

  const handleSaveProfile = () => {
    const updated = updateProfile({ name: editForm.name, email: editForm.email, bio: editForm.bio })
    if (updated) {
      setEditMode(false)
      showToast('Profile updated successfully')
    }
  }

  const handleChangePassword = () => {
    setPassError('')
    if (!passForm.current || !passForm.newPass) { setPassError('Please fill all fields'); return }
    if (passForm.newPass.length < 6) { setPassError('New password must be at least 6 characters'); return }
    if (passForm.newPass !== passForm.confirm) { setPassError('Passwords do not match'); return }
    const result = updatePassword(passForm.current, passForm.newPass)
    if (!result.ok) { setPassError(result.error); return }
    setPassForm({ current: '', newPass: '', confirm: '' })
    showToast('Password changed successfully')
  }

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.street || !newAddress.city) return
    addAddress(newAddress)
    setNewAddress({ label: '', street: '', city: '', phone: '' })
    setShowAddressForm(false)
    showToast('Address added')
  }

  const toggleOrder = (id) => setExpandedOrder(prev => prev === id ? null : id)

  const addresses = currentUser.addresses || []

  const sidebar = (
    <aside className="w-full md:w-56 lg:w-64 flex-shrink-0">
      <div className="md:sticky md:top-20">
        <div className="bg-surface border border-border-light rounded-xl p-4 md:p-5 mb-4">
          <div className="flex md:block items-center gap-3 md:text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden mx-auto">
              {currentUser.picture ? (
                <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl md:text-2xl font-bold text-primary flex items-center justify-center w-full h-full">
                  {currentUser.name?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="md:mt-2 min-w-0">
              <p className="text-sm font-bold text-text-main truncate">{currentUser.name}</p>
              <p className="text-[11px] text-text-muted truncate">{currentUser.email}</p>
              {currentUser.isAdmin && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">Admin</span>}
              {currentUser.isSeller && <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">Seller</span>}
            </div>
          </div>
        </div>

        <nav className="bg-surface border border-border-light rounded-xl overflow-hidden">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 md:px-5 py-3 text-left text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-surface'
                  : 'text-text-muted hover:text-text-main hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Mobile tab bar */}
        <div className="md:hidden flex gap-1 overflow-x-auto mb-4 pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id ? 'bg-primary text-surface' : 'bg-surface border border-border-light text-text-muted'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {sidebar}

          <div className="flex-1 min-w-0">
            {/* My Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <div className="bg-surface border border-border-light rounded-xl p-5 md:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-bold text-text-main">Profile Information</h2>
                    {!editMode ? (
                      <button onClick={() => setEditMode(true)} className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline cursor-pointer">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => { setEditMode(false); setEditForm({ name: currentUser.name || '', email: currentUser.email || '', bio: currentUser.bio || '' }) }}
                          className="text-xs text-text-muted hover:text-text-main font-semibold px-3 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">Cancel</button>
                        <button onClick={handleSaveProfile}
                          className="text-xs text-surface bg-primary px-3 py-1.5 rounded-lg font-bold hover:opacity-90 transition-opacity cursor-pointer">Save</button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <button onClick={() => fileRef.current?.click()} className="relative group w-20 h-20 rounded-full bg-primary/10 overflow-hidden cursor-pointer">
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
                      <span className="text-[10px] text-text-muted">Click to change</span>
                    </div>

                    <div className="flex-1 space-y-3 min-w-0">
                      {editMode ? (
                        <>
                          <div>
                            <label className="text-[11px] text-text-muted font-semibold block mb-1">Name</label>
                            <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                              className="w-full text-sm text-text-main bg-surface-container-low border border-border-light rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors" />
                          </div>
                          <div>
                            <label className="text-[11px] text-text-muted font-semibold block mb-1">Email</label>
                            <input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                              className="w-full text-sm text-text-main bg-surface-container-low border border-border-light rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors" />
                          </div>
                          <div>
                            <label className="text-[11px] text-text-muted font-semibold block mb-1">Bio</label>
                            <textarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} rows={3}
                              className="w-full text-sm text-text-main bg-surface-container-low border border-border-light rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors resize-none" placeholder="Write something about yourself..." />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <p className="text-[11px] text-text-muted font-semibold">Name</p>
                              <p className="text-sm text-text-main mt-0.5">{currentUser.name}</p>
                            </div>
                            <div>
                              <p className="text-[11px] text-text-muted font-semibold">Email</p>
                              <p className="text-sm text-text-main mt-0.5">{currentUser.email}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] text-text-muted font-semibold">Bio</p>
                            <p className="text-sm text-text-main mt-0.5">{currentUser.bio || 'No bio yet.'}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-text-muted font-semibold">Member Since</p>
                            <p className="text-sm text-text-main mt-0.5">{memberSince}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-surface border border-border-light rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{totalOrders}</p>
                    <p className="text-[11px] text-text-muted mt-1">Orders</p>
                  </div>
                  <div className="bg-surface border border-border-light rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{totalItems}</p>
                    <p className="text-[11px] text-text-muted mt-1">Purchased</p>
                  </div>
                  <div className="bg-surface border border-border-light rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-primary">${totalSpent.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    <p className="text-[11px] text-text-muted mt-1">Total Spent</p>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
                <div className="px-5 md:px-6 py-4 border-b border-border-light flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>receipt_long</span>
                    <h2 className="text-sm font-bold text-text-main">Order History</h2>
                  </div>
                  {totalOrders > 0 && <span className="text-[11px] text-text-muted">{totalOrders} order{totalOrders > 1 ? 's' : ''}</span>}
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
                          <button onClick={() => toggleOrder(idx)}
                            className="w-full flex items-center gap-3 px-4 md:px-6 py-4 hover:bg-surface-container-low transition-colors text-left cursor-pointer">
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
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
                <div className="px-5 md:px-6 py-4 border-b border-border-light flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>home</span>
                    <h2 className="text-sm font-bold text-text-main">Saved Addresses</h2>
                  </div>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)}
                      className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline cursor-pointer">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> Add
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <div className="px-5 md:px-6 py-4 border-b border-border-light bg-surface-container-low/50">
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-text-muted font-semibold block mb-1">Label</label>
                          <input value={newAddress.label} onChange={e => setNewAddress(a => ({ ...a, label: e.target.value }))} placeholder="Home, Office, etc."
                            className="w-full text-sm bg-surface border border-border-light rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors" />
                        </div>
                        <div>
                          <label className="text-[11px] text-text-muted font-semibold block mb-1">Phone</label>
                          <input value={newAddress.phone} onChange={e => setNewAddress(a => ({ ...a, phone: e.target.value }))} placeholder="Phone number"
                            className="w-full text-sm bg-surface border border-border-light rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] text-text-muted font-semibold block mb-1">Street Address</label>
                        <input value={newAddress.street} onChange={e => setNewAddress(a => ({ ...a, street: e.target.value }))} placeholder="Street, building, etc."
                          className="w-full text-sm bg-surface border border-border-light rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="text-[11px] text-text-muted font-semibold block mb-1">City</label>
                        <input value={newAddress.city} onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} placeholder="City"
                          className="w-full text-sm bg-surface border border-border-light rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors" />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => { setShowAddressForm(false); setNewAddress({ label: '', street: '', city: '', phone: '' }) }}
                          className="text-xs text-text-muted hover:text-text-main font-semibold px-4 py-2 rounded-lg hover:bg-surface transition-colors cursor-pointer">Cancel</button>
                        <button onClick={handleAddAddress}
                          className="text-xs text-surface bg-primary px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity cursor-pointer">Save Address</button>
                      </div>
                    </div>
                  </div>
                )}

                {addresses.length === 0 && !showAddressForm ? (
                  <div className="py-12 text-center">
                    <span className="material-symbols-outlined text-5xl text-text-muted mb-3" style={{ fontSize: 48 }}>location_off</span>
                    <p className="text-sm text-text-muted">No addresses saved yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border-light">
                    {addresses.map(addr => (
                      <div key={addr.id} className="px-5 md:px-6 py-4 flex items-start gap-3 hover:bg-surface-container-low/50 transition-colors">
                        <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: 20 }}>{addr.label?.toLowerCase() === 'home' ? 'home' : addr.label?.toLowerCase() === 'office' ? 'business' : 'location_on'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-text-main">{addr.label}</p>
                          <p className="text-[11px] text-text-muted">{addr.street}</p>
                          <p className="text-[11px] text-text-muted">{addr.city}{addr.phone ? ` \u00b7 ${addr.phone}` : ''}</p>
                        </div>
                        <button onClick={() => { removeAddress(addr.id); showToast('Address removed') }}
                          className="text-text-muted hover:text-red-500 transition-colors cursor-pointer p-1">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-5">
                <div className="bg-surface border border-border-light rounded-xl p-5 md:p-6">
                  <h2 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>lock</span>
                    Change Password
                  </h2>
                  <div className="space-y-3 max-w-md">
                    <div>
                      <label className="text-[11px] text-text-muted font-semibold block mb-1">Current Password</label>
                      <input type="password" value={passForm.current} onChange={e => setPassForm(f => ({ ...f, current: e.target.value }))}
                        className="w-full text-sm bg-surface-container-low border border-border-light rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted font-semibold block mb-1">New Password</label>
                      <input type="password" value={passForm.newPass} onChange={e => setPassForm(f => ({ ...f, newPass: e.target.value }))}
                        className="w-full text-sm bg-surface-container-low border border-border-light rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted font-semibold block mb-1">Confirm New Password</label>
                      <input type="password" value={passForm.confirm} onChange={e => setPassForm(f => ({ ...f, confirm: e.target.value }))}
                        className="w-full text-sm bg-surface-container-low border border-border-light rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors" />
                    </div>
                    {passError && <p className="text-xs text-red-500">{passError}</p>}
                    <button onClick={handleChangePassword}
                      className="text-xs text-surface bg-primary px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity cursor-pointer">Update Password</button>
                  </div>
                </div>

                <div className="bg-surface border border-border-light rounded-xl p-5 md:p-6">
                  <h2 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>palette</span>
                    Appearance
                  </h2>
                  <div className="flex items-center justify-between max-w-md">
                    <div>
                      <p className="text-sm text-text-main">Dark Mode</p>
                      <p className="text-[11px] text-text-muted">{dark ? 'Dark theme is active' : 'Light theme is active'}</p>
                    </div>
                    <button onClick={toggle}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${dark ? 'bg-primary' : 'bg-border-light'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-surface rounded-full shadow transition-transform ${dark ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="bg-surface border border-border-light rounded-xl p-5 md:p-6">
                  <h2 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-400" style={{ fontSize: 20 }}>logout</span>
                    Account
                  </h2>
                  <p className="text-xs text-text-muted mb-3">Sign out of your account on this device.</p>
                  <button onClick={() => { logout(); navigate('/') }}
                    className="text-xs text-red-500 border border-red-200 px-5 py-2 rounded-lg font-bold hover:bg-red-50 transition-colors cursor-pointer">Sign Out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {cropImage && (
        <AvatarCropModal image={cropImage} onCancel={() => setCropImage(null)} onSave={handleCropSave} />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-text-main text-surface text-xs font-semibold px-5 py-3 rounded-xl shadow-lg animate-fade-in-up">
          {toast}
        </div>
      )}
    </>
  )
}
