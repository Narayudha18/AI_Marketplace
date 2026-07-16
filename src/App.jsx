import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import ProductGrid from './components/ProductGrid'
import Featured from './components/Featured'
import Footer from './components/Footer'
import Templates from './pages/Templates'
import Integrations from './pages/Integrations'
import Chatbots from './pages/Chatbots'
import Automation from './pages/Automation'
import AiTools from './pages/AiTools'
import ProductDetail from './pages/ProductDetail'
import CategoryListing from './pages/CategoryListing'

function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto pb-16">
        <Hero />
        <Categories />
        <ProductGrid />
        <Featured />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/templates/c/:filter" element={<CategoryListing />} />
      <Route path="/templates/:slug" element={<ProductDetail />} />
      <Route path="/integrations" element={<Integrations />} />
      <Route path="/integrations/c/:filter" element={<CategoryListing />} />
      <Route path="/integrations/:slug" element={<ProductDetail />} />
      <Route path="/chatbots" element={<Chatbots />} />
      <Route path="/chatbots/c/:filter" element={<CategoryListing />} />
      <Route path="/chatbots/:slug" element={<ProductDetail />} />
      <Route path="/automation" element={<Automation />} />
      <Route path="/automation/c/:filter" element={<CategoryListing />} />
      <Route path="/automation/:slug" element={<ProductDetail />} />
      <Route path="/ai-tools" element={<AiTools />} />
      <Route path="/ai-tools/c/:filter" element={<CategoryListing />} />
      <Route path="/ai-tools/:slug" element={<ProductDetail />} />
    </Routes>
  );
}
