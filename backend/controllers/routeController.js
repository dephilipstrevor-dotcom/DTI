const { generateRoutes } = require('../services/filteringService')
const { supabase } = require('../config/supabase')

const ALLOWED_INTAKE_COLS = [
  'degreeLevel', 'previousDegree', 'fieldOfStudy', 'cgpa', 'backlogs',
  'ielts', 'gre', 'portfolio', 'budget', 'fundingSource',
  'targetRole', 'workExperience', 'intakeTerm'
]

const pickIntake = (body = {}) => {
  const out = {}
  for (const k of ALLOWED_INTAKE_COLS) {
    const v = body[k]
    if (v === undefined || v === '') continue
    out[k] = v
  }
  return out
}

const generate = async (req, res) => {
  try {
    const userId = req.user.id
    const intake = pickIntake(req.body)

    const { error: upsertErr } = await supabase
      .from('intake_data')
      .upsert({ user_id: userId, ...intake }, { onConflict: 'user_id' })
    if (upsertErr) {
      console.error('intake_data upsert error:', upsertErr)
      return res.status(500).json({ error: upsertErr.message, code: upsertErr.code })
    }

    const routes = await generateRoutes(userId, intake)
    res.json({ success: true, count: routes.length })
  } catch (err) {
    console.error('Route generation error:', err?.message || err)
    res.status(500).json({ error: err?.message || 'unknown' })
  }
}

const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('user_id', req.user.id)
      .order('feasibility', { ascending: false })
    if (error) throw error
    res.json(data || [])
  } catch (err) {
    console.error('routes getAll error:', err?.message || err)
    res.status(500).json({ error: err?.message || 'unknown' })
  }
}

const getOne = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .maybeSingle()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Route not found' })
    res.json(data)
  } catch (err) {
    console.error('routes getOne error:', err?.message || err)
    res.status(500).json({ error: err?.message || 'unknown' })
  }
}

const toggleSaved = async (req, res) => {
  try {
    const { id } = req.params
    const { saved } = req.body
    const { data, error } = await supabase
      .from('routes')
      .update({ saved })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error('toggleSaved error:', err?.message || err)
    res.status(500).json({ error: err?.message || 'unknown' })
  }
}

module.exports = { generate, getAll, getOne, toggleSaved }
