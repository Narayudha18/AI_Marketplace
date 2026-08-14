import templates from './templates.json'
import integrations from './integrations.json'
import chatbots from './chatbots.json'
import automations from './automation.json'
import aitools from './aitools.json'
import voiceAi from './voice-ai.json'
import imageGen from './image-gen.json'
import analytics from './analytics.json'
import fineTuning from './fine-tuning.json'
import monitoring from './monitoring.json'
import security from './security.json'
import agents from './ai-agents.json'
import prompts from './ai-prompts.json'
import skills from './ai-skills.json'
import tokens from './ai-tokens.json'
import workflows from './ai-workflows.json'
import { readSellerProducts } from '../lib/storage'

export const PRODUCT_CATALOG = {
  templates: { items: templates, nameKey: 'title', nav: '/templates', label: 'Templates', keywords: 'template starter landing website react next dashboard app' },
  integrations: { items: integrations, nameKey: 'name', nav: '/integrations', label: 'Integrations', keywords: 'integration api connect connector bridge slack notion' },
  chatbots: { items: chatbots, nameKey: 'name', nav: '/chatbots', label: 'Chatbots', keywords: 'chatbot chat assistant conversation customer support bot' },
  automation: { items: automations, nameKey: 'name', nav: '/automation', label: 'Automation', keywords: 'automation workflow trigger pipeline zapier no-code' },
  'ai-tools': { items: aitools, nameKey: 'name', nav: '/ai-tools', label: 'AI Tools & APIs', keywords: 'api tool sdk llm model inference developer' },
  'voice-ai': { items: voiceAi, nameKey: 'title', nav: '/voice-ai', label: 'Voice AI', keywords: 'voice tts stt speech audio transcription clone' },
  'image-gen': { items: imageGen, nameKey: 'title', nav: '/image-gen', label: 'Image Gen', keywords: 'image generate art photo diffusion stable video' },
  analytics: { items: analytics, nameKey: 'title', nav: '/analytics', label: 'Analytics', keywords: 'analytics data dashboard insight report metric' },
  'fine-tuning': { items: fineTuning, nameKey: 'title', nav: '/fine-tuning', label: 'Fine-tuning', keywords: 'fine tune train model dataset custom gpu' },
  monitoring: { items: monitoring, nameKey: 'title', nav: '/monitoring', label: 'Monitoring', keywords: 'monitor alert uptime logs observability track' },
  security: { items: security, nameKey: 'title', nav: '/security', label: 'Security', keywords: 'security threat protect firewall scan vulnerability' },
  'ai-agents': { items: agents, nameKey: 'name', nav: '/ai-agents', label: 'AI Agents', keywords: 'agent autonomous assistant task automate delegate' },
  'ai-prompts': { items: prompts, nameKey: 'name', nav: '/ai-prompts', label: 'AI Prompts', keywords: 'prompt generate prompt-engineering writing copy template' },
  'ai-skills': { items: skills, nameKey: 'name', nav: '/ai-skills', label: 'AI Skills', keywords: 'skill claude openai gemini expertise capability ability' },
  'ai-tokens': { items: tokens, nameKey: 'name', nav: '/ai-tokens', label: 'AI Tokens', keywords: 'token credit api quota gpt claude llama usage' },
  'ai-workflows': { items: workflows, nameKey: 'name', nav: '/ai-workflows', label: 'AI Workflows', keywords: 'workflow orchestration pipeline process automate steps' },
}

export function toSlug(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function getProductLabel(item) {
  return item?.title || item?.name || ''
}

export function getProductDesc(item) {
  return item?.desc || item?.description || ''
}

export function getCategoryList() {
  return Object.keys(PRODUCT_CATALOG)
}

export function getConfig(category) {
  return PRODUCT_CATALOG[category] || null
}

export function findProduct(category, slug) {
  const config = PRODUCT_CATALOG[category]
  if (config) {
    const item = config.items.find(i => toSlug(i[config.nameKey]) === slug)
    if (item) return { item, config }
  }
  const seller = readSellerProducts().find(p => p.category === category && toSlug(p.title) === slug)
  if (seller) return { item: { ...seller }, config }
  return { item: undefined, config: undefined }
}

export function getProductReviews(category, slug) {
  try {
    const local = JSON.parse(localStorage.getItem(`reviews_${category}_${slug}`)) || []
    return local
  } catch { return [] }
}

export function getAvgRating(category, slug, seedItem) {
  const local = getProductReviews(category, slug)
  const seedReviews = seedItem?.reviews || []
  const merged = [...seedReviews, ...local]
  if (!merged.length) return seedItem?.rating || null
  return (merged.reduce((s, r) => s + Number(r.rating || 0), 0) / merged.length).toFixed(1)
}

export function getAllProductEntries() {
  const entries = []
  for (const [category, config] of Object.entries(PRODUCT_CATALOG)) {
    for (const item of config.items) {
      entries.push({ ...item, category, config })
    }
  }
  return entries
}

export function parsePrice(price) {
  if (!price) return Infinity
  const num = parseFloat(String(price).replace(/[^0-9.,]/g, '').replace(',', '.'))
  return Number.isFinite(num) ? num : Infinity
}

export function scoreEntry(entry, tokens) {
  const haystack = [
    entry.name, entry.title, entry.category,
    entry.description, entry.desc,
    entry.config.label, entry.config.keywords,
    entry.type, entry.platform,
  ].filter(Boolean).join(' ').toLowerCase()

  let score = 0
  for (const tok of tokens) {
    if (!tok) continue
    if (haystack.includes(tok)) score += 4
    else if (tok.length > 3 && haystack.split(' ').some(w => w.includes(tok))) score += 2
  }
  return score
}

export function searchProducts(query) {
  const q = (query || '').toLowerCase()
  const tokens = q.split(/[^a-z0-9+]+/).filter(Boolean)
  if (!tokens.length) return []
  return getAllProductEntries()
    .map(entry => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score || (b.entry.rating || 0) - (a.entry.rating || 0) || parsePrice(a.entry.price) - parsePrice(b.entry.price))
    .map(r => r.entry)
}
