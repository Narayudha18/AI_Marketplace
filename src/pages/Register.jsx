import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../AuthContext'

export default function Register() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    const result = register(name, email, password)
    if (result.ok) navigate('/')
    else setError(result.error)
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-surface border border-border-light rounded-xl p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-primary text-base font-bold">AI</span>
            </div>
            <h1 className="text-lg font-bold text-text-main">Create account</h1>
            <p className="text-xs text-text-muted mt-0.5">to start using AI Agents</p>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={credentialResponse => {
                const data = credentialResponse.credential
                if (data) {
                  const payload = JSON.parse(atob(data.split('.')[1]))
                  loginWithGoogle(payload)
                  navigate('/')
                }
              }}
              onError={() => setError('Google sign up failed')}
              size="large"
              shape="rectangular"
              width="100%"
              text="signup_with"
            />
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border-light" />
            <span className="text-xs text-text-muted">or</span>
            <div className="flex-1 h-px bg-border-light" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && <p className="text-xs text-red-500 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                className="w-full px-3 py-2 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-3 py-2 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                className="w-full px-3 py-2 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted">Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                className="w-full px-3 py-2 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <button type="submit"
              className="w-full bg-primary text-surface text-sm font-bold py-2 rounded-lg hover:opacity-90 transition-opacity">Create Account</button>
          </form>
        </div>

        <div className="mt-3 text-center">
          <p className="text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}