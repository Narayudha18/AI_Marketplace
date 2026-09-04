import templates from './templates.json'
import integrations from './integrations.json'
import chatbots from './chatbots.json'
import automation from './automation.json'
import aitools from './aitools.json'
import voiceAi from './voice-ai.json'
import imageGen from './image-gen.json'
import analytics from './analytics.json'
import fineTuning from './fine-tuning.json'
import monitoring from './monitoring.json'
import security from './security.json'
import skills from './ai-skills.json'
import workflows from './ai-workflows.json'
import agents from './ai-agents.json'
import prompts from './ai-prompts.json'
import tokens from './ai-tokens.json'
import { toSlug } from '../lib/helpers'

const CATEGORY_MAP = [
  ['templates', templates],
  ['integrations', integrations],
  ['chatbots', chatbots],
  ['automation', automation],
  ['ai-tools', aitools],
  ['voice-ai', voiceAi],
  ['image-gen', imageGen],
  ['analytics', analytics],
  ['fine-tuning', fineTuning],
  ['monitoring', monitoring],
  ['security', security],
  ['ai-skills', skills],
  ['ai-workflows', workflows],
  ['ai-agents', agents],
  ['ai-prompts', prompts],
  ['ai-tokens', tokens],
]

export const ALL_SEED_PRODUCTS = CATEGORY_MAP.flatMap(([cat, items]) =>
  items.map(p => ({ ...p, _cat: cat }))
)

const AUTHOR_SET = new Set()
for (const p of ALL_SEED_PRODUCTS) {
  if (p.author) AUTHOR_SET.add(String(p.author))
}
const AUTHORS = [...AUTHOR_SET].sort()

export const AUTHOR_SELLERS = AUTHORS.map((author, i) => ({
  id: 100000 + i,
  name: author,
  email: `${toSlug(author)}@seller.ai-marketplace.com`,
  password: 'seller123',
  picture: null,
  isSeller: true,
  isAdmin: false,
  sellerRequested: false,
  bio: `${author} is a verified seller on the AI Agents Marketplace, offering production-grade AI solutions.`,
  authorKey: author,
}))

export function getSellerIdByAuthor(author) {
  if (!author) return null
  const a = String(author)
  return AUTHOR_SELLERS.find(s => s.authorKey === a)?.id ?? null
}

export function getAuthorBySellerId(id) {
  const num = Number(id)
  return AUTHOR_SELLERS.find(s => s.id === num)?.authorKey ?? null
}

export function getSeedProductsByAuthor(author) {
  if (!author) return []
  const a = String(author)
  return ALL_SEED_PRODUCTS.filter(p => String(p.author) === a)
}
