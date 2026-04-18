const AIMentorQuote = () => {
  return (
    <div className="bg-brand-panel/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 max-w-3xl w-full text-left mb-12 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <i className="fa-solid fa-robot text-blue-400 text-sm"></i>
        </div>
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Powered by Emergent LLM</span>
      </div>
      <p className="text-gray-300 text-sm md:text-base leading-relaxed italic">
        "Your strict zero-tuition budget of $25k and strong GPA are the exact combination for German public engineering programs. The engine is prioritizing this pathway for mathematical financial success."
      </p>
    </div>
  )
}

export default AIMentorQuote