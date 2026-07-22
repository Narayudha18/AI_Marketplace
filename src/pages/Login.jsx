import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../AuthContext'

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const result = login(email, password)
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
            <h1 className="text-lg font-bold text-text-main">Sign in</h1>
            <p className="text-xs text-text-muted mt-0.5">to continue to AI Agents</p>
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
              onError={() => setError('Google sign in failed')}
              size="large"
              shape="rectangular"
              width="100%"
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
              <label className="text-xs font-medium text-text-muted">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-3 py-2 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-text-muted">Password</label>
                <Link to="/" className="text-xs text-primary font-medium hover:underline">Forgot?</Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                className="w-full px-3 py-2 text-sm bg-surface-container-low border border-border-light rounded-lg text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
            <button type="submit"
              className="w-full bg-primary text-surface text-sm font-bold py-2 rounded-lg hover:opacity-90 transition-opacity">Next</button>
          </form>
        </div>

        <div className="mt-3 text-center">
          <p className="text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}