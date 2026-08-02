import { getAuthorBySellerId, getSeedProductsByAuthor } from '../data/seed-sellers'

export function readUsers() {
  try { return JSON.parse(localStorage.getItem('auth_users') || '[]') } catch { return [] }
}

export function readSellerProducts() {
  try { return JSON.parse(localStorage.getItem('seller_products') || '[]') } catch { return [] }
}

export function getUserById(id) {
  const num = Number(id)
  return readUsers().find(u => u.id === num) || null
}

export function getSellerProductsBySeller(sellerId) {
  const num = Number(sellerId)
  return readSellerProducts().filter(p => Number(p.sellerId) === num)
}

export function getAllProductsForSeller(sellerId) {
  const local = getSellerProductsBySeller(sellerId)
  const author = getAuthorBySellerId(sellerId)
  const seed = author ? getSeedProductsByAuthor(author) : []
  return [...local, ...seed]
}

export function toSlug(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function getSellerName(item) {
  if (!item || !item.sellerId) return null
  const user = getUserById(item.sellerId)
  return user ? user.name : null
}

export function mergeCategoryItems(items, category, nameKey = 'title') {
  const sellerProducts = readSellerProducts().filter(p => p.category === category)
  if (!sellerProducts.length) return items
  const slugSet = new Set(items.map(i => toSlug(String(i[nameKey] || i.title || i.name))))
  const merged = [...items]
  for (const p of sellerProducts) {
    const slug = toSlug(p.title)
    if (slugSet.has(slug)) continue
    slugSet.add(slug)
    merged.push({ ...p, name: p.name || p.title })
  }
  return merged
}
