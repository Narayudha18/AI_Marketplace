import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useCart } from '../CartContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Profile() {
  const { currentUser, updatePassword, updatePicture } = useAuth()
  const { cart, purchased, favorites } = useCart()
  const fileInputRef = useRef()

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMsg, setPwMsg] = useState({ ok: false, text: '' })

  const handlePasswordChange = (e) => {
    e.preventDefault()
    setPwMsg({ ok: false, text: '' })
    if (newPw !== confirmPw) { setPwMsg({ ok: false, text: 'Passwords do not match' }); return }
    const result = updatePassword(currentPw, newPw)
    if (result.ok) { setPwMsg({ ok: true, text: 'Password changed successfully' }); setCurrentPw(''); setNewPw(''); setConfirmPw('') }
    else setPwMsg({ ok: false, text: result.error })
  }

  const handlePictureUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updatePicture(reader.result)
    reader.readAsDataURL(file)
  }

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <main className="w-full max-w-[1440px] mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-text-main mb-4">Sign in required</h1>
          <p className="text-text-muted mb-6">Please sign in to view your profile.</p>
          <Link to="/login" className="bg-primary text-surface px-6 py-2.5 rounded-lg text-sm font-bold inline-block hover:opacity-90 transition-opacity">Sign In</Link>
        </main>
        <Footer />
      </>
    )
  }

  const stats = [
    { label: 'In Cart', value: cart.length, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Purchased', value: purchased.length, color: 'bg-green-500/10 text-green-500' },
    { label: 'Favorites', value: favorites.length, color: 'bg-red-500/10 text-red-500' },
  ]

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-surface border border-border-light rounded-xl p-8">
            <div className="flex items-center gap-5 pb-6 border-b border-border-light">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0 overflow-hidden">
                  {currentUser.picture
                    ? <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
                    : (currentUser.name ? currentUser.name[0].toUpperCase() : '?')}
                </div>
                <button onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined text-white text-lg">photo_camera</span>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePictureUpload} className="hidden" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-main">{currentUser.name}</h1>
                <p className="text-sm text-text-muted mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {stats.map(s => (
                <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs font-medium mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-surface border border-border-light rounded-xl p-6">
            <h2 className="text-sm font-bold text-text-main mb-4">Account Details</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border-light">
                <span className="text-text-muted">Name</span>
                <span className="text-text-main font-medium">{currentUser.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border-light">
                <span className="text-text-muted">Email</span>
                <span className="text-text-main font-medium">{currentUser.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-muted">Provider</span>
                <span className="text-text-main font-medium capitalize">{currentUser.provider || 'email'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-surface border border-border-light rounded-xl p-6">
            <h2 className="text-sm font-bold text-text-main mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 max-w-sm">
              {pwMsg.text && (
                <p className={`text-xs px-3 py-2 rounded-lg border ${pwMsg.ok ? 'text-green-600 bg-green-500/5 border-green-500/20' : 'text-red-500 bg-red-500/5 border-red-500/20'}`}>{pwMsg.text}</p>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-text-muted">Current Password</label>
                <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required
                  className="w-full px-3 py-2 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-text-muted">New Password</label>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required
                  className="w-full px-3 py-2 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-text-muted">Confirm New Password</label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required
                  className="w-full px-3 py-2 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main focus:outline-none focus:border-primary transition-colors" />
              </div>
              <button type="submit"
                className="w-fit bg-primary text-surface text-sm font-bold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">Update Password</button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
