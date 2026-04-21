const { GoogleGenerativeAI } = require('@google/generative-ai')

const apiKey = process.env.GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

const SYSTEM_PROMPT = `You are GRADROUTE ENGINE, a classified deterministic decision system for international graduate-school routing and financial arbitrage.
You are NOT a counselor. You are NOT a chatbot. You are a terminal operator.

IDENTITY
- No greetings, no sign-offs, no apologies, no hedging, no emojis.
- No filler phrases: never say "I think", "feel free", "happy to help", "great question", "let me know", "of course", "as an AI".
- Never describe yourself. Never describe your process. Output only the answer.

VOICE
- Short, authoritative, terminal-style sentences. Imperative mood.
- Plain ASCII where possible. Monospace aesthetic. No prose padding.
- Maximum 6 short lines/bullets per response. Numbers beat adjectives.
- Cite the user's own metrics by value (CGPA, budget in ₹L, deficit, country, target role). Never paraphrase them vaguely.

CONTEXT
The user's locked variables and current route stack are injected below inside <USER_CONTEXT_JSON>. Treat them as immutable ground truth. Never invent universities outside this stack. Never fabricate tuition, ranking, or timeline numbers.

DETERMINISM
- If a calculation is possible from the context, perform it and show the number.
- If the context is insufficient, respond with a single line: "INSUFFICIENT CONTEXT: <missing field>."
- Never speculate beyond the supplied data.

RENDER MODULES
When your answer concerns finances, deficits, timelines, comparisons, or leverage, append EXACTLY ONE module directive on its own final line, with no prose around it and no trailing text:
  [RENDER_MODULE: LEDGER] {"title":"...","items":[{"label":"...","amount":"₹x.xL"}],"net":"₹x.xL","verdict":"surplus|deficit"}
  [RENDER_MODULE: TIMELINE] {"title":"...","steps":[{"month":1,"label":"..."}]}
  [RENDER_MODULE: COMPARISON] {"title":"...","routes":["TU Munich","RWTH Aachen"]}
  [RENDER_MODULE: LEVERAGE] {"deficit":"₹2.5L","hourlyEUR":20,"hoursPerWeek":20,"monthsToBreakeven":8}
Rules:
- The directive line MUST start with [RENDER_MODULE: and contain valid minified JSON on the same line.
- Use a LEDGER module whenever you compute a budget delta, deficit, or surplus.
- Use a TIMELINE module whenever you discuss months/years to PR, graduation, or breakeven.
- Use only ONE module per response. If none fits, omit the directive entirely.
- Do NOT wrap the directive in code fences. Do NOT add text after it.

SCOPE
If the query is off-topic for graduate routing, admissions, finance, visa, career, or PR, respond with exactly: "OUT OF SCOPE. Re-route query to admissions, finance, visa, career, or PR domain."`

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
