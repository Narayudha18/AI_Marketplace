import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import AvatarCropModal from '../components/AvatarCropModal'

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'space_dashboard' },
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'orders', label: 'Orders', icon: 'receipt_long' },
  { id: 'addresses', label: 'Addresses', icon: 'home' },
  { id: 'settings', label: 'Settings', icon: 'tune' },
]

export default function Profile() {
  const { currentUser, updateProfile, updatePassword, updatePicture, addAddress, removeAddress, trackActivity, getUserActivities, updateNotifPrefs, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [cropImage, setCropImage] = useState(null)
  const [toast, setToast] = useState(null)

  const [editForm, setEditForm] = useState({ name: '', email: '', bio: '' })
  const [saving, setSaving] = useState(false)

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
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-container to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-surface text-4xl">account_circle</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-2">Welcome Back</h1>
          <p className="text-text-muted text-sm mb-8">Sign in to access your dashboard</p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-container to-blue-600 text-surface px-8 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const activities = getUserActivities()
  const totalOrders = orders.length
  const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + (i.qty || 1), 0), 0)
  const totalSpent = orders.reduce((sum, o) => {
    const num = parseFloat(o.total.replace(/[^0-9.,]/g, '').replace(/,/g, '')) || 0
    return sum + num
  }, 0)

  const memberSince = currentUser.id
    ? new Date(Number.isFinite(currentUser.id) ? currentUser.id : Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Unknown'

  const notifPrefs = currentUser.notificationPrefs || { orders: true, promotions: true, updates: false }

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
    trackActivity('picture', 'Updated profile picture')
    setCropImage(null)
    showToast('Profile picture updated')
  }

  const handleSaveProfile = () => {
    setSaving(true)
    const updated = updateProfile({ name: editForm.name, email: editForm.email, bio: editForm.bio })
    if (updated) {
      trackActivity('profile', 'Updated profile information')
      showToast('Profile updated')
    }
    setTimeout(() => setSaving(false), 400)
  }

  const handleChangePassword = () => {
    setPassError('')
    if (!passForm.current || !passForm.newPass) { setPassError('Fill all fields'); return }
    if (passForm.newPass.length < 6) { setPassError('Min 6 characters'); return }
    if (passForm.newPass !== passForm.confirm) { setPassError('Passwords do not match'); return }
    const result = updatePassword(passForm.current, passForm.newPass)
    if (!result.ok) { setPassError(result.error); return }
    trackActivity('password', 'Changed account password')
    setPassForm({ current: '', newPass: '', confirm: '' })
    showToast('Password changed')
  }

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.street || !newAddress.city) return
    addAddress(newAddress)
    trackActivity('address', `Added address: ${newAddress.label}`)
    setNewAddress({ label: '', street: '', city: '', phone: '' })
    setShowAddressForm(false)
    showToast('Address added')
  }

  const handleRemoveAddress = (addr) => {
    removeAddress(addr.id)
    trackActivity('address', `Removed address: ${addr.label}`)
    showToast('Address removed')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleOrder = (id) => setExpandedOrder(prev => prev === id ? null : id)

  const addresses = currentUser.addresses || []

  const activityIcons = {
    picture: 'photo_camera',
    profile: 'edit',
    password: 'lock',
    address: 'home',
    order: 'shopping_bag',
    review: 'star',
    favorite: 'favorite',
  }

  const sidebar = (
    <aside className="w-full md:w-60 lg:w-72 flex-shrink-0">
      <div className="md:sticky md:top-6 space-y-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-container via-primary-container/90 to-blue-600 p-5 md:p-6 text-surface shadow-lg shadow-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/20 flex-shrink-0 overflow-hidden backdrop-blur-sm ring-2 ring-white/30">
              {currentUser.picture ? (
                <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl md:text-3xl font-bold flex items-center justify-center w-full h-full">
                  {currentUser.name?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm md:text-base font-bold truncate">{currentUser.name}</p>
              <p className="text-[11px] md:text-xs text-white/80 truncate">{currentUser.email}</p>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {currentUser.isAdmin && <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-md font-bold backdrop-blur-sm">Admin</span>}
                {currentUser.isSeller && <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-md font-bold backdrop-blur-sm">Seller</span>}
              </div>
            </div>
          </div>
        </div>

        <nav className="bg-surface/80 backdrop-blur-xl border border-border-light/60 rounded-2xl overflow-hidden shadow-sm">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-left text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-surface shadow-sm'
                  : 'text-text-muted hover:text-text-main hover:bg-surface-container-low/50'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-left text-xs font-semibold text-red-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-2xl transition-all cursor-pointer border border-border-light/60 bg-surface/80 backdrop-blur-xl">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-container to-blue-600 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-surface text-sm">apps</span>
              </div>
            </Link>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-text-main">Dashboard</h1>
              <p className="text-[11px] md:text-xs text-text-muted">Welcome back, {currentUser.name.split(' ')[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted hover:text-text-main bg-surface/80 backdrop-blur-xl border border-border-light/60 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer hover:shadow-sm">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
              Back to Store
            </button>
            <button onClick={toggle}
              className="flex items-center justify-center w-9 h-9 rounded-xl text-text-muted hover:text-text-main bg-surface/80 backdrop-blur-xl border border-border-light/60 transition-all cursor-pointer hover:shadow-sm">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </div>

        <div className="md:hidden flex gap-1.5 overflow-x-auto mb-5 pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-surface shadow-sm'
                  : 'bg-surface/80 backdrop-blur-xl border border-border-light/60 text-text-muted hover:text-text-main'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {sidebar}

          <div className="flex-1 min-w-0 space-y-5">

            {/* Overview */}
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-container/10 to-primary-container/5 border border-primary-container/20 p-5 group hover:shadow-md hover:shadow-primary/5 transition-all">
                    <div className="absolute top-3 right-3 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary-container/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 22 }}>shopping_bag</span>
                    </div>
                    <p className="text-3xl font-bold text-text-main">{totalOrders}</p>
                    <p className="text-xs text-text-muted mt-1">Total Orders</p>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-5 group hover:shadow-md hover:shadow-blue-500/5 transition-all">
                    <div className="absolute top-3 right-3 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-500" style={{ fontSize: 22 }}>inventory_2</span>
                    </div>
                    <p className="text-3xl font-bold text-text-main">{totalItems}</p>
                    <p className="text-xs text-text-muted mt-1">Items Purchased</p>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-5 group hover:shadow-md hover:shadow-emerald-500/5 transition-all">
                    <div className="absolute top-3 right-3 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-500" style={{ fontSize: 22 }}>payments</span>
                    </div>
                    <p className="text-3xl font-bold text-text-main">${totalSpent.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    <p className="text-xs text-text-muted mt-1">Total Spent</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-surface/80 backdrop-blur-xl border border-border-light/60 overflow-hidden shadow-sm">
                  <div className="px-5 md:px-6 py-4 border-b border-border-light/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary-container/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>history</span>
                      </div>
                      <h2 className="text-sm font-bold text-text-main">Recent Activity</h2>
                    </div>
                    {activities.length > 0 && <span className="text-[11px] text-text-muted">{activities.length} entries</span>}
                  </div>
                  {activities.length === 0 ? (
                    <div className="py-14 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-surface-container-low/50 flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-text-muted text-3xl">timeline</span>
                      </div>
                      <p className="text-sm text-text-muted">No recent activity</p>
                      <p className="text-[11px] text-text-muted/70 mt-1">Your actions will appear here</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border-light/40">
                      {activities.map(a => {
                        const icon = activityIcons[a.action] || 'circle'
                        const timeAgo = getTimeAgo(a.time)
                        return (
                          <div key={a.id} className="px-5 md:px-6 py-3.5 flex items-center gap-3.5 hover:bg-surface-container-low/30 transition-colors">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary-container/10 flex items-center justify-center flex-shrink-0">
                              <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 16 }}>{icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-text-main capitalize">{a.action.replace(/_/g, ' ')}</p>
                              <p className="text-[11px] text-text-muted truncate">{a.detail}</p>
                            </div>
                            <span className="text-[10px] text-text-muted/60 flex-shrink-0">{timeAgo}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="rounded-2xl bg-surface/80 backdrop-blur-xl border border-border-light/60 overflow-hidden shadow-sm">
                <div className="px-5 md:px-6 py-4 border-b border-border-light/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary-container/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>person</span>
                    </div>
                    <h2 className="text-sm font-bold text-text-main">Personal Information</h2>
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                    <div className="flex flex-col items-center gap-3 flex-shrink-0">
                      <button onClick={() => fileRef.current?.click()}
                        className="relative group w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-container/20 to-primary-container/5 overflow-hidden cursor-pointer ring-2 ring-border-light/60 hover:ring-primary-container/40 transition-all">
                        {currentUser.picture ? (
                          <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl font-bold text-primary-container flex items-center justify-center w-full h-full">
                            {currentUser.name?.[0]?.toUpperCase() || 'U'}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-2xl backdrop-blur-[2px]">
                          <div className="flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-surface text-xl">photo_camera</span>
                            <span className="text-[10px] text-surface font-semibold">Change</span>
                          </div>
                        </div>
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePicture} />
                      <span className="text-[10px] text-text-muted/70">JPG, PNG, GIF</span>
                    </div>

                    <div className="flex-1 space-y-4 min-w-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] text-text-muted font-semibold block mb-1.5">Full Name</label>
                          <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full text-sm text-text-main bg-surface-container-low/70 border border-border-light/60 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all" />
                        </div>
                        <div>
                          <label className="text-[11px] text-text-muted font-semibold block mb-1.5">Email Address</label>
                          <input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                            className="w-full text-sm text-text-main bg-surface-container-low/70 border border-border-light/60 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] text-text-muted font-semibold block mb-1.5">Bio</label>
                        <textarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} rows={3}
                          className="w-full text-sm text-text-main bg-surface-container-low/70 border border-border-light/60 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all resize-none" placeholder="Tell the world about yourself..." />
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-text-muted">
                        <span className="material-symbols-outlined text-xs">calendar_month</span>
                        Member since {memberSince}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={handleSaveProfile} disabled={saving}
                          className="flex items-center gap-1.5 text-xs text-surface bg-gradient-to-r from-primary-container to-blue-600 px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer">
                          {saving ? (
                            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>
                          ) : (
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                          )}
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="rounded-2xl bg-surface/80 backdrop-blur-xl border border-border-light/60 overflow-hidden shadow-sm">
                <div className="px-5 md:px-6 py-4 border-b border-border-light/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary-container/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>receipt_long</span>
                    </div>
                    <h2 className="text-sm font-bold text-text-main">Order History</h2>
                  </div>
                  {totalOrders > 0 && (
                    <span className="text-[11px] bg-primary-container/10 text-primary-container px-2.5 py-1 rounded-lg font-semibold">{totalOrders} order{totalOrders > 1 ? 's' : ''}</span>
                  )}
                </div>
                {orders.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-low/50 flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-text-muted text-3xl">shopping_bag</span>
                    </div>
                    <p className="text-sm text-text-muted mb-1">No orders yet</p>
                    <p className="text-xs text-text-muted/70 mb-5">Start exploring our marketplace</p>
                    <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-surface bg-gradient-to-r from-primary-container to-blue-600 px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>explore</span>
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-border-light/40">
                    {orders.map((order, idx) => {
                      const isOpen = expandedOrder === idx
                      const itemCount = order.items.reduce((s, i) => s + (i.qty || 1), 0)
                      return (
                        <div key={idx}>
                          <button onClick={() => toggleOrder(idx)}
                            className="w-full flex items-center gap-3 px-5 md:px-6 py-4 hover:bg-surface-container-low/30 transition-all text-left cursor-pointer group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary-container/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                              <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>receipt</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-text-main">{order.orderId}</span>
                                <span className="text-[10px] bg-primary-container/10 text-primary-container px-2 py-0.5 rounded-lg font-bold capitalize">{order.paymentMethod || 'qris'}</span>
                              </div>
                              <p className="text-[11px] text-text-muted mt-0.5">{order.date} &middot; {itemCount} item{itemCount > 1 ? 's' : ''}</p>
                            </div>
                            <div className="text-right flex items-center gap-3 flex-shrink-0">
                              <span className="text-sm font-bold text-text-main">{order.total}</span>
                              <span className={`material-symbols-outlined text-text-muted transition-all text-lg ${isOpen ? 'rotate-180 text-primary-container' : ''}`}>expand_more</span>
                            </div>
                          </button>
                          {isOpen && (
                            <div className="px-5 md:px-6 pb-5 animate-fade-in">
                              <div className="bg-surface-container-low/50 backdrop-blur-sm rounded-xl p-4 space-y-3 border border-border-light/40">
                                {order.items.map((item, iidx) => {
                                  const itemName = item.title || item.name
                                  const itemTotal = item.price ? parseFloat(item.price.replace(/[^0-9.,]/g, '').replace(',', '.')) * (item.qty || 1) : 0
                                  return (
                                    <div key={iidx} className="flex items-center gap-3">
                                      <img src={`https://picsum.photos/seed/${item.seed}/48/48`} alt={itemName}
                                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0 ring-1 ring-border-light/40" />
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

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="rounded-2xl bg-surface/80 backdrop-blur-xl border border-border-light/60 overflow-hidden shadow-sm">
                <div className="px-5 md:px-6 py-4 border-b border-border-light/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary-container/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>home</span>
                    </div>
                    <h2 className="text-sm font-bold text-text-main">Saved Addresses</h2>
                  </div>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)}
                      className="flex items-center gap-1 text-xs text-primary-container font-semibold hover:underline cursor-pointer">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_circle</span>
                      Add New
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <div className="px-5 md:px-6 py-5 border-b border-border-light/60 bg-gradient-to-r from-primary-container/[0.02] to-transparent">
                    <div className="space-y-3.5 max-w-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-[11px] text-text-muted font-semibold block mb-1.5">Label</label>
                          <input value={newAddress.label} onChange={e => setNewAddress(a => ({ ...a, label: e.target.value }))} placeholder="Home, Office, etc."
                            className="w-full text-sm bg-surface/70 border border-border-light/60 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all" />
                        </div>
                        <div>
                          <label className="text-[11px] text-text-muted font-semibold block mb-1.5">Phone</label>
                          <input value={newAddress.phone} onChange={e => setNewAddress(a => ({ ...a, phone: e.target.value }))} placeholder="+62xxx"
                            className="w-full text-sm bg-surface/70 border border-border-light/60 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] text-text-muted font-semibold block mb-1.5">Street Address</label>
                        <input value={newAddress.street} onChange={e => setNewAddress(a => ({ ...a, street: e.target.value }))} placeholder="Street, building, apartment"
                          className="w-full text-sm bg-surface/70 border border-border-light/60 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all" />
                      </div>
                      <div>
                        <label className="text-[11px] text-text-muted font-semibold block mb-1.5">City</label>
                        <input value={newAddress.city} onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} placeholder="City"
                          className="w-full text-sm bg-surface/70 border border-border-light/60 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all" />
                      </div>
                      <div className="flex gap-2.5 pt-1">
                        <button onClick={() => { setShowAddressForm(false); setNewAddress({ label: '', street: '', city: '', phone: '' }) }}
                          className="text-xs text-text-muted hover:text-text-main font-semibold px-4 py-2.5 rounded-xl hover:bg-surface-container-low/50 transition-all cursor-pointer">Cancel</button>
                        <button onClick={handleAddAddress}
                          className="flex items-center gap-1.5 text-xs text-surface bg-gradient-to-r from-primary-container to-blue-600 px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all cursor-pointer">
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                          Save Address
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {addresses.length === 0 && !showAddressForm ? (
                  <div className="py-14 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-low/50 flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-text-muted text-3xl">location_off</span>
                    </div>
                    <p className="text-sm text-text-muted">No addresses saved</p>
                    <p className="text-xs text-text-muted/70 mt-1">Add an address for faster checkout</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border-light/40">
                    {addresses.map(addr => (
                      <div key={addr.id} className="px-5 md:px-6 py-4 flex items-start gap-3.5 hover:bg-surface-container-low/20 transition-colors group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary-container/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>
                            {addr.label?.toLowerCase() === 'home' ? 'home' : addr.label?.toLowerCase() === 'office' ? 'business' : 'location_on'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-text-main">{addr.label}</p>
                          <p className="text-[11px] text-text-muted mt-0.5">{addr.street}</p>
                          <p className="text-[11px] text-text-muted">{addr.city}{addr.phone ? ` \u00b7 ${addr.phone}` : ''}</p>
                        </div>
                        <button onClick={() => handleRemoveAddress(addr)}
                          className="text-text-muted/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-1.5">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <>
                <div className="rounded-2xl bg-surface/80 backdrop-blur-xl border border-border-light/60 overflow-hidden shadow-sm">
                  <div className="px-5 md:px-6 py-4 border-b border-border-light/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary-container/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>lock</span>
                      </div>
                      <h2 className="text-sm font-bold text-text-main">Security</h2>
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="space-y-3.5 max-w-sm">
                      <div>
                        <label className="text-[11px] text-text-muted font-semibold block mb-1.5">Current Password</label>
                        <input type="password" value={passForm.current} onChange={e => setPassForm(f => ({ ...f, current: e.target.value }))}
                          className="w-full text-sm bg-surface-container-low/70 border border-border-light/60 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-[11px] text-text-muted font-semibold block mb-1.5">New Password</label>
                          <input type="password" value={passForm.newPass} onChange={e => setPassForm(f => ({ ...f, newPass: e.target.value }))}
                            className="w-full text-sm bg-surface-container-low/70 border border-border-light/60 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all" />
                        </div>
                        <div>
                          <label className="text-[11px] text-text-muted font-semibold block mb-1.5">Confirm Password</label>
                          <input type="password" value={passForm.confirm} onChange={e => setPassForm(f => ({ ...f, confirm: e.target.value }))}
                            className="w-full text-sm bg-surface-container-low/70 border border-border-light/60 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all" />
                        </div>
                      </div>
                      {passError && <p className="text-xs text-red-400 flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">warning</span>{passError}</p>}
                      <button onClick={handleChangePassword}
                        className="flex items-center gap-1.5 text-xs text-surface bg-gradient-to-r from-primary-container to-blue-600 px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all cursor-pointer">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>lock_reset</span>
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-surface/80 backdrop-blur-xl border border-border-light/60 overflow-hidden shadow-sm">
                  <div className="px-5 md:px-6 py-4 border-b border-border-light/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary-container/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>notifications</span>
                      </div>
                      <h2 className="text-sm font-bold text-text-main">Notifications</h2>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 space-y-4">
                    {[
                      { key: 'orders', label: 'Order Updates', desc: 'Get notified about your order status changes' },
                      { key: 'promotions', label: 'Promotions', desc: 'Receive special offers and discounts' },
                      { key: 'updates', label: 'Product Updates', desc: 'New features and product announcements' },
                    ].map(n => (
                      <div key={n.key} className="flex items-center justify-between group">
                        <div>
                          <p className="text-xs font-semibold text-text-main">{n.label}</p>
                          <p className="text-[11px] text-text-muted">{n.desc}</p>
                        </div>
                        <button onClick={() => { updateNotifPrefs({ [n.key]: !notifPrefs[n.key] }); showToast(`${n.label} ${notifPrefs[n.key] ? 'disabled' : 'enabled'}`) }}
                          className={`relative w-11 h-6 rounded-full transition-all cursor-pointer flex-shrink-0 ml-3 ${notifPrefs[n.key] ? 'bg-primary-container' : 'bg-border-light'}`}>
                          <div className={`absolute top-0.5 w-5 h-5 bg-surface rounded-full shadow-sm transition-all ${notifPrefs[n.key] ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-surface/80 backdrop-blur-xl border border-border-light/60 overflow-hidden shadow-sm">
                  <div className="px-5 md:px-6 py-4 border-b border-border-light/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary-container/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>palette</span>
                      </div>
                      <h2 className="text-sm font-bold text-text-main">Appearance</h2>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 20 }}>{dark ? 'dark_mode' : 'light_mode'}</span>
                      <div>
                        <p className="text-xs font-semibold text-text-main">Dark Mode</p>
                        <p className="text-[11px] text-text-muted">{dark ? 'Dark theme active' : 'Light theme active'}</p>
                      </div>
                    </div>
                    <button onClick={toggle}
                      className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${dark ? 'bg-primary-container' : 'bg-border-light'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-surface rounded-full shadow-sm transition-all ${dark ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {cropImage && (
        <AvatarCropModal image={cropImage} onCancel={() => setCropImage(null)} onSave={handleCropSave} />
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-text-main/90 backdrop-blur-xl text-surface text-xs font-semibold px-6 py-3.5 rounded-2xl shadow-2xl shadow-black/20 flex items-center gap-2.5 animate-fade-in-up">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {toast}
        </div>
      )}
    </div>
  )
}

function getTimeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
