import { useState, useEffect, useRef } from 'react'

const LoadingSequence = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const timerRef = useRef(null)
  const messages = [
    'Initializing constraint solver...',
    'Filtering 5,000+ global programs...',
    'Verifying PR timelines...',
    'Calculating budget deltas...',
    'Generating optimal routes...'
  ]

  useEffect(() => {
    const advanceStep = () => {
      setStep(prev => {
        const next = prev + 1
        if (next < messages.length) {
          timerRef.current = setTimeout(advanceStep, 400)
        } else if (next === messages.length) {
          timerRef.current = setTimeout(onComplete, 300)
        }
        return next
      })
    }

    timerRef.current = setTimeout(advanceStep, 400)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [onComplete, messages.length])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]">
      <div className="bg-[#0f172a] border border-brand-copper/30 rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-brand-copper/20 flex items-center justify-center">
            <i className="fa-solid fa-microchip text-brand-copper"></i>
          </div>
          <span className="text-white font-mono text-sm uppercase tracking-widest">Engine Execution</span>
        </div>
        
        <div className="space-y-3 font-mono text-sm">
          {messages.slice(0, step).map((msg, i) => (
            <div key={i} className="flex items-center gap-2 text-green-400">
              <i className="fa-solid fa-check text-xs"></i>
              <span className="text-[#cbd5e1]">{msg}</span>
            </div>
          ))}
          {step < messages.length && (
            <div className="flex items-center gap-2 text-brand-copper">
              <i className="fa-solid fa-spinner fa-spin text-xs"></i>
              <span>{messages[step]}</span>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div  
              className="h-full bg-gradient-to-r from-brand-copper to-orange-400 transition-all duration-400"
              style={{ width: `${(step / messages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSequence