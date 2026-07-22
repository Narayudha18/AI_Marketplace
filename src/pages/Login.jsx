import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16 flex flex-col items-center">
        <div className="w-full max-w-md bg-surface border border-border-light rounded-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-primary text-lg font-bold">AI</span>
            </div>
            <h1 className="text-xl font-bold text-text-main">Sign in</h1>
            <p className="text-sm text-text-muted mt-1">to continue to AI Agents</p>
          </div>

          <button
            className="w-full flex items-center justify-center gap-3 border border-border-light rounded-lg py-2.5 text-sm font-medium text-text-main hover:bg-surface-container-low transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign in with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border-light" />
            <span className="text-xs text-text-muted">or</span>
            <div className="flex-1 h-px bg-border-light" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
                <input type="checkbox" className="accent-primary" />
                Show password
              </label>
              <Link to="/" className="text-xs text-primary font-medium hover:underline">Forgot password?</Link>
            </div>
            <button type="submit"
              className="w-full bg-primary text-surface text-sm font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity mt-1">Next</button>
          </form>
        </div>

        <div className="w-full max-w-md mt-4 text-center">
          <p className="text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
          </p>
        </div>

        <div className="w-full max-w-md mt-8 flex items-center justify-center gap-6 text-xs text-text-muted">
          <Link to="/" className="hover:text-text-main transition-colors">Help</Link>
          <Link to="/privacy" className="hover:text-text-main transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-text-main transition-colors">Terms</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
