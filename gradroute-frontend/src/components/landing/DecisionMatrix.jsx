const DecisionMatrix = () => {
  return (
    <section id="capabilities" className="py-32 bg-brand-dark text-white border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-copper/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Decision Matrix</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            We leverage deterministic modeling to engineer scalable, high-performance career outcomes that dominate legacy consulting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="md:col-span-2 bg-brand-panel/50 backdrop-blur-sm border border-white/5 rounded-3xl p-10 relative overflow-hidden group hover:border-brand-copper/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <p className="text-brand-copper font-bold text-sm mb-4 tracking-widest">01</p>
            <h3 className="text-3xl font-bold tracking-tight mb-4">Hard Gatekeepers</h3>
            <p className="text-gray-400 leading-relaxed max-w-md mb-12">
              Scalable, secure filtering powered by your exact academic and financial constraints. We drop 90% of unviable routes instantly.
            </p>
            <div className="bg-brand-dark/50 border border-white/5 rounded-xl p-4 flex flex-wrap gap-4 w-fit items-center">
              <div className="px-4 py-2 bg-gray-800/50 rounded-lg text-sm font-medium"><span className="text-gray-500 mr-2 text-xs uppercase tracking-widest">CGPA</span> 8.25</div>
              <div className="px-4 py-2 bg-gray-800/50 rounded-lg text-sm font-medium"><span className="text-gray-500 mr-2 text-xs uppercase tracking-widest">Budget</span> ₹25L</div>
              <div className="px-4 py-2 bg-brand-copper/10 text-brand-copper rounded-lg text-xs font-bold tracking-widest uppercase border border-brand-copper/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-copper animate-pulse"></span> Processing Filters
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-brand-panel/50 backdrop-blur-sm border border-white/5 rounded-3xl p-10 relative overflow-hidden group hover:border-brand-copper/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <p className="text-brand-copper font-bold text-sm mb-4 tracking-widest">02</p>
            <h3 className="text-2xl font-bold tracking-tight mb-4">ROI Index</h3>
            <p className="text-gray-400 leading-relaxed text-sm mb-8">
              Calculates Expected ROI by mapping target roles (e.g., Quant Dev) against regional salary data.
            </p>
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-500"><span>Market Demand</span><span className="text-green-400">High</span></div>
                <div className="w-full h-1.5 bg-brand-dark rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-green-500 rounded-full"></div>
                </div>
              </div>
              <p className="text-xs font-bold text-white">€65k - €85k <span className="text-gray-500 font-normal">Expected Base</span></p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="md:col-span-3 bg-brand-panel/50 backdrop-blur-sm border border-white/5 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between group hover:border-brand-copper/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <div className="max-w-xl mb-10 md:mb-0">
              <p className="text-brand-copper font-bold text-sm mb-4 tracking-widest">03</p>
              <h3 className="text-2xl font-bold tracking-tight mb-4">The PR Horizon</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Visualize the exact chronological timeline from student visa to permanent residency. Eliminate the risk of forced return.
              </p>
            </div>
            <div className="flex items-center w-full md:w-auto">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-gray-500 mb-3"><i className="fa-solid fa-graduation-cap"></i></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Study</span>
              </div>
              <div className="w-12 md:w-20 h-px bg-white/10 -mt-6"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-gray-500 mb-3"><i className="fa-solid fa-briefcase"></i></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Work</span>
              </div>
              <div className="w-12 md:w-20 h-px bg-brand-copper/30 -mt-6"></div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-brand-copper/10 border border-brand-copper text-brand-copper flex items-center justify-center shadow-[0_0_20px_rgba(224,93,54,0.3)] mb-3"><i className="fa-solid fa-passport text-lg"></i></div>
                <span className="text-[10px] font-bold text-brand-copper uppercase tracking-widest">Settle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DecisionMatrix