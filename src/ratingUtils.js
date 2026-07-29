const CACHE_KEY = 'computed_ratings'

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {} } catch { return {} }
}

function saveCache(cache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

export function getRating(category, slug, fallback) {
  const cache = loadCache()
  const key = category + '_' + slug
  return cache[key] !== undefined ? cache[key] : fallback
}

export function updateRating(category, slug) {
  try {
    const prefix = 'reviews_' + category + '_' + slug
    const data = JSON.parse(localStorage.getItem(prefix))
    if (!Array.isArray(data) || data.length === 0) return
    const avg = (data.reduce((s, r) => s + r.rating, 0) / data.length).toFixed(1)
    const cache = loadCache()
    cache[category + '_' + slug] = parseFloat(avg)
    saveCache(cache)
  } catch {}
}
