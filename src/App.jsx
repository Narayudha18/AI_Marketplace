import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import ProductGrid from './components/ProductGrid'
import Featured from './components/Featured'
import FavoriteRecommendations from './components/FavoriteRecommendations'
import Footer from './components/Footer'
import Templates from './pages/Templates'
import Integrations from './pages/Integrations'
import Chatbots from './pages/Chatbots'
import Automation from './pages/Automation'
import AiTools from './pages/AiTools'
import ProductDetail from './pages/ProductDetail'
import CategoryListing from './pages/CategoryListing'
import ProductGallery from './pages/ProductGallery'
import StartSelling from './pages/StartSelling'
import Terms from './pages/Terms'
import Licenses from './pages/Licenses'
import ApiDocs from './pages/ApiDocs'
import Privacy from './pages/Privacy'
import HelpCenter from './pages/HelpCenter'
import Authors from './pages/Authors'
import Sitemap from './pages/Sitemap'
import VoiceAI from './pages/VoiceAI'
import ImageGen from './pages/ImageGen'
import Analytics from './pages/Analytics'
import FineTuning from './pages/FineTuning'
import Monitoring from './pages/Monitoring'
import Security from './pages/Security'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto pb-16">
        <Hero />
        <Categories />
        <ProductGrid />
        <Featured />
        <FavoriteRecommendations />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
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
      <Route path="/start-selling" element={<StartSelling />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/licenses" element={<Licenses />} />
      <Route path="/api" element={<ApiDocs />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/authors" element={<Authors />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/voice-ai" element={<VoiceAI />} />
      <Route path="/voice-ai/c/:filter" element={<CategoryListing />} />
      <Route path="/voice-ai/:slug" element={<ProductDetail />} />
      <Route path="/image-gen" element={<ImageGen />} />
      <Route path="/image-gen/c/:filter" element={<CategoryListing />} />
      <Route path="/image-gen/:slug" element={<ProductDetail />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/analytics/c/:filter" element={<CategoryListing />} />
      <Route path="/analytics/:slug" element={<ProductDetail />} />
      <Route path="/fine-tuning" element={<FineTuning />} />
      <Route path="/fine-tuning/c/:filter" element={<CategoryListing />} />
      <Route path="/fine-tuning/:slug" element={<ProductDetail />} />
      <Route path="/monitoring" element={<Monitoring />} />
      <Route path="/monitoring/c/:filter" element={<CategoryListing />} />
      <Route path="/monitoring/:slug" element={<ProductDetail />} />
      <Route path="/security" element={<Security />} />
      <Route path="/:category/:slug/preview" element={<ProductGallery />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
