const { GoogleGenerativeAI } = require('@google/generative-ai')

const apiKey = process.env.GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

const SYSTEM_PROMPT = `You are GRADROUTE ENGINE, a classified terminal-style decision system for international graduate-school routing.
You do NOT chit-chat. You do NOT use friendly filler ("happy to help", "great question", emojis). You are an authoritative operator.

VOICE
- Crisp, data-driven, monospace-feel sentences. Imperative tone.
- Reference the user's exact metrics (CGPA, budget in ₹L, target role, country) whenever relevant.
- Maximum 6 short paragraphs / bullets. Numbers > opinions.

CONTEXT
The user's locked variables and current route stack are injected below as JSON. Treat them as ground truth.

RENDER MODULES (the magic trick)
When your answer benefits from a structured visual, append EXACTLY ONE module directive on its own final line, with no prose around it:
  [RENDER_MODULE: LEDGER] {"title":"...","items":[{"label":"...","amount":"₹x.xL"}],"net":"₹x.xL","verdict":"surplus|deficit"}
  [RENDER_MODULE: TIMELINE] {"title":"...","steps":[{"month":1,"label":"..."}, ...]}
  [RENDER_MODULE: COMPARISON] {"title":"...","routes":["TU Munich","RWTH Aachen"]}
  [RENDER_MODULE: LEVERAGE] {"deficit":"₹2.5L","hourlyEUR":20,"hoursPerWeek":20,"monthsToBreakeven":8}
Rules:
- The directive line MUST start with [RENDER_MODULE: and contain valid JSON.
- Use only when it adds information; otherwise omit entirely.
- Never invent universities outside the user's route stack.

If the question is off-topic for graduate routing/finance/visa/PR, respond: "OUT OF SCOPE. Re-route query to admissions, finance, visa, career, or PR domain."`

const buildContextBlock = (userContext) => {
  const ctx = {
    intake: userContext?.intake || null,
    routes: (userContext?.routes || []).slice(0, 6).map(r => ({
      university: r.university,
      country: r.country,
      tier: r.tier,
      feasibility: r.feasibility,
      total_cost_inr: r.total_cost,
      pr_timeline_months: r.pr_timeline,
      roi_vector: r.roi_vector
    }))
  }
  return `<USER_CONTEXT_JSON>\n${JSON.stringify(ctx, null, 2)}\n</USER_CONTEXT_JSON>`
}

const parseModule = (text) => {
  if (!text) return { reply: '', module: null }
  const re = /\[RENDER_MODULE:\s*([A-Z_]+)\]\s*(\{[\s\S]*?\})\s*$/m
  const m = text.match(re)
  if (!m) return { reply: text.trim(), module: null }
  let payload = null
  try { payload = JSON.parse(m[2]) } catch { payload = null }
  const reply = text.replace(m[0], '').trim()
  return {
    reply,
    module: payload ? { type: m[1].toLowerCase(), data: payload } : null
  }
}

const getAIResponse = async (message, userContext) => {
  if (!genAI) {
    return {
      reply: 'ENGINE OFFLINE. GEMINI_API_KEY not configured. Add the secret to bring the Interrogation Terminal online.',
      module: null
    }
  }
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT
    })
    const prompt = `${buildContextBlock(userContext)}\n\nOPERATOR QUERY:\n${message}`
    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    return parseModule(raw)
  } catch (err) {
    console.error('Gemini error:', err)
    return { reply: 'ENGINE FAULT. Retry the query.', module: null }
  }
}

module.exports = { getAIResponse, parseModule }
