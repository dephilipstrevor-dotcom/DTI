const { getAIResponse } = require('../services/llmService')
const { supabase } = require('../config/supabase')

const sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body
    const userId = req.user.id

    if (!conversationId || !message) {
      return res.status(400).json({ error: 'conversationId and message required' })
    }

    // Pull user context: intake + active route stack
    const [{ data: intake }, { data: routes }] = await Promise.all([
      supabase.from('intake_data').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('routes').select('*').eq('user_id', userId).order('feasibility', { ascending: false }).limit(8)
    ])

    // Persist user message
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: message
    })

    const { reply, module } = await getAIResponse(message, { intake, routes: routes || [] })

    // Persist assistant message (with module payload)
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: reply,
      module: module || null
    })

    res.json({ reply, module })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = { sendMessage }
