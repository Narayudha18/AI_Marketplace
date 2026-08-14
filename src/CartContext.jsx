import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

const GUEST = 'guest'

function migrateLegacy(scope, kind) {
  const legacyKey = kind
  const scopedKey = `${kind}_${scope}`
  const LEGACY_FLAG = `cart_migration_v1_${kind}`
  try {
    if (localStorage.getItem(LEGACY_FLAG)) return
    const legacy = JSON.parse(localStorage.getItem(legacyKey)) || []
    const existing = JSON.parse(localStorage.getItem(scopedKey) || '[]')
    if (legacy.length && !existing.length) {
      localStorage.setItem(scopedKey, JSON.stringify(legacy))
    }
    localStorage.setItem(LEGACY_FLAG, '1')
  } catch {}
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth()
  const userId = currentUser ? currentUser.id : GUEST
  const scopeKey = currentUser ? currentUser.id : GUEST

  useEffect(() => {
    migrateLegacy(scopeKey, 'cart')
    migrateLegacy(scopeKey, 'purchased')
    migrateLegacy(scopeKey, 'favorites')
  }, [scopeKey])

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`cart_${userId}`)) || [] } catch { return [] }
  })
  const [purchased, setPurchased] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`purchased_${userId}`)) || [] } catch { return [] }
  })
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [] } catch { return [] }
  })

  useEffect(() => {
    setCart(() => {
      try { return JSON.parse(localStorage.getItem(`cart_${userId}`)) || [] } catch { return [] }
    })
    setPurchased(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(`purchased_${userId}`)) || []
        const orders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]')
        const map = new Map(stored.map(p => [`${p.category}-${p.slug}`, p]))
        for (const o of orders) {
          for (const it of o.items || []) {
            if (!it.slug || !it.category) continue
            const key = `${it.category}-${it.slug}`
            if (!map.has(key)) map.set(key, { slug: it.slug, category: it.category, date: o.date })
          }
        }
        return [...map.values()]
      } catch { return [] }
    })
    setFavorites(() => {
      try { return JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [] } catch { return [] }
    })
  }, [userId])

  useEffect(() => {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart))
  }, [cart, userId])
  useEffect(() => {
    localStorage.setItem(`purchased_${userId}`, JSON.stringify(purchased))
  }, [purchased, userId])
  useEffect(() => {
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites))
  }, [favorites, userId])

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.slug === item.slug && i.category === item.category)
      if (exists) return prev.map(i => i.slug === item.slug && i.category === item.category ? { ...i, qty: i.qty + (item.qty || 1) } : i)
      return [...prev, { ...item, qty: item.qty || 1 }]
    })
  }

  const updateQty = (slug, category, qty) => {
    if (qty < 1) return removeFromCart(slug, category)
    setCart(prev => prev.map(i => i.slug === slug && i.category === category ? { ...i, qty } : i))
  }

  const removeFromCart = (slug, category) => {
    setCart(prev => prev.filter(i => !(i.slug === slug && i.category === category)))
  }

  const clearCart = () => setCart([])

  const markAsPurchased = (slug, category, date) => {
    setPurchased(prev => {
      const exists = prev.find(p => p.slug === slug && p.category === category)
      if (exists) return prev
      return [...prev, { slug, category, date: date || new Date().toISOString() }]
    })
  }

  const inCart = (slug, category) => {
    return cart.some(i => i.slug === slug && i.category === category)
  }

  const hasPurchased = (slug, category) => {
    return purchased.some(p => p.slug === slug && p.category === category)
  }

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0)

  const toggleFavorite = (slug, category) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.slug === slug && f.category === category)
      if (exists) return prev.filter(f => !(f.slug === slug && f.category === category))
      return [...prev, { slug, category }]
    })
  }

  const isFavorite = (slug, category) => {
    return favorites.some(f => f.slug === slug && f.category === category)
  }

  const getFavoriteCategories = () => {
    const cats = [...new Set(favorites.map(f => f.category))]
    return cats
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, markAsPurchased, inCart, hasPurchased, totalItems, purchased, favorites, toggleFavorite, isFavorite, getFavoriteCategories }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
