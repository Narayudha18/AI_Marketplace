import { Component } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error: error.message }
  }
  render() {
    if (this.state.error) {
      return <div className="min-h-screen bg-surface flex items-center justify-center p-8"><div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 max-w-lg"><h2 className="text-lg font-bold text-red-500 mb-2">Error</h2><p className="text-sm text-red-400">{this.state.error}</p></div></div>
    }
    return this.props.children
  }
}

function ProfileContent() {
  const ctx = useAuth()
  const currentUser = ctx?.currentUser

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

  const initial = currentUser.name ? currentUser.name[0].toUpperCase() : '?'

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-surface border border-border-light rounded-xl p-8">
            <div className="flex items-center gap-5 pb-6 border-b border-border-light">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0">
                {initial}
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-main">{currentUser.name || 'User'}</h1>
                <p className="text-sm text-text-muted mt-0.5">{currentUser.email || ''}</p>
              </div>
            </div>
            <div className="mt-6 text-sm text-text-main">
              <p>Welcome to your profile dashboard.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function Profile() {
  return (
    <ErrorBoundary>
      <ProfileContent />
    </ErrorBoundary>
  )
}
