import { Link } from 'react-router-dom'
import { ALL_SEED_PRODUCTS } from '../data/seed-sellers'

export default function Footer() {
  const sellerProducts = (() => { try { return JSON.parse(localStorage.getItem('seller_products') || '[]') } catch { return [] } })()
  const totalProducts = ALL_SEED_PRODUCTS.length + sellerProducts.length
  const totalSales = ALL_SEED_PRODUCTS.reduce((s, p) => s + (p.sales || 0), 0) + sellerProducts.reduce((s, p) => s + (p.sales || 0), 0)

  return (
    <footer className="w-full border-t border-dashed border-[var(--color-border-light)] bg-text-main text-surface px-6 py-14">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <span className="text-2xl font-medium lowercase tracking-tight">
              aiagents<span className="text-[var(--color-primary)]">.</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed text-secondary-fixed-dim">
              &copy; 2026 AI Agents Marketplace. All rights reserved. {totalProducts}+ products available.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-secondary-fixed-dim">
                Marketplace
              </h4>
              <Link to="/terms" className="text-sm transition-colors hover:text-[var(--color-primary)]">Terms</Link>
              <Link to="/licenses" className="text-sm transition-colors hover:text-[var(--color-primary)]">Licenses</Link>
              <Link to="/api" className="text-sm transition-colors hover:text-[var(--color-primary)]">API</Link>
              <Link to="/privacy" className="text-sm transition-colors hover:text-[var(--color-primary)]">Privacy</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-secondary-fixed-dim">
                Help
              </h4>
              <Link to="/help" className="text-sm transition-colors hover:text-[var(--color-primary)]">Help Center</Link>
              <Link to="/authors" className="text-sm transition-colors hover:text-[var(--color-primary)]">Authors</Link>
              <Link to="/sitemap" className="text-sm transition-colors hover:text-[var(--color-primary)]">Sitemap</Link>
            </div>
            <div className="col-span-2 flex flex-col justify-end gap-6 sm:col-span-2 sm:flex-row sm:items-end sm:justify-end">
              <div>
                <div className="text-2xl font-medium">{totalProducts.toLocaleString()}</div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-secondary-fixed-dim">
                  Products Listed
                </div>
              </div>
              <div>
                <div className="text-2xl font-medium">{totalSales.toLocaleString()}</div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-secondary-fixed-dim">
                  Products Sold
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}