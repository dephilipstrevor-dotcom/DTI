import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import MemoryPanel from '../components/chat/MemoryPanel'
import ConversationFeed from '../components/chat/ConversationFeed'
import DynamicHUD from '../components/chat/DynamicHUD'
import CommandInput from '../components/chat/CommandInput'

const ChatPage = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [activeHUD, setActiveHUD] = useState('financial')
  const [userContext, setUserContext] = useState({ target: 'Engineering', budget: '₹15L', deficit: '-₹2.5L', cgpa: 8.25, ielts: null })

  useEffect(() => {
    const loadUserData = async () => {
      const { data: intake } = await supabase.from('intake_data').select('*').eq('user_id', user.id).single()
      if (intake) {
        setUserContext({
          target: intake.targetRole || 'Engineering',
          budget: `₹${(intake.budget / 100000).toFixed(1)}L`,
          deficit: '-₹2.5L',
          cgpa: intake.cgpa,
          ielts: intake.ielts
        })
      }

      const { data: convs } = await supabase.from('conversations').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setConversations(convs || [])
      if (convs && convs.length > 0) {
        setActiveConversationId(convs[0].id)
      } else {
        const { data: newConv } = await supabase.from('conversations').insert({ user_id: user.id, title: 'New Conversation' }).select().single()
        setActiveConversationId(newConv.id)
        setConversations([newConv])
      }
    }
    loadUserData()
  }, [user])

  useEffect(() => {
    if (!activeConversationId) return
    const loadMessages = async () => {
      const { data: msgs } = await supabase.from('messages').select('*').eq('conversation_id', activeConversationId).order('created_at', { ascending: true })
      setMessages(msgs || [])
    }
    loadMessages()
  }, [activeConversationId])

  const handleSendMessage = async (text) => {
    const newUserMsg = { conversation_id: activeConversationId, role: 'user', content: text }
    await supabase.from('messages').insert(newUserMsg)
    setMessages(prev => [...prev, { ...newUserMsg, id: Date.now() }])
    setIsTyping(true)

    setTimeout(async () => {
      const aiResponse = { conversation_id: activeConversationId, role: 'assistant', content: 'Based on your profile, defense‑tech Werkstudent positions in Munich can offset your deficit within 7‑9 months.' }
      await supabase.from('messages').insert(aiResponse)
      setMessages(prev => [...prev, { ...aiResponse, id: Date.now() + 1 }])
      setIsTyping(false)
      setActiveHUD('routes')
    }, 1500)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0F1C] pt-20 flex">
        <div className="w-1/5 border-r border-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors group">
              <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
              <span className="font-mono tracking-wider text-[10px]">← MATRIX</span>
            </Link>
          </div>
          <MemoryPanel userContext={userContext} conversations={conversations} activeId={activeConversationId} onSelect={setActiveConversationId} />
        </div>

        <div className="w-[55%] flex flex-col">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400">Decision Console</h2>
          </div>
          <ConversationFeed messages={messages} isTyping={isTyping} />
          <CommandInput onSend={handleSendMessage} />
        </div>

        <div className="w-1/4 border-l border-white/5 p-4">
          <DynamicHUD activeView={activeHUD} userContext={userContext} />
        </div>
      </div>
    </>
  )
}

export default ChatPage