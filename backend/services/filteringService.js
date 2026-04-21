const { supabase } = require('../config/supabase')

const toNum = (v, fallback = null) => {
  if (v === '' || v === null || v === undefined) return fallback
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const generateRoutes = async (userId, intake) => {
  const degreeLevel = intake.degreeLevel || null
  const fieldOfStudy = intake.fieldOfStudy || null
  const cgpa = toNum(intake.cgpa)
  const backlogs = toNum(intake.backlogs, 0)
  const budget = toNum(intake.budget)
  const ielts = toNum(intake.ielts)
  const targetRole = intake.targetRole || null

  let query = supabase.from('universities').select('*')
  if (degreeLevel) query = query.eq('degreeLevel', degreeLevel)
  if (cgpa !== null) query = query.lte('minCgpa', cgpa)
  if (backlogs !== null) query = query.gte('maxBacklogs', backlogs)
  // Cost filter is relaxed: allow routes up to 2.5x budget (they become "ambitious")
  if (budget !== null) query = query.lte('totalCostPerYear', Math.round(budget * 2.5))
  if (fieldOfStudy) query = query.ilike('fieldOfStudy', `%${fieldOfStudy}%`)
  if (ielts !== null) query = query.lte('ieltsRequired', ielts)

  const { data: universities, error } = await query
  if (error) {
    console.error('filteringService query error:', error)
    throw new Error(error.message || 'Route filtering failed')
  }

  const list = universities || []
  const routes = list.map(uni => {
    const minCgpa = Number(uni.minCgpa || 0)
    const totalCost = Number(uni.totalCostPerYear || 0)
    const gpaMargin = (cgpa || 0) - minCgpa
    const budgetDelta = (budget || 0) - totalCost

    let feasibility = 50
    feasibility += Math.min(30, gpaMargin * 15)
    feasibility += budgetDelta >= 0
      ? Math.min(20, (budgetDelta / 100000) * 5)
      : Math.max(-30, (budgetDelta / 100000) * 10)
    feasibility = Math.min(98, Math.max(15, Math.round(feasibility)))

    let tier = 'moderate'
    if (gpaMargin >= 0.5 && budgetDelta >= 0 && feasibility >= 75) tier = 'safe'
    else if (gpaMargin < 0.2 || budgetDelta < -200000 || feasibility < 50) tier = 'ambitious'

    const ranking = Number(uni.ranking || 999)
    const marketDemand = ranking < 100 ? 'Very High' : ranking < 300 ? 'High' : 'Medium'

    return {
      user_id: userId,
      university_id: uni.id,
      tier,
      university: uni.name,
      program: uni.program,
      country: uni.country,
      feasibility,
      total_cost: totalCost,
      pr_timeline: Number(uni.prTimelineMonths || 48),
      roi_vector: targetRole || uni.fieldOfStudy,
      market_demand: marketDemand
    }
  })

  await supabase.from('routes').delete().eq('user_id', userId)
  if (routes.length > 0) {
    const { error: insertErr } = await supabase.from('routes').insert(routes)
    if (insertErr) {
      console.error('routes insert error:', insertErr)
      throw new Error(insertErr.message || 'Failed to persist routes')
    }
  }
  return routes
}

module.exports = { generateRoutes }
