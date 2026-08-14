import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full border-t border-dashed border-[var(--color-border-light)] bg-[var(--color-inverse-surface)] px-6 py-14 text-[var(--color-inverse-on-surface)]">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <span className="text-2xl font-medium lowercase tracking-tight">
              aiagents<span className="text-[var(--color-primary)]">.</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-inverse-on-surface)]/60">
              &copy; 2026 AI Agents Marketplace. All rights reserved. Platform stats: 2.4M agents
              deployed | $340M community earnings
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-inverse-on-surface)]/60">
                Marketplace
              </h4>
              <Link to="/terms" className="text-sm transition-colors hover:text-[var(--color-primary)]">Terms</Link>
              <Link to="/licenses" className="text-sm transition-colors hover:text-[var(--color-primary)]">Licenses</Link>
              <Link to="/api" className="text-sm transition-colors hover:text-[var(--color-primary)]">API</Link>
              <Link to="/privacy" className="text-sm transition-colors hover:text-[var(--color-primary)]">Privacy</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-inverse-on-surface)]/60">
                Help
              </h4>
              <Link to="/help" className="text-sm transition-colors hover:text-[var(--color-primary)]">Help Center</Link>
              <Link to="/authors" className="text-sm transition-colors hover:text-[var(--color-primary)]">Authors</Link>
              <Link to="/sitemap" className="text-sm transition-colors hover:text-[var(--color-primary)]">Sitemap</Link>
            </div>
            <div className="col-span-2 flex flex-col justify-end gap-6 sm:col-span-2 sm:flex-row sm:items-end sm:justify-end">
              <div>
                <div className="text-2xl font-medium">2,431,179</div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-inverse-on-surface)]/60">
                  Agents Deployed
                </div>
              </div>
              <div>
                <div className="text-2xl font-medium">$340,315,721</div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-inverse-on-surface)]/60">
                  Community Earnings
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}