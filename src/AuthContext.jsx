import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const SEED_ADMIN = { id: 1, name: 'Admin', email: 'admin@gmail.com', password: 'admin123', picture: null, isSeller: false, isAdmin: true, sellerRequested: false }

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('auth_users')) || []
      const hasAdmin = stored.some(u => u.email === SEED_ADMIN.email)
      return hasAdmin ? stored : [SEED_ADMIN, ...stored]
    } catch { return [SEED_ADMIN] }
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

  const updatePicture = (dataUrl) => {
    if (!currentUser) return
    const updated = { ...currentUser, picture: dataUrl }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u))
    setCurrentUser(updated)
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

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout, updatePassword, updatePicture, requestSeller, becomeAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
