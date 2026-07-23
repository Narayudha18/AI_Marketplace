import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../CartContext'
import CartDrawer from '../components/CartDrawer'
import AuthButton from '../components/AuthButton'
import { useTheme } from '../ThemeContext'
import SellerForm from '../components/SellerForm'

export default function StartSelling() {
  const { totalItems } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const location = useLocation()

  return (
    <>
      <div className="bg-gradient-to-r from-primary-container to-blue-600 text-on-primary-container px-6 py-2.5 text-center text-xs font-semibold">
        <span>Start selling your AI products on the largest AI marketplace.</span>
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
              const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
              return (
                <Link key={link.to} to={link.to} state={{ skipScroll: true }}
                  className={`text-xs font-semibold px-3 py-2 rounded-md transition-all relative ${isActive ? 'text-primary' : 'text-surface-variant hover:text-surface'}`}>
                  {link.label}
                  {isActive && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/start-selling" className="text-primary text-xs font-semibold">Start Selling</Link>
            <button onClick={() => setCartOpen(true)} className="relative text-surface-variant hover:text-surface transition-colors cursor-pointer p-1.5 flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_cart</span>
              {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-surface text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
            </button>
            <button onClick={toggle} className="text-surface-variant hover:text-surface transition-colors cursor-pointer p-1.5 flex items-center justify-center"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>{dark ? 'light_mode' : 'dark_mode'}</span></button>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1200px] mx-auto pb-16">
        {/* Hero Section */}
        <section className="px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-primary-container/10 text-primary px-4 py-1.5 rounded-full text-[11px] font-semibold w-fit">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>rocket_launch</span>
              New Seller Registration
            </div>
            <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main">
              Sell Your AI Products to Thousands of Buyers
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              Join thousands of AI creators. Market your templates, chatbots, integrations, tools, and automation solutions on the largest AI marketplace.
            </p>
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>check_circle</span>
                <span className="text-xs font-medium text-text-muted">Free to register</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>check_circle</span>
                <span className="text-xs font-medium text-text-muted">10% commission</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>check_circle</span>
                <span className="text-xs font-medium text-text-muted">Verified within 24 hours</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative h-[320px]">
            <img
              src="https://picsum.photos/seed/start-selling-hero/600/320"
              alt="Start Selling"
              className="w-full h-full object-cover rounded-2xl border border-border-light"
            />
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '12,430+', label: 'Products Listed', icon: 'inventory_2' },
              { value: '89,450+', label: 'Products Sold', icon: 'trending_up' },
              { value: '3,200+', label: 'Active Sellers', icon: 'groups' },
              { value: '4.8/5', label: 'Avg. Rating', icon: 'star' },
            ].map(stat => (
              <div key={stat.label} className="bg-surface rounded-xl border border-border-light p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 22 }}>{stat.icon}</span>
                </div>
                <div>
                  <p className="text-[20px] font-bold text-text-main">{stat.value}</p>
                  <p className="text-[11px] font-medium text-text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form + Sidebar */}
        <section className="px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form — 2/3 */}
            <div className="w-full lg:w-2/3">
              <div className="bg-surface rounded-xl border border-border-light p-6 md:p-8">
                <h2 className="text-[24px] font-semibold text-text-main mb-1">Seller Registration Form</h2>
                <p className="text-xs text-text-muted mb-8">Fill in your details and store info to start selling.</p>
                <SellerForm />
              </div>
            </div>

            {/* Sidebar — 1/3 (per NEW_DESIGN.md layout) */}
            <aside className="w-full lg:w-1/3">
              <div className="sticky top-4 space-y-6">
                {/* Benefit Card */}
                <div className="bg-surface rounded-xl border border-border-light p-6">
                  <h3 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>emoji_events</span>
                    Benefits of Selling
                  </h3>
                  <ul className="space-y-3">
                    {[
                      { icon: 'public', title: 'Wide Reach', desc: 'Thousands of potential buyers every day' },
                      { icon: 'percent', title: 'Low Commission', desc: 'Only 10% per transaction' },
                      { icon: 'payments', title: 'Fast Payouts', desc: 'Weekly payouts to your account' },
                      { icon: 'support', title: 'Full Support', desc: 'Our team helps with verification & listing' },
                    ].map(item => (
                      <li key={item.title} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary-container flex-shrink-0" style={{ fontSize: 18 }}>{item.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-text-main">{item.title}</p>
                          <p className="text-[11px] text-text-muted">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step Guide */}
                <div className="bg-surface rounded-xl border border-border-light p-6">
                  <h3 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>guide</span>
                    How to Sell
                  </h3>
                  <ol className="space-y-4">
                    {[
                      { num: 1, title: 'Register Account', desc: 'Fill in your details and verify identity' },
                      { num: 2, title: 'Create Store', desc: 'Set your store name & product categories' },
                      { num: 3, title: 'Upload Products', desc: 'Add the AI products you want to sell' },
                      { num: 4, title: 'Start Selling', desc: 'Your products go live and ready for buyers' },
                    ].map(step => (
                      <li key={step.num} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                          {step.num}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-main">{step.title}</p>
                          <p className="text-[11px] text-text-muted">{step.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* FAQ Note */}
                <div className="bg-primary-container/5 rounded-xl border border-primary-container/20 p-5">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary-container flex-shrink-0" style={{ fontSize: 20 }}>help</span>
                    <div>
                      <p className="text-xs font-semibold text-text-main mb-1">Need help?</p>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        Contact our team at <span className="text-primary font-medium hover:underline cursor-pointer">seller@aiagents.com</span> or check the <span className="text-primary font-medium hover:underline cursor-pointer">Seller Guide</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="bg-text-main text-surface w-full py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-outline">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <span className="text-xl font-bold text-surface tracking-tight">AIAgents</span>
          <p className="text-[15px] text-secondary-fixed-dim mt-4 leading-relaxed">
            &copy; 2026 AI Agents Marketplace. All rights reserved. 12k+ products available.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">Marketplace</h4>
          <Link to="/terms" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Terms</Link>
          <Link to="/licenses" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Licenses</Link>
          <Link to="/api" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">API</Link>
          <Link to="/privacy" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Privacy</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">Sell</h4>
          <Link to="/start-selling" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Start Selling</Link>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Seller Guide</a>
          <a className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors" href="#">Pricing</a>
        </div>
        <div className="col-span-2 md:col-span-1 flex flex-col gap-6 justify-end items-start md:items-end mt-8 md:mt-0">
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">3,200+</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Active Sellers</div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-[24px] font-semibold text-surface mb-1">89,450</div>
            <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Products Sold</div>
          </div>
        </div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
