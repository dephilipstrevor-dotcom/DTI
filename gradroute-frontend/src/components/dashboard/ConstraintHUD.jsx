const ConstraintHUD = ({ data }) => {
  const { cgpa, backlogs, budget, targetRole, degreeLevel, fieldOfStudy } = data

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-terminal text-gray-600 text-[10px]"></i>
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">Global Probability Stack</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-3">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-0.5">CGPA</div>
          <div className="font-mono text-gray-200 text-sm font-medium">{cgpa || '—'}</div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-0.5">BACKLOGS</div>
          <div className="font-mono text-gray-200 text-sm font-medium">{backlogs || '0'}</div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-0.5">BUDGET</div>
          <div className="font-mono text-gray-200 text-sm font-medium">₹{(budget/100000).toFixed(1)}L</div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-0.5">VECTOR</div>
          <div className="font-mono text-gray-200 text-sm font-medium truncate max-w-[120px]">{targetRole || fieldOfStudy || 'ENG'}</div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-0.5">DEGREE</div>
          <div className="font-mono text-gray-200 text-sm font-medium">{degreeLevel || 'MS'}</div>
        </div>
      </div>
    </div>
  )
}

export default ConstraintHUD