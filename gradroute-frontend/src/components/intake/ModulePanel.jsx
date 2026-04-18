import { useState } from 'react'

const ModulePanel = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-white/10 rounded-xl bg-[#0F172A] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors border-b border-white/10"
      >
        <div className="flex items-center gap-3">
          <span className="text-brand-copper text-base">{icon}</span>
          <span className="font-semibold tracking-wide text-sm text-white">{title}</span>
        </div>
        <i className={`fa-solid fa-chevron-down text-gray-500 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      <div className={`px-5 py-5 space-y-5 ${isOpen ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  )
}

export default ModulePanel