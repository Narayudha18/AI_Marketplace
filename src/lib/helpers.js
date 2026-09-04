export function toSlug(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function parsePrice(price) {
  if (!price) return 0
  const num = parseFloat(String(price).replace(/[^0-9.,]/g, '').replace(',', '.'))
  return Number.isFinite(num) ? num : 0
}

export function parseSales(sales) {
  if (typeof sales === 'number') return sales
  if (!sales) return 0
  const str = String(sales)
  const num = parseFloat(str.replace(/[^0-9.]/g, ''))
  return str.toLowerCase().includes('k') ? num * 1000 : num
}

export function formatPrice(price) {
  return `$${price.toLocaleString('en-US')}`
}

export function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}
