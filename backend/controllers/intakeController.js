const { supabase } = require('../config/supabase')

const evaluateIntake = async (req, res) => {
  try {
    let { degreeLevel, fieldOfStudy, cgpa, backlogs = 0, ielts, budget } = req.body

    cgpa = parseFloat(cgpa)
    backlogs = parseInt(backlogs)
    budget = parseInt(budget)
    if (ielts) ielts = parseFloat(ielts)

    let query = supabase
      .from('universities')
      .select('id', { count: 'exact', head: true })
      .eq('degreeLevel', degreeLevel)
      .lte('minCgpa', cgpa)
      .lte('maxBacklogs', backlogs)
      .lte('totalCostPerYear', budget)

    if (fieldOfStudy) query = query.ilike('fieldOfStudy', `%${fieldOfStudy}%`)
    if (ielts) query = query.lte('ieltsRequired', ielts)

    const { count, error } = await query
    if (error) throw error

    const feasibility = Math.min(98, Math.max(20, Math.round((count / 10) * 100)))
    res.json({ count: count || 0, feasibility })
  } catch (err) {
    console.error('Evaluation error:', err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = { evaluateIntake }