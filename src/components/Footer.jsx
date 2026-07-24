import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/context'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-text-main text-surface w-full py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-outline">
      <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
        <span className="text-xl font-bold text-surface tracking-tight">{t('nav.brand')}</span>
        <p className="text-[15px] text-secondary-fixed-dim mt-4 leading-relaxed">
          {t('footer.copyright')}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">{t('footer.marketplace')}</h4>
        <Link to="/terms" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('footer.terms')}</Link>
        <Link to="/licenses" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('footer.licenses')}</Link>
        <Link to="/api" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('footer.api')}</Link>
        <Link to="/privacy" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('footer.privacy')}</Link>
      </div>
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-semibold text-surface font-bold uppercase tracking-wider mb-2">{t('footer.help')}</h4>
        <Link to="/help" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('footer.helpCenter')}</Link>
        <Link to="/authors" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('footer.authors')}</Link>
        <Link to="/sitemap" className="text-[15px] text-secondary-fixed-dim hover:text-surface hover:underline decoration-primary transition-colors">{t('footer.sitemap')}</Link>
      </div>
      <div className="col-span-2 md:col-span-1 flex flex-col gap-6 justify-end items-start md:items-end mt-8 md:mt-0">
        <div className="text-left md:text-right">
          <div className="text-[24px] font-semibold text-surface mb-1">2,431,179</div>
          <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">{t('footer.agentsDeployed')}</div>
        </div>
        <div className="text-left md:text-right">
          <div className="text-[24px] font-semibold text-surface mb-1">$340,315,721</div>
          <div className="text-[11px] font-medium text-secondary-fixed-dim uppercase tracking-wider">{t('footer.communityEarnings')}</div>
        </div>
      </div>
    </footer>
  );
}
