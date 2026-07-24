import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function HelpCenter() {
  const faqs = [
    { q: 'How do I purchase a product?', a: 'Browse the marketplace, click on a product to view details, then click "Add to Cart". Proceed to checkout and complete payment.' },
    { q: 'How do I become a seller?', a: 'Click "Start Selling" in the navigation bar, fill out the registration form, and submit your application.' },
    { q: 'What payment methods are accepted?', a: 'We accept QRIS, DANA, GoPay, ShopeePay, OVO, LinkAja, and bank transfer (BCA, Mandiri, BNI, BRI).' },
    { q: 'How do I get a refund?', a: 'Refunds are handled on a case-by-case basis. Contact our support team within 14 days of purchase.' },
    { q: 'How are disputes resolved?', a: 'If you have an issue with a purchase, please contact our support team and we will mediate between you and the seller.' },
  ]
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main mb-4">Help Center</h1>
        <p className="text-[15px] text-text-muted leading-relaxed max-w-xl mb-12">Find answers to common questions or reach out to our support team.</p>
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
          <h2 className="text-[18px] font-semibold text-text-main mb-2">Still need help?</h2>
          <p className="text-[14px] text-text-muted mb-4">Contact our support team and we'll get back to you within 24 hours.</p>
          <a href="mailto:support@aiagents.market" className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold inline-block hover:opacity-90 transition-opacity">Email Support</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
