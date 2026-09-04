import { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Agentation } from 'agentation'
import Navbar from './components/Navbar'
import RecommendationAssistant from './components/RecommendationAssistant'
import ErrorBoundary from './components/ErrorBoundary'
import Hero from './components/Hero'
import Categories from './components/Categories'
import ProductGrid from './components/ProductGrid'
import Featured from './components/Featured'
import BigCTA from './components/BigCTA'
import FavoriteRecommendations from './components/FavoriteRecommendations'
import Footer from './components/Footer'
import Preloader from './components/Preloader'

const SearchPage = lazy(() => import('./pages/SearchPage'))
const Templates = lazy(() => import('./pages/Templates'))
const Integrations = lazy(() => import('./pages/Integrations'))
const Chatbots = lazy(() => import('./pages/Chatbots'))
const Automation = lazy(() => import('./pages/Automation'))
const AiTools = lazy(() => import('./pages/AiTools'))
const VoiceAI = lazy(() => import('./pages/VoiceAI'))
const ImageGen = lazy(() => import('./pages/ImageGen'))
const Analytics = lazy(() => import('./pages/Analytics'))
const FineTuning = lazy(() => import('./pages/FineTuning'))
const Monitoring = lazy(() => import('./pages/Monitoring'))
const Security = lazy(() => import('./pages/Security'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const WorkflowsPage = lazy(() => import('./pages/WorkflowsPage'))
const AgentsPage = lazy(() => import('./pages/AgentsPage'))
const PromptsPage = lazy(() => import('./pages/PromptsPage'))
const TokensPage = lazy(() => import('./pages/TokensPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const CategoryListing = lazy(() => import('./pages/CategoryListing'))
const ProductGallery = lazy(() => import('./pages/ProductGallery'))
const StartSelling = lazy(() => import('./pages/StartSelling'))
const Terms = lazy(() => import('./pages/Terms'))
const Licenses = lazy(() => import('./pages/Licenses'))
const ApiDocs = lazy(() => import('./pages/ApiDocs'))
const Privacy = lazy(() => import('./pages/Privacy'))
const HelpCenter = lazy(() => import('./pages/HelpCenter'))
const Authors = lazy(() => import('./pages/Authors'))
const Sitemap = lazy(() => import('./pages/Sitemap'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const CartPage = lazy(() => import('./pages/CartPage'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const Favorites = lazy(() => import('./pages/Favorites'))
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const SellerStore = lazy(() => import('./pages/SellerStore'))

const AdminSellerPreview = lazy(() => import('./pages/AdminPreview').then(m => ({ default: m.AdminSellerPreview })))
const AdminProductPreview = lazy(() => import('./pages/AdminPreview').then(m => ({ default: m.AdminProductPreview })))

function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto pb-16">
        <Hero />
        <Categories />
        <Featured />
        <ProductGrid />
        <BigCTA />
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
    <>
      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
      <Preloader />
      <ErrorBoundary>
      <Suspense fallback={null}>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchPage />} />
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
      <Route path="/ai-skills" element={<SkillsPage />} />
      <Route path="/ai-skills/c/:filter" element={<CategoryListing />} />
      <Route path="/ai-skills/:slug" element={<ProductDetail />} />
      <Route path="/ai-workflows" element={<WorkflowsPage />} />
      <Route path="/ai-workflows/c/:filter" element={<CategoryListing />} />
      <Route path="/ai-workflows/:slug" element={<ProductDetail />} />
      <Route path="/ai-agents" element={<AgentsPage />} />
      <Route path="/ai-agents/c/:filter" element={<CategoryListing />} />
      <Route path="/ai-agents/:slug" element={<ProductDetail />} />
      <Route path="/ai-prompts" element={<PromptsPage />} />
      <Route path="/ai-prompts/c/:filter" element={<CategoryListing />} />
      <Route path="/ai-prompts/:slug" element={<ProductDetail />} />
      <Route path="/ai-tokens" element={<TokensPage />} />
      <Route path="/ai-tokens/c/:filter" element={<CategoryListing />} />
      <Route path="/ai-tokens/:slug" element={<ProductDetail />} />
      <Route path="/:category/:slug/preview" element={<ProductGallery />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/preview/seller/:sellerId" element={<AdminSellerPreview />} />
      <Route path="/admin/preview/product/:productId" element={<AdminProductPreview />} />
      <Route path="/seller/:sellerId" element={<SellerStore />} />
    </Routes>
    </Suspense>
    </ErrorBoundary>
    <RecommendationAssistant />
    </>
  );
}
