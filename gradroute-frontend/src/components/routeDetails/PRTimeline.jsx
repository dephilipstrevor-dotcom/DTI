const PRTimeline = ({ route }) => {
  const phases = [
    { label: 'Arrival', duration: 'Day 1', color: 'border-gray-500', dot: 'bg-gray-500' },
    { label: 'Master\'s Program', duration: '24 Months', color: 'border-blue-500', dot: 'bg-blue-500' },
    { label: 'Job Search Visa', duration: '18 Months', color: 'border-amber-500', dot: 'bg-amber-500' },
    { label: 'Blue Card / Work Permit', duration: '21 Months', color: 'border-orange-500', dot: 'bg-orange-500' },
    { label: 'Permanent Residency', duration: 'Locked', color: 'border-green-500', dot: 'bg-green-500' }
  ]

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
        PR Horizon · Master Timeline
      </h2>
      
      <div className="relative">
        {/* Vertical line - faint */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10"></div>
        
        <div className="space-y-8">
          {phases.map((phase, idx) => (
            <div key={idx} className="relative flex items-start gap-6 pl-12">
              {/* Server-map node: outer ring, dark center, inner bright dot */}
              <div className={`absolute left-2 w-6 h-6 rounded-full border-2 ${phase.color} bg-[#0F172A] flex items-center justify-center shadow-[0_0_8px_rgba(249,115,22,0.2)]`}>
                <div className={`w-2 h-2 rounded-full ${phase.dot}`}>
                  {idx === phases.length - 1 && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-green-500 opacity-40"></span>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-white font-mono text-sm font-bold">{phase.label}</h3>
                  <span className="text-xs font-mono text-gray-400">{phase.duration}</span>
                </div>
                {idx < phases.length - 1 && (
                  <p className="text-gray-500 text-xs">
                    {idx === 0 && 'Enroll, secure accommodation, activate blocked account.'}
                    {idx === 1 && 'Complete coursework, thesis, and secure internship.'}
                    {idx === 2 && '18-month post-study visa to find qualified employment.'}
                    {idx === 3 && 'Cross salary threshold (€58,400 for shortage occupations).'}
                  </p>
                )}
                {idx === phases.length - 1 && (
                  <p className="text-green-400 text-xs font-mono">
                    ✓ Eligible after 21 months with B1 German proficiency.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Total to Settlement</span>
        <span className="font-mono text-white font-bold">~45 Months</span>
      </div>
    </div>
  )
}

export default PRTimeline