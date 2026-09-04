import { ALL_SEED_PRODUCTS } from './seed-sellers'
import { toSlug } from '../lib/helpers'

function bySeed(id) {
  return ALL_SEED_PRODUCTS.find(p => p.id === id || p.seed === id)
}

function item(seed, qty = 1) {
  const p = bySeed(seed)
  const name = p.title || p.name
  return { slug: toSlug(name), category: p._cat, seed: p.seed, title: p.title, name: p.name, price: p.price, qty }
}

function num(price) {
  return parseFloat(String(price).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
}

function fmt(items) {
  const total = items.reduce((s, it) => s + num(it.price) * it.qty, 0)
  return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function order(userId, paymentMethod, date, address, ...seeds) {
  const items = seeds.map(s => Array.isArray(s) ? item(s[0], s[1]) : item(s))
  return { items, total: fmt(items), date, orderId: 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(), paymentMethod, userId, address }
}

export const SEED_ORDERS = [
  order(5, 'qris', '2026-07-02 14:23', 'Jl. Merdeka No. 12, Jakarta Selatan', 'ag-002', ['pr-005', 2], ['tk-004', 1]),
  order(6, 'dana', '2026-07-04 09:15', 'Jl. Sudirman Kav. 8, Bandung', 'pr-002', ['sk-001', 1], ['tk-001', 1]),
  order(5, 'bca', '2026-06-28 19:41', 'Jl. Merdeka No. 12, Jakarta Selatan', ['wf-003', 1], 'ag-012'),
  order(6, 'gopay', '2026-07-11 11:02', 'Jl. Sudirman Kav. 8, Bandung', ['sk-002', 1], ['pr-004', 2]),
  order(2, 'qris', '2026-07-15 08:30', 'Jl. Melati No. 3, Yogyakarta', ['tk-001', 2]),
  order(3, 'mandiri', '2026-07-18 16:47', 'Jl. Anggrek No. 21, Surabaya', ['ag-001', 1], ['wf-001', 1]),
  order(4, 'shopeepay', '2026-07-21 13:05', 'Jl. Kenanga No. 7, Semarang', ['pr-006', 1], ['sk-003', 1], ['tk-002', 1]),
  order(5, 'bni', '2026-07-24 20:19', 'Jl. Merdeka No. 12, Jakarta Selatan', 'wf-004'),
  order(6, 'ovo', '2026-07-27 10:58', 'Jl. Sudirman Kav. 8, Bandung', ['ag-010', 2], 'pr-007'),
  order(2, 'alfamart', '2026-07-29 15:33', 'Jl. Melati No. 3, Yogyakarta', ['tk-005', 2]),
]

export const SEED_ORDER_STATUSES = {
  [SEED_ORDERS[0].orderId]: 'completed',
  [SEED_ORDERS[1].orderId]: 'completed',
  [SEED_ORDERS[2].orderId]: 'completed',
  [SEED_ORDERS[3].orderId]: 'processing',
  [SEED_ORDERS[4].orderId]: 'completed',
  [SEED_ORDERS[5].orderId]: 'processing',
  [SEED_ORDERS[6].orderId]: 'pending',
  [SEED_ORDERS[7].orderId]: 'pending',
  [SEED_ORDERS[8].orderId]: 'processing',
  [SEED_ORDERS[9].orderId]: 'pending',
}

const review = (name, text, rating, date) => ({ name, text, rating, date })

export const SEED_REVIEWS = [
  {
    category: 'ai-agents',
    slug: 'customer-support-bot',
    reviews: [
      review('Rina W', 'Very responsive, reduced our ticket backlog dramatically.', 5, '2026-06-20'),
      review('Budi S', 'Easy to train on our FAQ. Great value for money.', 4, '2026-07-02'),
    ],
  },
  {
    category: 'ai-agents',
    slug: 'content-writing-assistant',
    reviews: [
      review('Siti R', 'The brand voice feature is fantastic. Saves hours every week.', 5, '2026-07-08'),
    ],
  },
  {
    category: 'ai-prompts',
    slug: 'creative-story-generator',
    reviews: [
      review('Andi P', 'Incredible output quality for fiction drafts.', 5, '2026-07-12'),
      review('Dewi L', 'Good prompts, needs a little editing but very useful.', 4, '2026-07-15'),
    ],
  },
  {
    category: 'ai-prompts',
    slug: 'seo-meta-description-writer',
    reviews: [
      review('Siti R', 'CTR on our product pages went up noticeably.', 4, '2026-06-25'),
    ],
  },
  {
    category: 'ai-skills',
    slug: 'python-data-analysis-skill',
    reviews: [
      review('Budi S', 'Clear step-by-step instructions. Highly recommended.', 5, '2026-07-05'),
    ],
  },
  {
    category: 'ai-skills',
    slug: 'web-scraping-expert',
    reviews: [
      review('Andi P', 'Handles tricky sites well. Solid documentation.', 4, '2026-07-18'),
    ],
  },
  {
    category: 'ai-tokens',
    slug: 'gpt-4-turbo-tokens',
    reviews: [
      review('Rina W', 'Fast and reliable. Easy top-up.', 5, '2026-06-30'),
      review('Dewi L', 'Slightly pricey but performance is excellent.', 4, '2026-07-10'),
    ],
  },
  {
    category: 'ai-workflows',
    slug: 'ci-cd-deployment-pipeline',
    reviews: [
      review('Budi S', 'Cut our deploy time in half. Great integration guides.', 5, '2026-07-14'),
    ],
  },
]

export const SEED_ACTIVITIES = [
  { id: 70001, userId: 5, action: 'purchase', detail: 'Bought Customer Support Bot', time: '2026-07-02T14:23:00.000Z' },
  { id: 70002, userId: 6, action: 'purchase', detail: 'Bought Creative Story Generator', time: '2026-07-04T09:15:00.000Z' },
  { id: 70003, userId: 5, action: 'login', detail: 'Signed in', time: '2026-07-05T08:00:00.000Z' },
  { id: 70004, userId: 6, action: 'purchase', detail: 'Bought Web Scraping Expert', time: '2026-07-11T11:02:00.000Z' },
  { id: 70005, userId: 2, action: 'login', detail: 'Signed in', time: '2026-07-15T08:12:00.000Z' },
  { id: 70006, userId: 5, action: 'purchase', detail: 'Bought CI/CD Deployment Pipeline', time: '2026-06-28T19:41:00.000Z' },
]

export function seedTransactions() {
  try {
    const FLAG = 'seed_transactions_v1'
    if (localStorage.getItem(FLAG)) return

    for (const o of SEED_ORDERS) {
      const key = 'orders_' + o.userId
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      if (!existing.some(e => e.orderId === o.orderId)) {
        localStorage.setItem(key, JSON.stringify([o, ...existing]))
      }
    }

    const statuses = JSON.parse(localStorage.getItem('order_statuses') || '{}')
    let changed = false
    for (const [id, st] of Object.entries(SEED_ORDER_STATUSES)) {
      if (!(id in statuses)) { statuses[id] = st; changed = true }
    }
    if (changed) localStorage.setItem('order_statuses', JSON.stringify(statuses))

    for (const entry of SEED_REVIEWS) {
      const key = `reviews_${entry.category}_${entry.slug}`
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      const merged = [...existing]
      for (const r of entry.reviews) {
        if (!existing.some(e => e.name === r.name && e.text === r.text)) merged.push(r)
      }
      localStorage.setItem(key, JSON.stringify(merged))
    }

    const acts = JSON.parse(localStorage.getItem('auth_activities') || '[]')
    const newActs = SEED_ACTIVITIES.filter(a => !acts.some(e => e.id === a.id))
    if (newActs.length) localStorage.setItem('auth_activities', JSON.stringify([...newActs, ...acts]))

    localStorage.setItem(FLAG, '1')
  } catch {}
}
