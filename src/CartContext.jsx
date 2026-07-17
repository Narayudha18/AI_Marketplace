import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })
  const [purchased, setPurchased] = useState(() => {
    try { return JSON.parse(localStorage.getItem('purchased')) || [] } catch { return [] }
  })
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favorites')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem('purchased', JSON.stringify(purchased))
  }, [purchased])
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.slug === item.slug && i.category === item.category)
      if (exists) return prev
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const removeFromCart = (slug, category) => {
    setCart(prev => prev.filter(i => !(i.slug === slug && i.category === category)))
  }

  const clearCart = () => setCart([])

  const markAsPurchased = (slug, category) => {
    setPurchased(prev => {
      const exists = prev.find(p => p.slug === slug && p.category === category)
      if (exists) return prev
      return [...prev, { slug, category }]
    })
  }

  const inCart = (slug, category) => {
    return cart.some(i => i.slug === slug && i.category === category)
  }

  const hasPurchased = (slug, category) => {
    return purchased.some(p => p.slug === slug && p.category === category)
  }

  const totalItems = cart.length

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
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, markAsPurchased, inCart, hasPurchased, totalItems, favorites, toggleFavorite, isFavorite, getFavoriteCategories }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
