import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import TargetLock from '../components/routeDetails/TargetLock'
import AdmissionsChecklist from '../components/routeDetails/AdmissionsChecklist'
import FinancialLedger from '../components/routeDetails/FinancialLedger'
import ROITrajectory from '../components/routeDetails/ROITrajectory'
import LLMInsight from '../components/routeDetails/LLMInsight'
import PRTimeline from '../components/routeDetails/PRTimeline'
import TargetOutcomes from '../components/routeDetails/TargetOutcomes'
import DeploymentProtocol from '../components/routeDetails/DeploymentProtocol'

const RouteDetailsPage = () => {
  const { routeId } = useParams()
  const { user } = useAuth()
  const [route, setRoute] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: routeData } = await supabase.from('routes').select('*').eq('id', routeId).single()
      setRoute(routeData)

      const { data: intakeData } = await supabase.from('intake_data').select('*').eq('user_id', user.id).single()
      setUserData({
        cgpa: intakeData?.cgpa || 8.0,
        ielts: intakeData?.ielts,
        gre: intakeData?.gre,
        budget: intakeData?.budget || 1500000,
        targetRole: intakeData?.targetRole || 'Systems Engineering'
      })
      setLoading(false)
    }
    fetchData()
  }, [routeId, user])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A0F1C] pt-24 flex items-center justify-center">
          <div className="text-gray-400 font-mono">LOADING...</div>
        </div>
      </>
    )
  }

  if (!route) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A0F1C] pt-24 flex items-center justify-center">
          <div className="text-gray-400 font-mono">ROUTE NOT FOUND</div>
        </div>
      </>
    )
  }

  const routeWithBudget = { ...route, userBudget: userData.budget }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0F1C] pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors group mb-8">
            <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
            <span className="font-mono tracking-wider">← ABORT TO MATRIX</span>
          </Link>

          <TargetLock route={route} />

          <div className="grid grid-cols-3 gap-6 mt-8 items-start">
            <div className="col-span-2 space-y-6">
              <AdmissionsChecklist route={route} userData={userData} />
              <FinancialLedger route={routeWithBudget} userData={userData} />
              <ROITrajectory />
            </div>
            <div className="col-span-1 space-y-6">
              <LLMInsight route={route} userData={userData} />
              <TargetOutcomes route={route} />
              <DeploymentProtocol route={route} userData={userData} />
            </div>
          </div>

          <div className="mt-16">
            <PRTimeline route={route} />
          </div>
        </div>
      </div>
    </>
  )
}

export default RouteDetailsPage