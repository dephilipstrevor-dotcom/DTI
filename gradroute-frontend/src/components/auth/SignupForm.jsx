import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'  // ✅ FIXED PATH
import SocialAuth from './SocialAuth'

const SignupForm = ({ onToggle }) => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    // If email confirmation is on, session will be null and the user must confirm via email.
    if (data.session) {
      navigate('/intake')
    } else {
      setError('Account created. Check your inbox for the confirmation email, then sign in. (Tip: disable "Confirm email" in Supabase → Authentication → Providers → Email for dev.)')
      setLoading(false)
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
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Get started</h1>
          <p className="text-gray-400 text-sm">Create your free account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-600" placeholder="John Doe" required disabled={loading} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-600" placeholder="you@example.com" required disabled={loading} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-600" placeholder="Create a strong password" required disabled={loading} />
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-600 bg-transparent text-brand-copper focus:ring-brand-copper/20" required disabled={loading} />
            <span className="text-xs text-gray-400">I agree to the <a href="/terms" className="text-brand-copper hover:underline">Terms</a> and <a href="/privacy" className="text-brand-copper hover:underline">Privacy</a></span>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-brand-copper to-orange-500 text-white font-bold rounded-lg transition-all duration-200 shadow-[0_8px_20px_rgba(224,93,54,0.3)] hover:shadow-[0_12px_30px_rgba(224,93,54,0.5)] hover:-translate-y-0.5 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating account...' : 'Create Account'}
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
          Already have an account?{' '}
          <button onClick={onToggle} className="text-brand-copper font-bold hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  )
}

export default SignupForm