import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/context'

export default function Sitemap() {
  const { t } = useLanguage()
  const sections = t('pages.sitemap.sections')
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main mb-4">{t('pages.sitemap.title')}</h1>
        <p className="text-[15px] text-text-muted leading-relaxed max-w-xl mb-12">{t('pages.sitemap.desc')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          {sections.map(s => (
            <div key={s.title}>
              <h2 className="text-[16px] font-semibold text-text-main mb-4 uppercase tracking-wider">{s.title}</h2>
              <div className="flex flex-col gap-2">
                {s.links.map(l => (
                  <Link key={l.to} to={l.to} className="text-[14px] text-primary-container hover:underline transition-colors">{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
