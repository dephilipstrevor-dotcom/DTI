const LiveInterpretation = () => {
  return (
    <section id="process" className="py-24 bg-[#050810] text-white border-t border-white/5">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left side - Text */}
        <div className="space-y-6">
          <div className="text-[10px] font-bold text-brand-copper uppercase tracking-widest">Single Intelligent Canvas</div>
          <h2 className="text-4xl font-bold tracking-tight">Stop filling out forms. <br /> Start configuring systems.</h2>
          <p className="text-gray-400 leading-relaxed text-sm max-w-md">
            Our Intake Engine computes your feasibility in real-time. As you adjust your budget or target roles, the system actively recalculates your global probability stack.
          </p>
          <ul className="space-y-4 pt-4 text-sm font-medium text-gray-300">
            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-copper"></i> No multi-page wizards.</li>
            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-copper"></i> Live interpretation panel.</li>
            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-copper"></i> Instant system warnings.</li>
          </ul>
        </div>

        {/* Right side - Illustration (Girl Pic kept) */}
        <div className="relative flex justify-center">
          <div className="bg-brand-panel/30 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl max-w-sm">
            <img 
              src="/girl-illustration.png" 
              alt="Analytics illustration" 
              className="w-full h-auto object-contain"
              onError={(e) => {
                // Fallback to a terminal UI if girl pic missing
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Fallback Terminal UI */}
            <div className="hidden space-y-4 font-mono text-xs">
              <div className="flex items-start gap-3 text-gray-400">
                <span className="text-brand-copper">&gt;</span>
                <p>Analyzing parameter: <span className="text-white">GPA 8.25</span></p>
              </div>
              <div className="flex items-start gap-3 text-green-400 bg-green-400/5 p-2 rounded border border-green-400/10">
                <span>✓</span>
                <p>Elite academic standing detected. Tier-1 EU pathways unlocked.</p>
              </div>
              <div className="flex items-start gap-3 text-gray-400 mt-4">
                <span className="text-brand-copper">&gt;</span>
                <p>Analyzing constraint: <span className="text-white">Budget $25,000</span></p>
              </div>
              <div className="flex items-start gap-3 text-yellow-400 bg-yellow-400/5 p-2 rounded border border-yellow-400/10">
                <span>⚠</span>
                <p>Budget restricts USA options. Redirecting to German public systems.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveInterpretation