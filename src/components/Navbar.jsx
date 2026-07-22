import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../CartContext'
import CartDrawer from './CartDrawer'
import AuthButton from './AuthButton'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const navSubLinks = {
  'All Items': '',
  'GPT Agents': 'chatbots',
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

export default function Navbar() {
  const { totalItems } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }
  return (
    <>
      <div className="bg-gradient-to-r from-primary-container to-blue-600 text-on-primary-container px-6 py-2.5 text-center text-xs font-semibold flex justify-center items-center gap-3">
        <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">New</span>
        <span>All-in-one AI agent marketplace. Deploy, integrate & scale intelligent automation.</span>
        <Link to="/templates" className="bg-text-main text-surface px-4 py-1.5 rounded text-[11px] font-bold hover:opacity-90 transition-opacity whitespace-nowrap">Explore Now</Link>
      </div>

      <header className="bg-text-main flex flex-col w-full sticky top-0 z-40">
        <div className="px-6 h-14 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="text-lg font-bold text-surface tracking-tight">AIAgents</Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'AI Agents' },
              { to: '/templates', label: 'Templates' },
              { to: '/integrations', label: 'Integrations' },
              { to: '/chatbots', label: 'Chatbots' },
              { to: '/automation', label: 'Automation' },
              { to: '/ai-tools', label: 'AI Tools' },
            ].map(link => {
              const isNavActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
              return (
                <Link key={link.to} to={link.to}
                  className={`text-xs font-semibold px-3 py-2 rounded-md transition-all relative ${isNavActive ? 'text-primary' : 'text-surface-variant hover:text-surface'}`}>
                  {link.label}
                  {isNavActive && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/start-selling" className="hidden sm:flex text-surface-variant hover:text-surface transition-colors text-xs font-semibold">Start Selling</Link>
            <button onClick={() => setCartOpen(true)} className="relative text-surface-variant hover:text-surface transition-colors cursor-pointer p-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_cart</span>
              {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-surface text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
            </button>
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border-light">
        <div className="max-w-[1440px] mx-auto px-6 h-11 flex items-center gap-1 overflow-x-auto">
          {['All Items', 'GPT Agents', 'Voice AI', 'Image Gen', 'RAG Pipelines', 'Workflow', 'Analytics', 'Fine-tuning', 'Deployment', 'Monitoring', 'Security'].map(item => {
            const linkPath = navSubLinks[item]
            const fullPath = linkPath ? `/${linkPath}` : '/'
            const isSubActive = linkPath ? location.pathname.startsWith(`/${linkPath}`) : location.pathname === '/'
            return (
              <Link key={item} to={fullPath}
                className={`text-xs font-semibold px-3 py-1.5 whitespace-nowrap transition-all rounded-md ${isSubActive ? 'bg-primary/10 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}>
                {item}
              </Link>
            )
          })}
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
