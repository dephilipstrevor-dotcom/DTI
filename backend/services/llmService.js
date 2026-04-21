const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const getAIResponse = async (message, userContext) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `You are GradRoute Engine, a terminal-style study abroad advisor. 
User context: ${JSON.stringify(userContext)}. 
Respond in concise, data-driven sentences. Use copper/orange highlights for key numbers.
User query: ${message}`

    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (err) {
    console.error('Gemini error:', err)
    return 'I am currently unable to process your request. Please try again later.'
  }
}

module.exports = { getAIResponse }