const { supabaseAuth } = require('../config/supabase')

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'No token' })

  const token = authHeader.split(' ')[1]
  const { data: { user }, error } = await supabaseAuth.auth.getUser(token)

  if (error || !user) return res.status(401).json({ error: 'Invalid token' })

  req.user = user
  next()
}

module.exports = { authenticate }