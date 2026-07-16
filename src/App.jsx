import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import ProductGrid from './components/ProductGrid'
import Featured from './components/Featured'
import Footer from './components/Footer'

export default function App() {
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
