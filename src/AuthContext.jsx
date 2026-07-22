import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  const register = (name, email, password) => {
    const exists = users.find(u => u.email === email)
    if (exists) return { ok: false, error: 'Email already registered' }
    const newUser = { id: Date.now(), name, email, password }
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

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
