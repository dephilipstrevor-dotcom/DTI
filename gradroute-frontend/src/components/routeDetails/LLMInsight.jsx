const LLMInsight = ({ route, userData }) => {
  const budgetDelta = 250000

  return (
    <div className="bg-gradient-to-br from-[#0F172A] to-[#0A0F1C] border border-orange-500/20 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center">
          <i className="fa-solid fa-robot text-orange-400 text-xs"></i>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400">LLM Insight</span>
      </div>
      
      <p className="text-gray-200 text-sm leading-relaxed">
        System detects a <span className="text-red-400 font-mono font-bold">-₹{Math.abs(budgetDelta / 100000).toFixed(1)} Lakh</span> deficit. 
        This is <span className="text-green-400">highly manageable</span>. Securing a standard 20hr/week 
        <span className="text-orange-400"> Werkstudent</span> role in {userData.targetRole || 'C++ systems development'} 
        {' '}will offset this gap within <span className="font-mono text-white">7 months</span>.
      </p>
      
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">Recommended Action</p>
        <p className="text-gray-300 text-xs leading-relaxed">
          Apply for Werkstudent positions 3 months before arrival. Target companies: Siemens, BMW, Infineon.
        </p>
      </div>
    </div>
  )
}

export default LLMInsight