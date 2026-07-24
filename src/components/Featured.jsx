import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/context'

export default function Featured() {
  const { t } = useLanguage()
  return (
    <section className="px-6 py-16 my-6 bg-surface-container-lowest border-y border-border-light">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 flex flex-col justify-center border border-border-light border-dashed rounded-xl p-8 bg-surface">
          <h2 className="text-[24px] font-semibold text-text-main mb-4">{t('featured.title')}</h2>
          <p className="text-[15px] text-text-muted leading-relaxed mb-8">
            {t('featured.desc')}
          </p>
          <Link to="/templates"
            className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold self-start hover:opacity-90 transition-opacity">
            {t('featured.cta')}
          </Link>
        </div>
        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <img
            src="https://picsum.photos/seed/featured-ai/800/200"
            alt={t('featured.alt')}
            className="col-span-1 sm:col-span-2 h-48 object-cover rounded-xl border border-border-light"
          />
        </div>
      </div>
    </section>
  );
}
