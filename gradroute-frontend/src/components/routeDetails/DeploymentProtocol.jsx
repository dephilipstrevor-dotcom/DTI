const DeploymentProtocol = ({ route, userData }) => {
  const intake = 'Winter 2028'
  const applicationDeadline = '15th Jan 2027'
  const ieltsStatus = userData.ielts ? 'CLEARED' : 'AWAITING IELTS SCORE'

  return (
    <div className="bg-[#0F172A] border border-orange-500/20 rounded-xl p-6">
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
        Deployment Protocol
      </h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Intake</span>
          <span className="text-white font-mono text-sm font-bold">{intake}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Application Deadline</span>
          <span className="text-white font-mono text-sm font-bold">{applicationDeadline}</span>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Status</span>
          <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${userData.ielts ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {ieltsStatus}
          </span>
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">Next Action</p>
          <p className="text-gray-300 text-xs">
            {userData.ielts 
              ? 'Prepare statement of purpose and secure recommendation letters.' 
              : 'Schedule IELTS exam to meet language requirement.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DeploymentProtocol