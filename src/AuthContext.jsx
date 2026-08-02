import { createContext, useContext, useState, useEffect } from 'react'
import { AUTHOR_SELLERS } from './data/seed-sellers'
import { seedTransactions } from './data/seed-transactions'

const AuthContext = createContext()

const SEED_USERS = [
  { id: 1, name: 'Admin', email: 'admin@gmail.com', password: 'admin123', picture: null, isSeller: false, isAdmin: true, sellerRequested: false },
  { id: 2, name: 'Rina Wijaya', email: 'rina.wijaya@gmail.com', password: 'seller123', picture: null, isSeller: true, isAdmin: false, sellerRequested: false, bio: 'Creative designer specializing in website templates and AI-powered design tools.' },
  { id: 3, name: 'Budi Santoso', email: 'budi.santoso@gmail.com', password: 'seller123', picture: null, isSeller: true, isAdmin: false, sellerRequested: false, bio: 'Full-stack developer building image generation and automation solutions.' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi.lestari@gmail.com', password: 'seller123', picture: null, isSeller: true, isAdmin: false, sellerRequested: false, bio: 'AI consultant crafting chatbots and conversational AI experiences.' },
  { id: 5, name: 'Andi Pratama', email: 'andi.pratama@gmail.com', password: 'seller123', picture: null, isSeller: false, isAdmin: false, sellerRequested: true, bio: 'Data enthusiast exploring AI analytics and monitoring tools.' },
  { id: 6, name: 'Siti Rahma', email: 'siti.rahma@gmail.com', password: 'seller123', picture: null, isSeller: false, isAdmin: false, sellerRequested: true, bio: 'Content creator passionate about AI writing and productivity tools.' },
]

const SEED_SELLER_PRODUCTS = [
  { id: 2001, title: 'Modern SaaS Landing Template', category: 'templates', price: '$49', desc: 'A clean, conversion-focused landing page template.', sellerId: 2, seed: 'seller-2001', date: '2026-05-12', sales: 34, rating: 4.8 },
  { id: 2002, title: 'Portfolio Website Template', category: 'templates', price: '$29', desc: 'Minimal portfolio template for creatives.', sellerId: 2, seed: 'seller-2002', date: '2026-06-03', sales: 21, rating: 4.6 },
  { id: 3001, title: 'AI Image Upscaler Bot', category: 'image-gen', price: '$79', desc: 'Bulk image upscaling powered by AI.', sellerId: 3, seed: 'seller-3001', date: '2026-04-18', sales: 15, rating: 4.5 },
  { id: 3002, title: 'Auto Workflow Builder', category: 'automation', price: '$99', desc: 'Visual workflow automation for teams.', sellerId: 3, seed: 'seller-3002', date: '2026-05-27', sales: 12, rating: 4.7 },
  { id: 4001, title: 'Support Chatbot Kit', category: 'chatbots', price: '$59', desc: 'Ready-to-train customer support chatbot.', sellerId: 4, seed: 'seller-4001', date: '2026-06-15', sales: 28, rating: 4.9 },
  { id: 4002, title: 'AI Voice Assistant', category: 'voice-ai', price: '$69', desc: 'Custom voice assistant for your business.', sellerId: 4, seed: 'seller-4002', date: '2026-07-01', sales: 9, rating: 4.4 },
]

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('auth_users')) || []
      const allSeeds = [...SEED_USERS, ...AUTHOR_SELLERS]
      const missing = allSeeds.filter(seed => !stored.some(u => u.email === seed.email))
      return missing.length ? [...stored, ...missing] : stored
    } catch { return [...SEED_USERS] }
  })
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('auth_current'))
      if (!saved) return null
      const latest = users.find(u => u.id === saved.id)
      return latest || saved
    } catch { return null }
  })

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('seller_products') || '[]')
      if (existing.length === 0) localStorage.setItem('seller_products', JSON.stringify(SEED_SELLER_PRODUCTS))
    } catch {}
    seedTransactions()
  }, [])

  useEffect(() => {
    localStorage.setItem('auth_users', JSON.stringify(users))
    if (currentUser) {
      const fresh = users.find(u => u.id === currentUser.id)
      if (fresh && JSON.stringify(fresh) !== JSON.stringify(currentUser)) {
        setCurrentUser(fresh)
      }
    }
  }, [users])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('auth_current', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('auth_current')
    }
  }, [currentUser])

  const register = (name, email, password) => {
    const exists = users.find(u => u.email === email)
    if (exists) return { ok: false, error: 'Email already registered' }
    const newUser = { id: Date.now(), name, email, password, picture: null, isSeller: false, isAdmin: false, sellerRequested: false }
    setUsers(prev => [...prev, newUser])
    setCurrentUser(newUser)
    return { ok: true }
  }

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) return { ok: false, error: 'Invalid email or password' }
    setCurrentUser(user)
    return { ok: true, isAdmin: user.isAdmin }
  }

  const logout = () => setCurrentUser(null)

  const updatePassword = (currentPassword, newPassword) => {
    if (!currentUser) return { ok: false, error: 'Not logged in' }
    if (currentUser.password !== currentPassword) return { ok: false, error: 'Current password is incorrect' }
    const updated = { ...currentUser, password: newPassword }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u))
    setCurrentUser(updated)
    return { ok: true }
  }

  const updateProfile = (fields) => {
    if (!currentUser) return null
    const updated = { ...currentUser, ...fields }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u))
    setCurrentUser(updated)
    return updated
  }

  const updatePicture = (dataUrl) => {
    if (!currentUser) return
    const updated = { ...currentUser, picture: dataUrl }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u))
    setCurrentUser(updated)
  }

  const addAddress = (address) => {
    if (!currentUser) return
    const addresses = currentUser.addresses || []
    const updated = { ...currentUser, addresses: [...addresses, { ...address, id: Date.now() }] }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u))
    setCurrentUser(updated)
  }

  const removeAddress = (addressId) => {
    if (!currentUser) return
    const addresses = (currentUser.addresses || []).filter(a => a.id !== addressId)
    const updated = { ...currentUser, addresses }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u))
    setCurrentUser(updated)
  }

  const [activities, setActivities] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_activities')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('auth_activities', JSON.stringify(activities))
  }, [activities])

  const trackActivity = (action, detail) => {
    if (!currentUser) return
    const entry = { id: Date.now(), userId: currentUser.id, action, detail, time: new Date().toISOString() }
    setActivities(prev => [entry, ...prev].slice(0, 50))
  }

  const getUserActivities = () => {
    if (!currentUser) return []
    return activities.filter(a => a.userId === currentUser.id).slice(0, 20)
  }

  const requestSeller = () => {
    if (!currentUser) return
    const updated = { ...currentUser, sellerRequested: true }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u))
    setCurrentUser(updated)
  }

  const becomeAdmin = () => {
    if (!currentUser) return
    const updated = { ...currentUser, isAdmin: true }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u))
    setCurrentUser(updated)
  }

  const updateNotifPrefs = (prefs) => {
    if (!currentUser) return
    const updated = { ...currentUser, notificationPrefs: { ...(currentUser.notificationPrefs || {}), ...prefs } }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u))
    setCurrentUser(updated)
  }

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout, updatePassword, updateProfile, updatePicture, requestSeller, becomeAdmin, addAddress, removeAddress, trackActivity, getUserActivities, updateNotifPrefs }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
