const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - 55% */}
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-[#0A0F1C] via-[#111827] to-black relative overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-copper/20 blur-[140px] rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col w-full p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-copper/20 rounded-xl flex items-center justify-center border border-brand-copper/30 shadow-[0_0_20px_rgba(224,93,54,0.15)]">
              <i className="fa-solid fa-graduation-cap text-brand-copper text-xl"></i>
            </div>
            <span className="text-white font-bold tracking-tight text-2xl">GradRoute</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm">
              <svg className="w-full h-auto" viewBox="0 0 400 250" fill="none">
                <g>
                  <animateTransform attributeName="transform" type="rotate" from="0 200 125" to="360 200 125" dur="20s" repeatCount="indefinite" />
                  <circle cx="200" cy="125" r="75" stroke="#E05D36" strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4 6" />
                  <circle cx="200" cy="125" r="50" stroke="#E05D36" strokeWidth="1.5" strokeOpacity="0.35" strokeDasharray="4 6" />
                </g>
                <g>
                  <animateTransform attributeName="transform" type="rotate" from="360 200 125" to="0 200 125" dur="15s" repeatCount="indefinite" />
                  <circle cx="200" cy="125" r="28" stroke="#E05D36" strokeWidth="2" strokeOpacity="0.6" strokeDasharray="4 6" />
                </g>
                <circle cx="200" cy="125" r="8" fill="#E05D36">
                  <animate attributeName="r" values="6;11;6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="200" cy="125" r="20" fill="#E05D36" fillOpacity="0.1" stroke="#E05D36" strokeWidth="1">
                  <animate attributeName="r" values="16;26;16" dur="2s" repeatCount="indefinite" />
                </circle>
                {[[130,80], [270,90], [250,180], [150,185]].map(([cx, cy], i) => (
                  <g key={i}>
                    <line x1="200" y1="125" x2={cx} y2={cy} stroke="#E05D36" strokeWidth="1" strokeOpacity="0.3">
                      <animate attributeName="stroke-opacity" values="0.1;0.6;0.1" dur={`${3 + i}s`} repeatCount="indefinite" />
                    </line>
                    <circle cx={cx} cy={cy} r="4" fill="#E05D36" fillOpacity="0.6">
                      <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${2.5 + i}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}
              </svg>
            </div>

            {/* Insight Panel */}
            <div className="mt-6 w-full max-w-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-[0_10px_30px_rgba(224,93,54,0.1)]">
              <div className="flex items-center gap-2 mb-3 text-brand-copper">
                <i className="fa-solid fa-microchip text-xs"></i>
                <span className="text-[10px] font-bold uppercase tracking-widest">System Live State</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">Evaluating constraints...</span>
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-copper/60 animate-pulse"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-copper/40"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-copper/20"></span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-green-400 text-[10px]"></i>
                    <span className="text-white text-xs">GPA → Valid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-green-400 text-[10px]"></i>
                    <span className="text-white text-xs">Budget → Optimized</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 mt-3 pt-2">
                <p className="text-brand-copper/80 text-[11px] font-medium flex items-center gap-1">
                  <i className="fa-solid fa-route text-[9px]"></i>
                  14 viable pathways computed
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-2xl font-semibold text-white/90 mb-1">Precision mapping</p>
            <p className="text-xs text-white/40 leading-relaxed max-w-xs">
              Every route is calculated against hard constraints—GPA, budget, and PR timelines.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - 45% with scroll handling */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 md:p-6 bg-gradient-to-b from-white to-[#f1f5f9] overflow-y-auto">
        <div className="w-full max-w-md py-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout