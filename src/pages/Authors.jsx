import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/context'

export default function Authors() {
  const { t } = useLanguage()
  const steps = t('pages.authors.steps')
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main mb-4">{t('pages.authors.title')}</h1>
        <p className="text-[15px] text-text-muted leading-relaxed max-w-xl mb-12">{t('pages.authors.desc')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mb-12">
          {steps.map(s => (
            <div key={s.title} className="bg-surface rounded-xl border border-border-light p-6 flex gap-4 shadow-sm">
              <span className="material-symbols-outlined text-primary-container text-[28px]">{s.icon}</span>
              <div>
                <h3 className="text-[16px] font-semibold text-text-main mb-1">{s.title}</h3>
                <p className="text-[13px] text-text-muted leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 bg-primary-container/10 rounded-xl border border-primary-container/20 max-w-3xl">
          <h2 className="text-[18px] font-semibold text-text-main mb-2">{t('pages.authors.benefitsTitle')}</h2>
          <ul className="text-[14px] text-text-muted leading-relaxed flex flex-col gap-2 mt-3">
            {t('pages.authors.benefits').map((b, i) => (
              <li key={i} className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span> {b}</li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
