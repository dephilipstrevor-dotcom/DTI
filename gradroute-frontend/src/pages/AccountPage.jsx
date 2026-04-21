import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/common/Navbar'

const AccountPage = () => {
  const { user } = useAuth()
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savedRoutes, setSavedRoutes] = useState([])
  const [intakeData, setIntakeData] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: routesData } = await supabase
        .from('routes')
        .select('*')
        .eq('user_id', user.id)
        .eq('saved', true)
      setSavedRoutes(routesData || [])

      const { data: intake } = await supabase
        .from('intake_data')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setIntakeData(intake)
    }
    fetchUserData()
  }, [user])

  const handleResetPassword = async () => {
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    if (!error) setResetEmailSent(true)
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0F1C] pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors group mb-8">
            <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
            <span className="font-mono tracking-wider">← BACK TO DASHBOARD</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Profile</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                    <p className="text-white font-mono text-sm">{user?.email}</p>
                  </div>
                  {intakeData && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-4">CGPA</p>
                        <p className="text-white font-mono">{intakeData.cgpa}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Budget</p>
                        <p className="text-white font-mono">₹{(intakeData.budget / 100000).toFixed(1)}L</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Target Role</p>
                        <p className="text-white font-mono">{intakeData.targetRole || '—'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6 mt-6">
                <h2 className="text-lg font-bold text-white mb-4">Security</h2>
                {resetEmailSent ? (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm">Reset link sent to your email.</p>
                  </div>
                ) : (
                  <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-brand-copper/10 border border-brand-copper/30 text-brand-copper rounded-lg text-sm font-medium hover:bg-brand-copper/20 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Password Reset Email'}
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Saved Routes</h2>
                {savedRoutes.length === 0 ? (
                  <p className="text-gray-400 text-sm">No saved routes yet. Click the bookmark icon on any route card to save it.</p>
                ) : (
                  <div className="space-y-3">
                    {savedRoutes.map(route => (
                      <Link key={route.id} to={`/report/${route.id}`} className="block bg-[#0A0F1C] border border-white/5 rounded-lg p-4 hover:border-white/10 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-semibold">{route.university}</h3>
                            <p className="text-gray-400 text-xs">{route.program}</p>
                            <p className="text-gray-500 text-[10px] font-mono mt-1">{route.country}</p>
                          </div>
                          <span className={`text-sm font-mono font-bold ${route.tier === 'safe' ? 'text-green-400' : route.tier === 'moderate' ? 'text-amber-400' : 'text-red-400'}`}>
                            {route.feasibility}%
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountPage