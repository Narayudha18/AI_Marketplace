import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../CartContext'
import CartDrawer from './CartDrawer'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const navSubLinks = {
  'All Items': '',
  'GPT Agents': 'chatbots',
  'Voice AI': 'ai-tools/c/audio-speech',
  'Image Gen': 'ai-tools/c/image-gen',
  'RAG Pipelines': 'integrations',
  'Workflow': 'automation',
  'Analytics': 'templates',
  'Fine-tuning': 'ai-tools',
  'Deployment': 'templates',
  'Monitoring': 'integrations',
  'Security': 'templates',
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
      <div className="bg-primary text-on-primary px-6 py-3 text-center text-xs font-semibold flex justify-center items-center gap-4">
        <span>All-in-one AI agent marketplace. Deploy, integrate & scale intelligent automation.</span>
        <Link to="/templates" className="bg-text-main text-surface px-5 py-1.5 rounded text-xs font-semibold hover:opacity-90 transition-opacity">Explore Now</Link>
      </div>

      <header className="bg-text-main flex flex-col w-full border-b border-outline-variant">
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

        <div className="px-6 h-12 flex items-center justify-between border-t border-outline">
          <nav className="flex h-full">
            {[
              { to: '/', label: 'AI Agents' },
              { to: '/templates', label: 'Templates' },
              { to: '/integrations', label: 'Integrations' },
              { to: '/chatbots', label: 'Chatbots' },
              { to: '/automation', label: 'Automation' },
              { to: '/ai-tools', label: 'AI Tools & APIs' },
            ].map(link => (
              <Link key={link.to} to={link.to}
                className={`text-xs font-semibold flex items-center px-4 ${isActive(link.to) ? 'text-primary border-b-2 border-primary pb-1' : 'text-surface-variant hover:text-surface transition-colors'}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="bg-surface-variant text-text-main px-4 py-1.5 rounded-t text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>smart_toy</span>
            aiagents.market
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border-light hidden md:flex px-6 h-12 gap-6 overflow-x-auto">
        {['All Items', 'GPT Agents', 'Voice AI', 'Image Gen', 'RAG Pipelines', 'Workflow', 'Analytics', 'Fine-tuning', 'Deployment', 'Monitoring', 'Security'].map(item => {
          const linkPath = navSubLinks[item]
          const fullPath = linkPath ? `/${linkPath}` : '/'
          const isSubActive = linkPath ? location.pathname.startsWith(`/${linkPath}`) : location.pathname === '/'
          return (
            <Link key={item} to={fullPath}
              className={`text-xs font-semibold flex items-center px-4 whitespace-nowrap ${isSubActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
              {item}
            </Link>
          )
        })}
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
