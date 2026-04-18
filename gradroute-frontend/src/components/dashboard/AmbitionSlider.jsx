import { useState, useEffect } from 'react'

const AmbitionSlider = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false)

  const getLabel = (val) => {
    if (val < 30) return 'CONSERVATIVE'
    if (val > 70) return 'AGGRESSIVE'
    return 'BALANCED'
  }

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-sliders text-gray-600 text-[10px]"></i>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">Ambition Level</span>
        </div>
        <div className="flex items-center gap-2">
          {isDragging && (
            <span className="text-[9px] font-mono text-orange-400 animate-pulse">RE-RANKING...</span>
          )}
          <span className="text-[10px] font-mono text-orange-400">{getLabel(value)}</span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="w-full h-px bg-white/10 rounded-full appearance-none cursor-pointer transition-all duration-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(249,115,22,0.9)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125"
        />
        
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
          <div className="w-px h-2 bg-white/20"></div>
          <div className="w-px h-2 bg-white/20"></div>
          <div className="w-px h-2 bg-white/20"></div>
          <div className="w-px h-2 bg-white/20"></div>
          <div className="w-px h-2 bg-white/20"></div>
        </div>
      </div>

      <div className="flex justify-between text-[9px] font-mono text-gray-600 mt-3">
        <span className={value < 30 ? 'text-green-400' : ''}>SAFE</span>
        <span className={value >= 30 && value <= 70 ? 'text-amber-400' : ''}>BALANCED</span>
        <span className={value > 70 ? 'text-red-400' : ''}>AGGRESSIVE</span>
      </div>
    </div>
  )
}

export default AmbitionSlider