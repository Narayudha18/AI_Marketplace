import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ApiDocs() {
  const endpoints = [
    { method: 'GET', path: '/api/products', desc: 'List all products with pagination and filters' },
    { method: 'GET', path: '/api/products/:slug', desc: 'Get a single product by slug' },
    { method: 'POST', path: '/api/cart', desc: 'Add item to cart' },
    { method: 'DELETE', path: '/api/cart/:id', desc: 'Remove item from cart' },
    { method: 'POST', path: '/api/checkout', desc: 'Process payment and create order' },
    { method: 'POST', path: '/api/seller/register', desc: 'Register as a seller' },
  ]
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <h1 className="text-[30px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-text-main mb-4">API Documentation</h1>
        <p className="text-[15px] text-text-muted leading-relaxed max-w-xl mb-12">Build integrations and automate workflows using our REST API. All endpoints return JSON responses.</p>
        <div className="flex flex-col gap-4 max-w-3xl">
          {endpoints.map(ep => (
            <div key={ep.path} className="bg-surface rounded-lg border border-border-light p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className={`text-[11px] font-bold uppercase px-2 py-1 rounded ${ep.method === 'GET' ? 'bg-green-100 text-green-700' : ep.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{ep.method}</span>
              <code className="text-[13px] font-mono text-text-main">{ep.path}</code>
              <span className="text-[13px] text-text-muted sm:ml-auto">{ep.desc}</span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
