const TargetLock = ({ route }) => {
  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  const circumference = 2 * Math.PI * 45
  const offset = circumference - (route.feasibility / 100) * circumference

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            {route.university}
          </h1>
          <p className="text-gray-300 text-lg mb-1">{route.program}</p>
          <p className="text-gray-500 font-mono text-sm tracking-wider">{route.country}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="4" />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke={route.feasibility >= 80 ? '#22c55e' : route.feasibility >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-mono font-bold ${getMatchColor(route.feasibility)}`}>
                {route.feasibility}%
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Feasibility Lock</p>
            <p className="text-xs text-gray-400">Match Confidence</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TargetLock