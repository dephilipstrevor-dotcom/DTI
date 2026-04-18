import MessageBubble from './MessageBubble'
import { useRef, useEffect } from 'react'

const ConversationFeed = ({ messages, isTyping }) => {
  const feedRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    // Scroll to bottom whenever messages change or typing starts
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Constrained max-width container */}
      <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-end">
        <div className="space-y-6">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
              <i className="fa-solid fa-circle-notch fa-spin text-orange-400"></i>
              <span>Engine analyzing...</span>
            </div>
          )}
        </div>
        {/* Invisible element to anchor scroll */}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

export default ConversationFeed