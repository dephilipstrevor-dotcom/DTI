const MemoryPanel = ({ userContext, conversations, activeId, onSelect }) => {
  const truncateTarget = (target) => target.length > 14 ? target.slice(0,11)+'…' : target

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <div>
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-3">Active Variables</div>
        <div className="bg-[#0F172A] border border-white/5 rounded-lg p-3 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">TARGET</div><div className="text-orange-400 text-right truncate">{truncateTarget(userContext.target)}</div>
            <div className="text-gray-500">BUDGET</div><div className="text-white text-right">{userContext.budget}</div>
            <div className="text-gray-500">DEFICIT</div><div className="text-red-400 text-right">{userContext.deficit}</div>
            <div className="text-gray-500">CGPA</div><div className="text-green-400 text-right">{userContext.cgpa}</div>
            <div className="text-gray-500">IELTS</div><div className={`text-right ${userContext.ielts ? 'text-green-400' : 'text-amber-400'}`}>{userContext.ielts || 'AWAITING'}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-3">Session Logs</div>
        <div className="space-y-1">
          {conversations.map(conv => (
            <button key={conv.id} onClick={() => onSelect(conv.id)} className={`w-full text-left pl-0 pr-3 py-2 rounded transition-colors ${activeId === conv.id ? 'bg-orange-500/10 border-l-2 border-orange-500' : 'hover:bg-white/5'}`}>
              <span className="text-[10px] font-mono text-gray-500">Thread_{conv.id.slice(0,4)}</span>
              <span className={`text-xs ml-2 ${activeId === conv.id ? 'text-white' : 'text-gray-400'}`}>{conv.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MemoryPanel