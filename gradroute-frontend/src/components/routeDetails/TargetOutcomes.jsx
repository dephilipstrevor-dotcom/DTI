const TargetOutcomes = ({ route }) => {
  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
        Target Outcomes
      </h2>
      
      <div className="space-y-5">
        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Market Demand</div>
          <div className={`text-xl font-mono font-bold ${route.marketDemand === 'High' ? 'text-green-500' : 'text-amber-500'}`}>
            {route.marketDemand}
          </div>
          <p className="text-gray-400 text-xs mt-1">Hiring velocity in {route.country} tech sector.</p>
        </div>
        
        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Career Vector</div>
          <div className="text-lg font-mono font-bold text-white">{route.roiVector}</div>
          <p className="text-gray-400 text-xs mt-1">
            Mission-Critical Backend • Low-Level Systems • Defense Tech
          </p>
        </div>
        
        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Salary Ceiling</div>
          <div className="text-xl font-mono font-bold text-orange-400">€65k - €85k</div>
          <p className="text-gray-400 text-xs mt-1">Expected starting base compensation.</p>
        </div>
      </div>
    </div>
  )
}

export default TargetOutcomes