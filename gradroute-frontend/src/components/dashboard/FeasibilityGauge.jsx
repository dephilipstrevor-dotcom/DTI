const FeasibilityGauge = ({ score }) => {
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-4 flex items-center gap-4">
      <div className="relative w-14 h-14">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="36" fill="none" stroke="#1e293b" strokeWidth="3" />
          <circle
            cx="50" cy="50" r="36"
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-mono font-bold text-white">{score}%</span>
        </div>
      </div>
      <div>
        <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500 mb-0.5">Global Feasibility</p>
        <p className="text-[10px] text-gray-400 leading-relaxed max-w-[160px]">
          Extraction probability to Tier-1 economy.
        </p>
      </div>
    </div>
  )
}

export default FeasibilityGauge