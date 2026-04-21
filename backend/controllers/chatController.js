const { getAIResponse } = require('../services/llmService')
const { supabase } = require('../config/supabase')

const sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body
    const userId = req.user.id

    const { data: intake } = await supabase
      .from('intake_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: message
    })

    const aiReply = await getAIResponse(message, intake)

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: aiReply
    })

    res.json({ reply: aiReply })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { sendMessage }