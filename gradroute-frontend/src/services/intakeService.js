// Inside IntakeForm.jsx
import { useAuth } from '../context/AuthContext'
import { saveIntakeData } from '../services/intakeService'
import { saveGeneratedRoutes } from '../services/routeService'

// Inside component:
const { user } = useAuth()

const handleLoadingComplete = async () => {
  if (!user) return

  // Save intake data
  await saveIntakeData(user.id, formData)

  // Generate mock routes (replace with real engine call later)
  const { mockRoutes } = await import('../data/mockRoutes')
  const routesToSave = mockRoutes.map(r => ({
    tier: r.tier,
    university: r.university,
    program: r.program,
    country: r.country,
    feasibility: r.feasibility,
    total_cost: r.totalCost,
    pr_timeline: r.prTimeline,
    roi_vector: r.roiVector,
    market_demand: r.marketDemand
  }))

  await saveGeneratedRoutes(user.id, routesToSave)
  navigate('/dashboard')
}