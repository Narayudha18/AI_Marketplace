import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-text-main text-surface w-full py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-outline">
      <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
        <span className="text-xl font-bold text-surface tracking-tight">AIAgents</span>
        <p className="text-[15px] text-secondary-fixed-dim mt-4 leading-relaxed">
          &copy; 2026 AI Agents Marketplace. All rights reserved. Platform stats: 2.4M agents deployed | $340M community earnings
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
        <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">Help</h4>
        <Link to="/help" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Help Center</Link>
        <Link to="/authors" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Authors</Link>
        <Link to="/sitemap" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">Sitemap</Link>
      </div>
      <div className="col-span-2 md:col-span-1 flex flex-col gap-6 justify-end items-start md:items-end mt-8 md:mt-0">
        <div className="text-left md:text-right">
          <div className="text-[24px] font-semibold text-surface mb-1">2,431,179</div>
          <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Agents Deployed</div>
        </div>
        <div className="text-left md:text-right">
          <div className="text-[24px] font-semibold text-surface mb-1">$340,315,721</div>
          <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">Community Earnings</div>
        </div>
      </div>
    </footer>
  );
}
