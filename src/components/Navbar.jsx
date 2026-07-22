import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../CartContext'
import CartDrawer from './CartDrawer'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const navSubLinks = {
  'All Items': { path: '', icon: 'apps' },
  'GPT Agents': { path: 'chatbots', icon: 'smart_toy' },
  'Voice AI': { path: 'voice-ai', icon: 'record_voice_over' },
  'Image Gen': { path: 'image-gen', icon: 'image' },
  'RAG Pipelines': { path: 'integrations', icon: 'layers' },
  'Workflow': { path: 'automation', icon: 'sync_alt' },
  'Analytics': { path: 'analytics', icon: 'analytics' },
  'Fine-tuning': { path: 'fine-tuning', icon: 'tune' },
  'Deployment': { path: 'templates', icon: 'cloud' },
  'Monitoring': { path: 'monitoring', icon: 'monitoring' },
  'Security': { path: 'security', icon: 'security' },
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
      <div className="bg-primary-container text-on-primary-container px-6 py-3 text-center text-xs font-semibold flex justify-center items-center gap-4">
        <span>All-in-one AI agent marketplace. Deploy, integrate & scale intelligent automation.</span>
        <Link to="/templates" className="bg-text-main text-surface px-5 py-1.5 rounded text-xs font-semibold hover:opacity-90 transition-opacity">Explore Now</Link>
      </div>

      <header className="bg-text-main flex flex-col w-full">
        <div className="px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-surface tracking-tight">AIAgents</Link>
          <div className="flex items-center gap-6">
            <Link to="/start-selling" className="text-surface-variant hover:text-surface transition-colors text-xs font-semibold">Start Selling</Link>
            <div className="flex items-center gap-4 pl-4 border-l border-outline">
              <button onClick={() => setCartOpen(true)} className="relative text-surface-variant hover:text-surface transition-colors cursor-pointer">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_cart</span>
                {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 bg-primary text-surface text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
              </button>
              <Link to="/templates" className="text-surface text-xs font-semibold border border-surface px-4 py-1.5 rounded hover:bg-surface hover:text-text-main transition-colors">Sign In</Link>
            </div>
          </div>
        </div>

        <nav className="flex items-center px-6 h-12 border-t border-outline gap-1 overflow-x-auto">
          {[
            { to: '/', label: 'AI Agents', icon: 'smart_toy' },
            { to: '/templates', label: 'Templates', icon: 'dashboard' },
            { to: '/integrations', label: 'Integrations', icon: 'api' },
            { to: '/chatbots', label: 'Chatbots', icon: 'forum' },
            { to: '/automation', label: 'Automation', icon: 'sync_alt' },
            { to: '/ai-tools', label: 'AI Tools', icon: 'build' },
          ].map(link => (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded whitespace-nowrap transition-all ${isActive(link.to) ? 'bg-primary/20 text-primary' : 'text-surface-variant hover:bg-white/10 hover:text-surface'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <div className="ml-auto bg-surface-variant/20 text-surface-variant px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>smart_toy</span>
            aiagents.market
          </div>
        </nav>
      </header>

      <div className="bg-surface border-b border-border-light hidden md:flex px-6 h-12 items-center gap-1 overflow-x-auto">
        {['All Items', 'GPT Agents', 'Voice AI', 'Image Gen', 'RAG Pipelines', 'Workflow', 'Analytics', 'Fine-tuning', 'Deployment', 'Monitoring', 'Security'].map(item => {
          const linkPath = navSubLinks[item].path
          const fullPath = linkPath ? `/${linkPath}` : '/'
          const isSubActive = linkPath ? location.pathname.startsWith(`/${linkPath}`) : location.pathname === '/'
          return (
            <Link key={item} to={fullPath}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded whitespace-nowrap transition-all ${isSubActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{navSubLinks[item].icon}</span>
              {item}
            </Link>
          )
        })}
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
