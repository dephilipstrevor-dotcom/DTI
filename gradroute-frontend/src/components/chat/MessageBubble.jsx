const MessageBubble = ({ message }) => {
  const formatContent = (text) => {
    const parts = text.split(/(€\d+[-\s]*\d*\/?\w*|\d+[-–]\d+\s*\w+)/g)
    return parts.map((part, i) => {
      if (part.match(/€\d|^\d/)) {
        return <span key={i} className="font-semibold text-white">{part}</span>
      }
      return part
    })
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-10">
        <div className="max-w-[85%]">
          <div className="text-right text-[10px] font-mono text-gray-500 mb-1">
            &gt; USER
          </div>
          <p className="font-mono text-sm text-gray-400 leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <div className="max-w-2xl">
        <div className="text-[10px] font-mono text-orange-400 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-microchip text-[8px]"></i>
          <span>GRADROUTE_ENGINE</span>
        </div>
        <div className="border-l-2 border-orange-500/50 pl-5">
          <p className="text-gray-200 text-sm leading-relaxed">
            {formatContent(message.content)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble