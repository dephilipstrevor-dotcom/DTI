import { supabase } from '../lib/supabaseClient'

export const saveGeneratedRoutes = async (userId, routes) => {
  // Delete old routes first
  await supabase.from('routes').delete().eq('user_id', userId)
  
  const { data, error } = await supabase
    .from('routes')
    .insert(routes.map(r => ({ ...r, user_id: userId })))
    .select()
  return { data, error }
}

export const fetchUserRoutes = async (userId) => {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('user_id', userId)
    .order('feasibility', { ascending: false })
  return { data, error }
}