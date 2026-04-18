import { useMemo, useState } from 'react'
import RouteCard from './RouteCard'
import { mockRoutes } from '../../data/mockRoutes'

const tierConfig = {
  safe: { label: 'SAFE MATCH', accent: 'bg-green-500', borderAccent: 'border-green-500/30' },
  moderate: { label: 'MODERATE MATCH', accent: 'bg-amber-500', borderAccent: 'border-amber-500/30' },
  ambitious: { label: 'AMBITIOUS REACH', accent: 'bg-red-500', borderAccent: 'border-red-500/30' }
}

const RouteMatrix = ({ intakeData }) => {
  const [hoveredColumn, setHoveredColumn] = useState(null)

  const safeRoutes = mockRoutes.filter(r => r.tier === 'safe')
  const moderateRoutes = mockRoutes.filter(r => r.tier === 'moderate')
  const ambitiousRoutes = mockRoutes.filter(r => r.tier === 'ambitious')

  const bestMatchId = useMemo(() => {
    const candidates = [...safeRoutes, ...moderateRoutes]
    if (candidates.length === 0) return null
    return candidates.reduce((best, r) => r.feasibility > best.feasibility ? r : best).id
  }, [safeRoutes, moderateRoutes])

  const columns = [
    { tier: 'safe', routes: safeRoutes },
    { tier: 'moderate', routes: moderateRoutes },
    { tier: 'ambitious', routes: ambitiousRoutes }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {columns.map(col => {
        const config = tierConfig[col.tier]
        const isOtherColumnHovered = hoveredColumn && hoveredColumn !== col.tier

        return (
          <div 
            key={col.tier} 
            className={`space-y-5 transition-opacity duration-300 ${isOtherColumnHovered ? 'opacity-50' : 'opacity-100'}`}
            onMouseEnter={() => setHoveredColumn(col.tier)}
            onMouseLeave={() => setHoveredColumn(null)}
          >
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <div className={`w-2 h-2 rounded-full ${config.accent}`}></div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-gray-400">{config.label}</h3>
              <span className="text-[10px] font-mono text-gray-600 ml-auto">{col.routes.length} ROUTES</span>
            </div>
            <div className="space-y-5">
              {col.routes.map(route => (
                <RouteCard 
                  key={route.id} 
                  route={route} 
                  tier={col.tier}
                  tierConfig={config}
                  isBestMatch={route.id === bestMatchId}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RouteMatrix