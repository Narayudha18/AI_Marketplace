import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../CartContext'
import CartDrawer from './CartDrawer'
import AuthButton from './AuthButton'
import ScrambleText from './ScrambleText'
import { useTheme } from '../ThemeContext'
import { PRODUCT_CATALOG } from '../data/product-catalog'

const CATEGORY_ICONS = {
  templates: 'dashboard',
  integrations: 'integration_instructions',
  chatbots: 'chat',
  automation: 'sync_alt',
  'ai-tools': 'code',
  'voice-ai': 'record_voice_over',
  'image-gen': 'image',
  analytics: 'analytics',
  'fine-tuning': 'tune',
  monitoring: 'monitoring',
  security: 'security',
  'ai-agents': 'robot',
  'ai-prompts': 'text_snippet',
  'ai-skills': 'school',
  'ai-tokens': 'token',
  'ai-workflows': 'account_tree',
}

const categoryItems = Object.entries(PRODUCT_CATALOG).map(([key, config]) => ({
  key,
  label: config.label,
  nav: config.nav,
  icon: CATEGORY_ICONS[key] || 'category',
}))

const navSubLinks = {
  'All Items': '',
  'GPT Agents': 'chatbots',
  'AI Agents': 'ai-agents',
  'AI Prompts': 'ai-prompts',
  'AI Skills': 'ai-skills',
  'AI Tokens': 'ai-tokens',
  'AI Workflows': 'ai-workflows',
  'Voice AI': 'voice-ai',
  'Image Gen': 'image-gen',
  'RAG Pipelines': 'integrations',
  'Workflow': 'automation',
  'Analytics': 'analytics',
  'Fine-tuning': 'fine-tuning',
  'Deployment': 'templates',
  'Monitoring': 'monitoring',
  'Security': 'security',
}

const quickSubLinks = ['All Items', 'GPT Agents', 'AI Agents', 'AI Prompts', 'AI Skills', 'AI Tokens', 'AI Workflows']

export default function Navbar() {
  const { totalItems } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [catsOpen, setCatsOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const location = useLocation()

  useEffect(() => { setCatsOpen(false) }, [location.pathname])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/templates', label: 'Templates' },
    { to: '/integrations', label: 'Integrations' },
    { to: '/chatbots', label: 'Chatbots' },
    { to: '/automation', label: 'Automation' },
    { to: '/ai-tools', label: 'AI Tools' },
  ]

  const subNavPaths = ['/ai-agents', '/ai-prompts', '/ai-skills', '/ai-tokens', '/ai-workflows']
  const showSubNav = location.pathname === '/' || subNavPaths.some(p => location.pathname.startsWith(p))

  const desktopNavLabel = 'text-[11px] font-medium uppercase tracking-[0.18em] transition-colors'

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-dashed border-[var(--color-border-light)] bg-[var(--color-background)]">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer p-1.5 text-[var(--color-text-main)] md:hidden"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
            <Link to="/" className="text-lg font-medium lowercase tracking-tight text-[var(--color-text-main)]">
              aiagents<span className="text-[var(--color-primary)]">.</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map(link => {
              const isNavActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  state={{ skipScroll: true }}
                  className={`relative py-3 ${desktopNavLabel} ${isNavActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
                >
                  <ScrambleText text={link.label} />
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 transition-opacity ${isNavActive ? 'bg-[var(--color-primary)] opacity-100' : 'opacity-0'}`} />
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/start-selling"
              className={`hidden border-b-2 py-3 ${desktopNavLabel} transition-colors sm:block ${
                location.pathname.startsWith('/start-selling')
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              Start Selling
            </Link>
            <Link
              to="/favorites"
              aria-label="Favorites"
              className={`relative cursor-pointer p-1.5 transition-colors ${location.pathname === '/favorites' ? 'text-red-500' : 'text-[var(--color-text-main)]'}`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, fontVariationSettings: location.pathname === '/favorites' ? '"FILL" 1' : undefined }}
              >
                favorite
              </span>
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative cursor-pointer p-1.5 text-[var(--color-text-main)]">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_cart</span>
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold text-[var(--color-on-primary)]">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={toggle} className="cursor-pointer p-1.5 text-[var(--color-text-main)]">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <AuthButton />
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-dashed border-[var(--color-border-light)] bg-[var(--color-background)] md:hidden">
            <div className="flex flex-col gap-1 px-4 py-3 sm:px-6">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-main)]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-dashed border-[var(--color-border-light)] pt-3">
                <p className="px-1 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-text-muted)]">Categories</p>
                {categoryItems.map(cat => (
                  <Link
                    key={cat.key}
                    to={cat.nav}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-1 py-2 text-[13px] text-[var(--color-text-main)]"
                  >
                    <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontSize: 18 }}>{cat.icon}</span>
                    {cat.label}
                  </Link>
                ))}
              </div>
              <Link
                to="/start-selling"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
              >
                Start Selling
              </Link>
            </div>
          </div>
        )}
      </header>

      {showSubNav && (
        <div className="border-b border-dashed border-[var(--color-border-light)] bg-[var(--color-surface-container-lowest)]">
          <div className="mx-auto flex h-11 max-w-[1440px] items-center justify-between gap-2 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-6 overflow-x-auto">
              {quickSubLinks.map(item => {
                const linkPath = navSubLinks[item]
                const fullPath = linkPath ? `/${linkPath}` : '/'
                const isSubActive = linkPath ? location.pathname.startsWith(`/${linkPath}`) : location.pathname === '/'
                return (
                  <Link
                    key={item}
                    to={fullPath}
                    className={`whitespace-nowrap border-b-2 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                      isSubActive
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                    }`}
                  >
                    {item}
                  </Link>
                )
              })}
            </div>
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setCatsOpen(!catsOpen)}
                className={`flex cursor-pointer items-center gap-1 border-b-2 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                  catsOpen
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                }`}
              >
                All Categories
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{catsOpen ? 'expand_less' : 'expand_more'}</span>
              </button>
              {catsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCatsOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-[680px] max-w-[calc(100vw-32px)] border border-dashed border-[var(--color-border-light)] bg-[var(--color-surface)] p-4 shadow-2xl grid grid-cols-2 gap-1 sm:grid-cols-4">
                    {categoryItems.map(cat => (
                      <Link
                        key={cat.key}
                        to={cat.nav}
                        onClick={() => setCatsOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-[var(--color-surface-container-low)]"
                      >
                        <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontSize: 18 }}>{cat.icon}</span>
                        <span className="text-[12px] font-medium text-[var(--color-text-main)]">{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}