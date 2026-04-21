const { supabase } = require('../config/supabase')

const toNum = (v, fallback = null) => {
  if (v === '' || v === null || v === undefined) return fallback
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const evaluateIntake = async (req, res) => {
  try {
    const body = req.body || {}
    const degreeLevel = body.degreeLevel || null
    const fieldOfStudy = body.fieldOfStudy || null
    const cgpa = toNum(body.cgpa)
    const backlogs = toNum(body.backlogs, 0)
    const budget = toNum(body.budget)
    const ielts = toNum(body.ielts)

    let query = supabase
      .from('universities')
      .select('id', { count: 'exact', head: true })

    if (degreeLevel) query = query.eq('degreeLevel', degreeLevel)
    if (cgpa !== null) query = query.lte('minCgpa', cgpa)
    if (backlogs !== null) query = query.gte('maxBacklogs', backlogs)
    if (budget !== null) query = query.lte('totalCostPerYear', budget)
    if (fieldOfStudy) query = query.ilike('fieldOfStudy', `%${fieldOfStudy}%`)
    if (ielts !== null) query = query.lte('ieltsRequired', ielts)

    const { count, error } = await query
    if (error) {
      console.error('Evaluation query error:', error)
      return res.status(500).json({ error: error.message || 'query failed', code: error.code })
    }

    const feasibility = Math.min(98, Math.max(20, Math.round(((count || 0) / 10) * 100)))
    res.json({ count: count || 0, feasibility })
  } catch (err) {
    console.error('Evaluation error:', err?.message || err)
    res.status(500).json({ error: err?.message || 'unknown' })
  }
}

module.exports = { evaluateIntake }
