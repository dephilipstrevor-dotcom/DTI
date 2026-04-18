import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const RouteCard = ({ route, tier, tierConfig, isBestMatch = false }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [budgetWidth, setBudgetWidth] = useState(0)
  const [prWidth, setPrWidth] = useState(0)

  const budgetDelta = route.totalCost - route.userBudget
  const isDeficit = budgetDelta > 0
  const budgetPercent = Math.min(100, (route.userBudget / route.totalCost) * 100)
  const prPercent = 60

  useEffect(() => {
    const budgetTimer = setTimeout(() => setBudgetWidth(budgetPercent), 100)
    const prTimer = setTimeout(() => setPrWidth(prPercent), 200)
    return () => {
      clearTimeout(budgetTimer)
      clearTimeout(prTimer)
    }
  }, [budgetPercent, prPercent])

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  return (
    <div
      className={`relative bg-[#0f172a] border ${isBestMatch ? 'border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/5'} rounded-xl p-6 transition-all duration-300 cursor-pointer group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-white/15`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/report/${route.id}`)}
    >
      {/* Best Match Badge */}
      {isBestMatch && (
        <div className="absolute -top-2 left-4 bg-transparent text-green-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-green-500/40 tracking-wider backdrop-blur-sm">
          ⚡ SYSTEM PICK
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-white font-semibold text-base mb-0.5">{route.university}</h4>
          <p className="text-gray-300 text-xs leading-tight">{route.program}</p>
          <p className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mt-1.5">{route.country}</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-mono font-bold transition-all duration-300 ${getMatchColor(route.feasibility)} ${isHovered ? 'scale-110 inline-block' : ''}`}>
            {route.feasibility}%
          </span>
          <span className="text-[9px] text-gray-500 block font-mono tracking-wider">MATCH</span>
        </div>
      </div>

      {/* Budget Delta */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Budget Delta</span>
          <span className={`text-xs font-mono font-bold ${isDeficit ? 'text-red-500' : 'text-green-500'}`}>
            {isDeficit ? '-' : '+'}₹{Math.abs(budgetDelta / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isDeficit ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${budgetWidth}%` }}
          ></div>
        </div>
      </div>

      {/* PR Horizon */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">
          <span>PR Horizon</span>
          <span>~{route.prTimeline} MO</span>
        </div>
        <div className="relative h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${prWidth}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[8px] font-mono text-gray-600 mt-1.5">
          <span>STUDY</span>
          <span>WORK</span>
          <span>PR</span>
        </div>
      </div>

      {/* ROI Vector */}
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">ROI Vector:</span>
          <span className="text-[10px] text-orange-400 font-mono font-medium">{route.roiVector}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Market Demand:</span>
          <span className={`text-[10px] font-mono font-bold ${route.marketDemand === 'High' ? 'text-green-500' : 'text-amber-500'}`}>
            {route.marketDemand}
          </span>
        </div>
      </div>

      {/* Decrypt Button */}
      <button 
        className={`w-full py-2.5 rounded-lg bg-[#0F172A] text-gray-300 text-[11px] font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 border ${tierConfig.borderAccent} hover:bg-[#1e293b] hover:text-white hover:shadow-[0_0_10px_rgba(249,115,22,0.3)]`}
      >
        DECRYPT FULL PATHWAY
        <i className="fa-solid fa-arrow-right text-[9px]"></i>
      </button>
    </div>
  )
}

export default RouteCard