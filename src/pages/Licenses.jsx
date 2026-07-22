import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Licenses() {
  const licenses = [
    { name: 'Regular License', price: 'Included', desc: 'For personal or internal business use. Single end product, up to 1,000 monthly visitors or $5,000 revenue.', icon: 'person' },
    { name: 'Extended License', price: 'From $49.99', desc: 'For commercial use with revenue share. Up to 100,000 monthly visitors or $50,000 revenue.', icon: 'business' },
    { name: 'Enterprise License', price: 'Custom', desc: 'Unlimited usage, priority support, source code access, and custom modifications.', icon: 'enterprise' },
  ]
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main mb-4">Licenses</h1>
        <p className="text-[15px] text-text-muted leading-relaxed max-w-xl mb-12">Every product on AI Agents Marketplace comes with a license that defines how you can use it. Choose the one that fits your project.</p>
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
