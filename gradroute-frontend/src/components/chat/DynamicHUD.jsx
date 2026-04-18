import RouteCard from '../dashboard/RouteCard'
import { mockRoutes } from '../../data/mockRoutes'

const DynamicHUD = ({ activeView, userContext }) => {
  if (activeView === 'routes') {
    const route1 = mockRoutes[0]
    const route2 = mockRoutes[2]
    return (
      <div className="space-y-4">
        <div className="text-[10px] font-mono text-orange-400 uppercase tracking-wider flex items-center gap-2">
          <span>&gt; RENDER_MODULE: COMPARISON</span>
        </div>
        <div className="space-y-3">
          <RouteCard route={route1} tier="safe" tint="bg-green-500/5" isBestMatch={true} />
          <RouteCard route={route2} tier="moderate" tint="bg-amber-500/5" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="text-[10px] font-mono text-orange-400 uppercase tracking-wider flex items-center gap-2">
        <span>&gt; RENDER_MODULE: LEDGER_01</span>
      </div>
      
      <div className="bg-[#0F172A] border border-white/5 rounded-xl p-4">
        <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Liquidity Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Blocked Account</span>
            <span className="font-mono text-white text-sm">₹10.0L</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Tuition (Semester)</span>
            <span className="font-mono text-white text-sm">€0</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/5">
            <span className="text-gray-400 text-xs">Required Liquidity</span>
            <span className="font-mono text-orange-400 font-bold text-sm">₹12.5L</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0F172A] border border-white/5 rounded-xl p-4">
        <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Deficit Offset Timeline</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Hourly Rate</span>
            <span className="text-white font-mono">€20/hr</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Monthly Income</span>
            <span className="text-white font-mono">€1,600</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Months to Breakeven</span>
            <span className="text-green-400 font-mono font-bold">8 months</span>
          </div>
        </div>
        <div className="mt-3 w-full h-1 bg-[#1e293b] rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default DynamicHUD