import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  const register = (name, email, password) => {
    const exists = users.find(u => u.email === email)
    if (exists) return { ok: false, error: 'Email already registered' }
    const newUser = { id: Date.now(), name, email, password, picture: null }
    setUsers(prev => [...prev, newUser])
    setCurrentUser(newUser)
    return { ok: true }
  }

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) return { ok: false, error: 'Invalid email or password' }
    setCurrentUser(user)
    return { ok: true }
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

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout, updatePassword, updatePicture }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
