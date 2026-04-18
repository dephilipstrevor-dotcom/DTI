const LiveHUD = ({ formData }) => {
  const { cgpa, budget, backlogs, ielts, targetRole, degreeLevel } = formData

  const getGPAStatus = () => {
    if (!cgpa) return { text: 'AWAITING INPUT', color: 'text-gray-400', accent: 'border-gray-700', loading: true }
    if (cgpa >= 8.5) return { text: 'ELITE TIER UNLOCKED', color: 'text-green-400', accent: 'border-green-500' }
    if (cgpa >= 7.5) return { text: 'STRONG ACADEMIC', color: 'text-blue-400', accent: 'border-blue-500' }
    if (cgpa >= 6.5) return { text: 'STANDARD TIER', color: 'text-yellow-400', accent: 'border-yellow-500' }
    return { text: 'LOW GPA WARNING', color: 'text-red-400', accent: 'border-red-500' }
  }

  const getBudgetStatus = () => {
    if (!budget) return { text: 'AWAITING BUDGET', color: 'text-gray-400', accent: 'border-gray-700', loading: true }
    if (budget >= 3500000) return { text: 'PREMIUM GLOBAL', color: 'text-green-400', accent: 'border-green-500' }
    if (budget >= 2000000) return { text: 'EU + CANADA VIABLE', color: 'text-blue-400', accent: 'border-blue-500' }
    if (budget >= 1000000) return { text: 'GERMANY OPTIMAL', color: 'text-brand-copper', accent: 'border-brand-copper' }
    return { text: 'BUDGET CONSTRAINED', color: 'text-red-400', accent: 'border-red-500' }
  }

  const getBacklogStatus = () => {
    if (backlogs === undefined || backlogs === null) return { text: 'PENDING', color: 'text-gray-400', accent: 'border-gray-700', loading: true }
    if (backlogs === 0) return { text: 'CLEAN RECORD', color: 'text-green-400', accent: 'border-green-500' }
    if (backlogs <= 2) return { text: 'MINOR BACKLOGS', color: 'text-yellow-400', accent: 'border-yellow-500' }
    return { text: 'HIGH RISK', color: 'text-red-400', accent: 'border-red-500' }
  }

  const getEnglishStatus = () => {
    if (!ielts) return { text: 'IELTS/TOEFL REQUIRED', color: 'text-gray-400', accent: 'border-gray-700', loading: true }
    if (ielts >= 7.0) return { text: 'THRESHOLD MET', color: 'text-green-400', accent: 'border-green-500' }
    return { text: 'IMPROVE SCORE', color: 'text-yellow-400', accent: 'border-yellow-500' }
  }

  const gpaStatus = getGPAStatus()
  const budgetStatus = getBudgetStatus()
  const backlogStatus = getBacklogStatus()
  const englishStatus = getEnglishStatus()

  // Determine which feasibility dots are active
  const dotsActive = [!!cgpa, !!budget, backlogs !== undefined, !!ielts]

  return (
    <div className="bg-[#0A0F1C] border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Live Analysis</span>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-mono text-gray-400 tracking-wider">LIVE</span>
        </div>
      </div>

      <div className="space-y-5 font-mono">
        {/* Academic Vector */}
        <div className={`border-l-2 ${gpaStatus.accent} pl-3`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-xs font-medium tracking-wide">ACADEMIC_VECTOR</p>
              <div className="flex items-center gap-2">
                {gpaStatus.loading && <i className="fa-solid fa-circle-notch fa-spin text-[10px] text-gray-500"></i>}
                <p className={`text-[11px] font-bold ${gpaStatus.color} ${gpaStatus.loading ? 'animate-pulse' : ''}`}>
                  {gpaStatus.text}
                </p>
              </div>
            </div>
            {cgpa && <span className="text-sm text-brand-copper font-bold">{cgpa}</span>}
          </div>
        </div>

        {/* Financial Vector */}
        <div className={`border-l-2 ${budgetStatus.accent} pl-3`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-xs font-medium tracking-wide">FINANCIAL_VECTOR</p>
              <div className="flex items-center gap-2">
                {budgetStatus.loading && <i className="fa-solid fa-circle-notch fa-spin text-[10px] text-gray-500"></i>}
                <p className={`text-[11px] font-bold ${budgetStatus.color} ${budgetStatus.loading ? 'animate-pulse' : ''}`}>
                  {budgetStatus.text}
                </p>
              </div>
            </div>
            {budget && <span className="text-sm text-brand-copper font-bold">₹{(budget/100000).toFixed(1)}L</span>}
          </div>
        </div>

        {/* Backlog Check */}
        <div className={`border-l-2 ${backlogStatus.accent} pl-3`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-xs font-medium tracking-wide">BACKLOG_CHECK</p>
              <div className="flex items-center gap-2">
                {backlogStatus.loading && <i className="fa-solid fa-circle-notch fa-spin text-[10px] text-gray-500"></i>}
                <p className={`text-[11px] font-bold ${backlogStatus.color}`}>
                  {backlogStatus.text}
                </p>
              </div>
            </div>
            {backlogs !== undefined && backlogs !== null && (
              <span className={`text-sm font-bold ${backlogs > 0 ? 'text-yellow-400' : 'text-white'}`}>{backlogs}</span>
            )}
          </div>
        </div>

        {/* Language */}
        <div className={`border-l-2 ${englishStatus.accent} pl-3`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-xs font-medium tracking-wide">LANGUAGE_PROFICIENCY</p>
              <div className="flex items-center gap-2">
                {englishStatus.loading && <i className="fa-solid fa-circle-notch fa-spin text-[10px] text-gray-500"></i>}
                <p className={`text-[11px] font-bold ${englishStatus.color} ${englishStatus.loading ? 'animate-pulse' : ''}`}>
                  {englishStatus.text}
                </p>
              </div>
            </div>
            {ielts && <span className="text-sm text-white font-bold">{ielts}</span>}
          </div>
        </div>

        {/* Career Target */}
        {targetRole && (
          <div className="border-l-2 border-brand-copper pl-3">
            <div>
              <p className="text-white text-xs font-medium tracking-wide">CAREER_VECTOR</p>
              <p className="text-[11px] text-gray-300 font-bold mt-0.5">{targetRole}</p>
            </div>
          </div>
        )}

        {/* Feasibility Pulse */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Feasibility</span>
            <div className="flex gap-1.5">
              {dotsActive.map((active, i) => (
                <span 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    active ? 'bg-green-500 shadow-[0_0_6px_#22c55e]' : 'bg-gray-700'
                  }`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveHUD