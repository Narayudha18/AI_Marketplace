import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/context'

export default function Licenses() {
  const { t } = useLanguage()
  const licenses = [
    { name: t('pages.licenses.regular'), price: t('pages.licenses.included'), desc: t('pages.licenses.regularDesc'), icon: 'person' },
    { name: t('pages.licenses.extended'), price: t('pages.licenses.fromPrice'), desc: t('pages.licenses.extendedDesc'), icon: 'business' },
    { name: t('pages.licenses.enterprise'), price: t('pages.licenses.custom'), desc: t('pages.licenses.enterpriseDesc'), icon: 'enterprise' },
  ]
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main mb-4">{t('pages.licenses.title')}</h1>
        <p className="text-[15px] text-text-muted leading-relaxed max-w-xl mb-12">{t('pages.licenses.desc')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          {licenses.map(l => (
            <div key={l.name} className="bg-surface rounded-xl border border-border-light p-6 flex flex-col gap-4 shadow-sm">
              <span className="material-symbols-outlined text-primary-container text-[32px]">{l.icon}</span>
              <h3 className="text-[18px] font-semibold text-text-main">{l.name}</h3>
              <p className="text-[13px] text-text-muted leading-relaxed">{l.desc}</p>
              <div className="mt-auto pt-4 border-t border-border-light">
                <span className="text-[20px] font-bold text-text-main">{l.price}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
