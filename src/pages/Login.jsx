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
          <h1 className="text-2xl font-bold text-text-main text-center mb-1">Welcome Back</h1>
          <p className="text-sm text-text-muted text-center mb-8">Sign in to your AI Agents account</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-main">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-main">Password</label>
                <Link to="/" className="text-xs text-primary hover:underline">Forgot?</Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <button type="submit"
              className="w-full bg-primary text-surface text-sm font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity">Sign In</button>
          </form>

          <p className="text-sm text-text-muted text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
