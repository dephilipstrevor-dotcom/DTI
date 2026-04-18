import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'  // ✅ FIXED PATH
import SocialAuth from './SocialAuth'

const LoginForm = ({ onToggle }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/intake')
    }
  }

  return (
    <div className="w-full">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-slate transition-all duration-200 group mb-4">
        <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
        <span>Back to home</span>
      </Link>

      <div className="bg-[#111827] border border-white/10 rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] p-6 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to access your precision routes</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-600" placeholder="you@example.com" required disabled={loading} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-600" placeholder="••••••••" required disabled={loading} />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-transparent text-brand-copper focus:ring-brand-copper/20" disabled={loading} />
              <span className="text-xs text-gray-400">Remember for 30 days</span>
            </label>
            <Link to="/forgot-password" className="text-xs font-medium text-brand-copper hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-brand-copper to-orange-500 text-white font-bold rounded-lg transition-all duration-200 shadow-[0_8px_20px_rgba(224,93,54,0.3)] hover:shadow-[0_12px_30px_rgba(224,93,54,0.5)] hover:-translate-y-0.5 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <SocialAuth />

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <span className="flex items-center gap-1"><i className="fa-regular fa-clock text-xs"></i> 2 min</span>
          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
          <span>No spam</span>
          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
          <span>Instant results</span>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          New to GradRoute?{' '}
          <button onClick={onToggle} className="text-brand-copper font-bold hover:underline">Create an account</button>
        </p>
      </div>
    </div>
  )
}

export default LoginForm