import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/context'

export default function Terms() {
  const { t } = useLanguage()
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main mb-8">{t('pages.terms.title')}</h1>
        <div className="flex flex-col gap-6 text-[15px] text-text-muted leading-relaxed max-w-3xl">
          <p>{t('pages.terms.lastUpdated')}</p>
          <h2 className="text-[20px] font-semibold text-text-main mt-4">1. Acceptance of Terms</h2>
          <p>By creating an account, purchasing, or listing any product on AI Agents Marketplace, you acknowledge that you have read, understood, and agree to be bound by these terms.</p>
          <h2 className="text-[20px] font-semibold text-text-main mt-4">2. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.</p>
          <h2 className="text-[20px] font-semibold text-text-main mt-4">3. Listings & Purchases</h2>
          <p>Sellers are responsible for the accuracy of their product listings. All purchases are final unless otherwise stated in our refund policy. Prices are in USD and do not include applicable taxes.</p>
          <h2 className="text-[20px] font-semibold text-text-main mt-4">4. Intellectual Property</h2>
          <p>Products listed on our marketplace remain the intellectual property of their respective sellers. Buyers receive a license to use the product as specified in the listing.</p>
          <h2 className="text-[20px] font-semibold text-text-main mt-4">5. Limitation of Liability</h2>
          <p>AI Agents Marketplace acts as a中介 platform and is not liable for disputes between buyers and sellers. We reserve the right to remove listings or suspend accounts that violate our policies.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
