const AdmissionsChecklist = ({ route, userData }) => {
  const requirements = [
    {
      label: 'CGPA Requirement',
      required: 8.0,
      actual: userData.cgpa,
      status: userData.cgpa >= 8.0 ? 'cleared' : 'pending',
      message: userData.cgpa >= 8.0 
        ? `Your ${userData.cgpa} CGPA clears the historical 8.0 cutoff.` 
        : `Requires minimum 8.0 CGPA.`
    },
    {
      label: 'IELTS / English Proficiency',
      required: 6.5,
      actual: userData.ielts,
      status: userData.ielts ? (userData.ielts >= 6.5 ? 'cleared' : 'warning') : 'pending',
      message: userData.ielts 
        ? (userData.ielts >= 6.5 ? 'Language requirement satisfied.' : 'Score below threshold.')
        : 'IELTS 6.5 minimum required. You are currently marked as "Awaiting Test".'
    },
    {
      label: 'Aptitude Multiplier',
      required: 'GRE/GATE',
      actual: userData.gre,
      status: userData.gre ? 'multiplier' : 'pending',
      message: userData.gre 
        ? `Your GRE score of ${userData.gre} provides a 15% edge in final portfolio review.`
        : 'No standardized test score provided.'
    }
  ]

  const statusConfig = {
    cleared: { icon: 'fa-check-circle', color: 'text-green-500', border: 'border-green-500/20' },
    warning: { icon: 'fa-exclamation-triangle', color: 'text-amber-500', border: 'border-amber-500/20' },
    pending: { icon: 'fa-clock', color: 'text-gray-400', border: 'border-gray-500/20' },
    multiplier: { icon: 'fa-bolt', color: 'text-blue-400', border: 'border-blue-500/20' }
  }

  return (
    <div>
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
        System Validation
      </h2>
      <div className="space-y-3">
        {requirements.map((req, idx) => {
          const config = statusConfig[req.status]
          return (
            <div key={idx} className={`border ${config.border} rounded-lg p-4 bg-transparent`}>
              <div className="flex items-start gap-3">
                <i className={`fa-solid ${config.icon} ${config.color} text-sm mt-0.5`}></i>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-mono text-sm">{req.label}</span>
                    <span className="text-[10px] font-mono text-gray-400">
                      Required: {typeof req.required === 'number' ? req.required : req.required}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">{req.message}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdmissionsChecklist