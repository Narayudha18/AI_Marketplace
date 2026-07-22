import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main mb-8">Privacy Policy</h1>
        <div className="flex flex-col gap-6 text-[15px] text-text-muted leading-relaxed max-w-3xl">
          <p>Last updated: July 22, 2026. Your privacy is important to us. This policy outlines how we collect, use, and protect your personal data.</p>
          <h2 className="text-[20px] font-semibold text-text-main mt-4">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, making a purchase, or listing a product — including name, email, payment details, and profile information.</p>
          <h2 className="text-[20px] font-semibold text-text-main mt-4">2. How We Use Your Data</h2>
          <p>Your data is used to process transactions, provide customer support, improve our platform, and send relevant notifications. We do not sell your personal information to third parties.</p>
          <h2 className="text-[20px] font-semibold text-text-main mt-4">3. Data Security</h2>
          <p>We implement industry-standard encryption and security measures to protect your data. Payment information is processed by PCI-compliant payment gateways.</p>
          <h2 className="text-[20px] font-semibold text-text-main mt-4">4. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting our support team.</p>
          <h2 className="text-[20px] font-semibold text-text-main mt-4">5. Contact</h2>
          <p>For privacy-related inquiries, please contact our Data Protection Officer at privacy@aiagents.market.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
