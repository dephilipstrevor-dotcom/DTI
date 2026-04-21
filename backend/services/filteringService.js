const { supabase } = require('../config/supabase')

const generateRoutes = async (userId, intake) => {
  const { degreeLevel, fieldOfStudy, cgpa, backlogs = 0, ielts, budget, targetRole } = intake

  let query = supabase
    .from('universities')
    .select('*')
    .eq('degreeLevel', degreeLevel)
    .lte('minCgpa', parseFloat(cgpa))
    .lte('maxBacklogs', parseInt(backlogs))
    .lte('totalCostPerYear', parseInt(budget))

  if (fieldOfStudy) query = query.ilike('fieldOfStudy', `%${fieldOfStudy}%`)
  if (ielts) query = query.lte('ieltsRequired', parseFloat(ielts))

  const { data: universities, error } = await query
  if (error) throw error

  const routes = universities.map(uni => {
    const gpaMargin = cgpa - uni.minCgpa
    const budgetDelta = budget - uni.totalCostPerYear

    let feasibility = 50
    feasibility += Math.min(30, gpaMargin * 15)
    feasibility += budgetDelta > 0 ? Math.min(20, (budgetDelta / 100000) * 5) : Math.max(-20, (budgetDelta / 100000) * 10)
    feasibility = Math.min(98, Math.max(20, Math.round(feasibility)))

    let tier = 'moderate'
    if (gpaMargin >= 0.5 && budgetDelta >= 0 && feasibility >= 75) tier = 'safe'
    else if (gpaMargin < 0.2 || budgetDelta < -200000 || feasibility < 50) tier = 'ambitious'

    return {
      user_id: userId,
      tier,
      university: uni.name,
      program: uni.program,
      country: uni.country,
      feasibility,
      total_cost: uni.totalCostPerYear,
      pr_timeline: uni.prTimelineMonths || 48,
      roi_vector: targetRole || uni.fieldOfStudy,
      market_demand: uni.ranking < 100 ? 'Very High' : uni.ranking < 300 ? 'High' : 'Medium'
    }
  })

  await supabase.from('routes').delete().eq('user_id', userId)
  if (routes.length > 0) await supabase.from('routes').insert(routes)
  return routes
}

module.exports = { generateRoutes }