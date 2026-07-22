import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useCart } from '../CartContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Profile() {
  const { currentUser } = useAuth()
  const { cart, purchased, favorites } = useCart()

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <main className="w-full max-w-[1440px] mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-text-main mb-4">Sign in required</h1>
          <p className="text-text-muted mb-6">Please sign in to view your profile.</p>
          <Link to="/login" className="bg-primary text-surface px-6 py-2.5 rounded-lg text-sm font-bold inline-block hover:opacity-90 transition-opacity">Sign In</Link>
        </main>
        <Footer />
      </>
    )
  }

  const stats = [
    { label: 'In Cart', value: cart.length, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Purchased', value: purchased.length, color: 'bg-green-500/10 text-green-500' },
    { label: 'Favorites', value: favorites.length, color: 'bg-red-500/10 text-red-500' },
  ]

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-surface border border-border-light rounded-xl p-8">
            <div className="flex items-center gap-5 pb-6 border-b border-border-light">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0">
                {currentUser.name ? currentUser.name[0].toUpperCase() : '?'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-main">{currentUser.name}</h1>
                <p className="text-sm text-text-muted mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {stats.map(s => (
                <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs font-medium mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-surface border border-border-light rounded-xl p-6">
            <h2 className="text-sm font-bold text-text-main mb-4">Account Details</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border-light">
                <span className="text-text-muted">Name</span>
                <span className="text-text-main font-medium">{currentUser.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border-light">
                <span className="text-text-muted">Email</span>
                <span className="text-text-main font-medium">{currentUser.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-muted">Provider</span>
                <span className="text-text-main font-medium capitalize">{currentUser.provider || 'email'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
