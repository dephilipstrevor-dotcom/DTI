import { useState } from 'react'

const CommandInput = ({ onSend }) => {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  return (
    <div className="border-t border-white/10 bg-[#0A0F1C] pt-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3 px-6">
          <span className="text-orange-400 font-mono text-lg">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Interrogate the engine..."
            className="flex-1 bg-transparent py-4 text-white font-mono text-base outline-none placeholder:text-gray-600"
          />
          <button type="submit" className="hidden">Send</button>
        </div>
        <div className="mt-2 px-6 pb-2 text-[9px] font-mono text-gray-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          SYSTEM CONTEXT ACTIVE • 3 ROUTES LOADED
        </div>
      </form>
    </div>
  )
}

export default CommandInput