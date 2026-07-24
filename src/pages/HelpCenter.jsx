import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/context'

export default function HelpCenter() {
  const { t } = useLanguage()
  const faqs = t('pages.help.faqs')
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main mb-4">{t('pages.help.title')}</h1>
        <p className="text-[15px] text-text-muted leading-relaxed max-w-xl mb-12">{t('pages.help.desc')}</p>
        <div className="flex flex-col gap-4 max-w-3xl">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-surface rounded-lg border border-border-light p-4 group">
              <summary className="text-[15px] font-semibold text-text-main cursor-pointer list-none flex justify-between items-center">
                {faq.q}
                <span className="material-symbols-outlined text-text-muted transition-transform group-open:rotate-180" style={{ fontSize: 20 }}>expand_more</span>
              </summary>
              <p className="text-[14px] text-text-muted mt-3 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 p-6 bg-surface rounded-xl border border-border-light max-w-3xl">
          <h2 className="text-[18px] font-semibold text-text-main mb-2">{t('pages.help.contactTitle')}</h2>
          <p className="text-[14px] text-text-muted mb-4">{t('pages.help.contactDesc')}</p>
          <a href="mailto:support@aiagents.market" className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold inline-block hover:opacity-90 transition-opacity">{t('pages.help.contactCTA')}</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
