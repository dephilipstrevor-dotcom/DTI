import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import ConstraintHUD from '../components/dashboard/ConstraintHUD'
import FeasibilityGauge from '../components/dashboard/FeasibilityGauge'
import RouteMatrix from '../components/dashboard/RouteMatrix'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const DashboardPage = () => {
  const { user } = useAuth()
  const [intakeData, setIntakeData] = useState(null)
  const [routes, setRoutes] = useState([])
  const [systemStatus] = useState('READY')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch intake data from Supabase
        const { data: intake, error: intakeError } = await supabase
          .from('intake_data')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (intakeError && intakeError.code !== 'PGRST116') {
          console.error('Intake fetch error:', intakeError)
        }

        const safeIntake = intake || {
          budget: 1500000,
          cgpa: 8.25,
          targetRole: 'Engineering',
          degreeLevel: 'Masters',
          fieldOfStudy: 'Computer Science',
          backlogs: 0
        }
        setIntakeData(safeIntake)

        // Fetch routes from backend API
        const token = (await supabase.auth.getSession()).data.session?.access_token
        const res = await fetch(`${API_BASE_URL}/routes`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const routesData = await res.json()
          // Ensure each route has required fields
          const safeRoutes = (routesData || []).map(r => ({
            ...r,
            total_cost: r.total_cost || 1500000,
            pr_timeline: r.pr_timeline || 48,
            roi_vector: r.roi_vector || 'Engineering',
            market_demand: r.market_demand || 'High',
            feasibility: r.feasibility || 50
          }))
          setRoutes(safeRoutes)
        } else {
          setRoutes([])
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A0F1C] pt-24 flex items-center justify-center">
          <div className="text-gray-400 font-mono text-sm">LOADING ROUTE MATRIX...</div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A0F1C] pt-24 flex items-center justify-center">
          <div className="text-red-400 font-mono text-sm">ERROR: {error}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0F1C] pt-24 pb-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/intake" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors group">
              <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
              <span className="font-mono">← BACK TO INTAKE</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/compare"
                className="px-4 py-2 bg-brand-copper/10 border border-brand-copper/30 text-brand-copper rounded-lg text-sm font-medium hover:bg-brand-copper/20 transition-all"
              >
                <i className="fa-solid fa-code-compare mr-2"></i>
                Compare Routes
              </Link>
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">{systemStatus}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 mb-8">
            <ConstraintHUD data={intakeData} />
            <FeasibilityGauge score={78} />
          </div>

          <RouteMatrix routes={routes} intakeData={intakeData} />
        </div>
      </div>
    </>
  )
}

export default DashboardPage