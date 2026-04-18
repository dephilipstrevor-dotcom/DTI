import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden border-b border-white/5 bg-brand-dark">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-copper/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* LEFT SIDE - TEXT */}
        <div className="space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80">
            <span className="w-2 h-2 rounded-full bg-brand-copper animate-pulse"></span>
            Deterministic Decision Engine
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white">
            Architecting <br /> Your <br />
            <span className="text-brand-copper relative inline-block">
              Digital Reality.
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-brand-copper/40 rounded-full"></div>
            </span>
          </h1>

          <p className="text-lg text-gray-300 font-medium leading-relaxed max-w-xl">
            GradRoute engineers mathematically viable pathways to top-tier universities and permanent residency. Stop guessing. Start calculating.
          </p>

          {/* Trust line + CTA */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-gray-700">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-gray-700">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="user" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-brand-copper/20 text-white flex items-center justify-center text-xs font-bold backdrop-blur-sm">12k+</div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Routes Processed</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to="/auth"
              className="group relative inline-block px-8 py-4 bg-gradient-to-r from-brand-copper to-orange-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(224,93,54,0.4)] hover:shadow-[0_0_50px_rgba(224,93,54,0.6)] hover:-translate-y-1 text-sm uppercase tracking-wider"
            >
              <span className="relative z-10">Generate My Route</span>
              <i className="fa-solid fa-arrow-right ml-2 relative z-10 group-hover:translate-x-1 transition-transform"></i>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-copper to-orange-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
            </Link>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <i className="fa-regular fa-clock"></i> Takes 2 minutes
            </span>
          </div>
        </div>

        {/* RIGHT SIDE - VISUAL */}
        <div className="relative h-[500px] lg:h-[600px] w-full flex items-center justify-center">
          {/* Main Image - assuming a girl illustration/process flow */}
          <img
            src="/process-flow.png"
            alt="GradRoute Process"
            className="relative z-20 w-full max-w-md h-auto object-contain drop-shadow-2xl"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300/0A0F1C/E05D36?text=GradRoute+Flow'
            }}
          />

          {/* Floating Badges */}
          <div className="absolute top-4 -left-2 lg:top-12 lg:-left-12 bg-brand-slate/90 backdrop-blur-md text-white border border-white/10 rounded-2xl p-4 lg:p-5 shadow-2xl z-30 animate-float transform -rotate-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <i className="fa-solid fa-wallet text-brand-copper"></i> Budget Delta
            </p>
            <div className="text-lg lg:text-xl font-bold mb-1">-₹2.5L</div>
            <p className="text-[9px] text-gray-400">Minor deficit. Part-time feasible.</p>
          </div>

          <div className="absolute top-0 -right-2 lg:top-8 lg:-right-10 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl p-4 lg:p-5 shadow-2xl z-30 animate-float-delayed transform rotate-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <i className="fa-solid fa-passport"></i>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">PR Horizon</p>
                <p className="font-bold text-sm">~45 Months</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 -left-2 lg:bottom-16 lg:-left-14 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl p-4 lg:p-5 shadow-2xl z-30 animate-float transform rotate-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                <i className="fa-solid fa-star"></i>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">GPA Match</p>
                <p className="font-bold text-sm text-green-400">92% Fit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection