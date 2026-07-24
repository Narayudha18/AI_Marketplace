import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/context'

export default function Terms() {
  const { t } = useLanguage()
  const sections = t('pages.terms.sections')
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main mb-8">{t('pages.terms.title')}</h1>
        <div className="flex flex-col gap-6 text-[15px] text-text-muted leading-relaxed max-w-3xl">
          <p>{t('pages.terms.lastUpdated')}</p>
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-[20px] font-semibold text-text-main mt-4">{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
