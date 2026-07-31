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
