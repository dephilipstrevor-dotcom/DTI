import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import ConstraintHUD from '../components/dashboard/ConstraintHUD'
import FeasibilityGauge from '../components/dashboard/FeasibilityGauge'
import RouteMatrix from '../components/dashboard/RouteMatrix'

const DashboardPage = () => {
  const { user } = useAuth()
  const [intakeData, setIntakeData] = useState(null)
  const [routes, setRoutes] = useState([])
  const [systemStatus] = useState('READY')

  useEffect(() => {
    const fetchData = async () => {
      const { data: intake } = await supabase.from('intake_data').select('*').eq('user_id', user.id).single()
      setIntakeData(intake || { budget: 1500000, cgpa: 8.25, targetRole: 'Engineering', degreeLevel: 'Masters', fieldOfStudy: 'CS', backlogs: 0 })

      const { data: routesData } = await supabase.from('routes').select('*').eq('user_id', user.id)
      setRoutes(routesData || [])
    }
    fetchData()
  }, [user])

  if (!intakeData) {
    return <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center"><div className="text-gray-400 font-mono text-sm">LOADING ROUTE MATRIX...</div></div>
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] pt-8 pb-6 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/intake" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors group">
            <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
            <span className="font-mono">← BACK TO INTAKE</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/account" className="text-gray-400 hover:text-white transition-colors">
              <i className="fa-solid fa-user-circle text-xl"></i>
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
  )
}

export default DashboardPage