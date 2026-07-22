import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Authors() {
  const steps = [
    { icon: 'person_add', title: 'Create Account', desc: 'Sign up as a seller with your email and profile details.' },
    { icon: 'inventory_2', title: 'List Your Product', desc: 'Upload your AI agent, template, or tool with description, pricing, and screenshots.' },
    { icon: 'verified', title: 'Get Approved', desc: 'Our team reviews your listing for quality and compliance within 48 hours.' },
    { icon: 'payments', title: 'Start Earning', desc: 'Once approved, your product is live and you earn up to 85% revenue share.' },
  ]
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main mb-4">Authors</h1>
        <p className="text-[15px] text-text-muted leading-relaxed max-w-xl mb-12">Join thousands of developers and designers selling AI agents, templates, and tools on our marketplace.</p>
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
          <h2 className="text-[18px] font-semibold text-text-main mb-2">Author Benefits</h2>
          <ul className="text-[14px] text-text-muted leading-relaxed flex flex-col gap-2 mt-3">
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span> Up to 85% revenue share on every sale</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span> Fast payouts with multiple withdrawal options</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span> Detailed sales analytics and customer insights</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span> Priority support and promotional opportunities</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
