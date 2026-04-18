// src/utils/routeGenerator.js
export const generateRoutes = (intakeData) => {
  const { cgpa, budget, backlogs = 0, ielts, gre, targetRole, degreeLevel } = intakeData
  const routes = []

  // Safe: German public universities (low cost)
  if (cgpa >= 7.5 && backlogs <= 2) {
    routes.push({
      tier: 'safe',
      university: 'TU Munich',
      program: 'M.Sc. Computational Science and Engineering',
      country: 'Germany',
      feasibility: cgpa >= 8.5 ? 92 : 85,
      total_cost: 1200000,
      pr_timeline: 48,
      roi_vector: targetRole || 'High-Performance Computing',
      market_demand: 'High'
    })
    routes.push({
      tier: 'safe',
      university: 'RWTH Aachen',
      program: 'M.Sc. Software Systems Engineering',
      country: 'Germany',
      feasibility: cgpa >= 8.0 ? 88 : 80,
      total_cost: 1100000,
      pr_timeline: 48,
      roi_vector: 'Embedded Systems',
      market_demand: 'High'
    })
  }

  // Moderate: Canada with higher cost but good PR
  if (budget >= 2000000) {
    const feasibility = cgpa >= 8.0 ? 75 : 65
    routes.push({
      tier: 'moderate',
      university: 'University of Waterloo',
      program: 'M.Eng. Electrical and Computer Engineering',
      country: 'Canada',
      feasibility,
      total_cost: 2800000,
      pr_timeline: 36,
      roi_vector: 'Systems Engineering',
      market_demand: 'Very High'
    })
    routes.push({
      tier: 'moderate',
      university: 'University of Toronto',
      program: 'M.Sc. Computer Science',
      country: 'Canada',
      feasibility: feasibility - 5,
      total_cost: 3200000,
      pr_timeline: 36,
      roi_vector: 'AI/ML Engineering',
      market_demand: 'High'
    })
  }

  // Ambitious: Elite schools
  if (cgpa >= 8.5 && (gre >= 320 || ielts >= 7.5)) {
    routes.push({
      tier: 'ambitious',
      university: 'ETH Zurich',
      program: 'M.Sc. Computer Science',
      country: 'Switzerland',
      feasibility: cgpa >= 9.0 ? 55 : 45,
      total_cost: 3500000,
      pr_timeline: 72,
      roi_vector: 'AI/ML Research',
      market_demand: 'Elite'
    })
  }

  return routes
}