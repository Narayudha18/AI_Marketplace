import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-6 py-16 flex flex-col items-center">
        <div className="w-full max-w-md bg-surface border border-border-light rounded-xl p-8">
          <h1 className="text-2xl font-bold text-text-main text-center mb-1">Create Account</h1>
          <p className="text-sm text-text-muted text-center mb-8">Join the AI Agents Marketplace</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-main">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-main">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-main">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-main">Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <button type="submit"
              className="w-full bg-primary text-surface text-sm font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity">Create Account</button>
          </form>

          <p className="text-sm text-text-muted text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
