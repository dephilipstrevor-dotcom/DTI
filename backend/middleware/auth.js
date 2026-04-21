const jwt = require('jsonwebtoken')

const JWT_SECRET = (process.env.SUPABASE_JWT_SECRET || '').trim()

const terminalUnauthorized = (res, detail) =>
  res.status(401).json({
    error: 'UNAUTHORIZED',
    detail: `> TERMINAL: ${detail}`
  })

const authenticate = (req, res, next) => {
  if (!JWT_SECRET) {
    console.error('[auth] SUPABASE_JWT_SECRET is not configured')
    return res.status(500).json({
      error: 'AUTH_MISCONFIGURED',
      detail: '> TERMINAL: SUPABASE_JWT_SECRET missing. Operator credentials cannot be verified.'
    })
  }

  const header = req.headers.authorization || ''
  if (!header.toLowerCase().startsWith('bearer ')) {
    return terminalUnauthorized(res, 'bearer token required')
  }

  const token = header.slice(7).trim()
  if (!token) return terminalUnauthorized(res, 'empty bearer token')

  try {
    // Supabase signs access tokens (HS256) with the project JWT secret.
    // This verifies signature + expiry + issued-at locally, with no network I/O.
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })

    if (!payload || !payload.sub) {
      return terminalUnauthorized(res, 'token payload missing subject')
    }

    req.user = {
      id: payload.sub,
      email: payload.email || null,
      role: payload.role || null,
      aud: payload.aud || null,
      claims: payload
    }
    req.accessToken = token
    return next()
  } catch (err) {
    if (err && err.name === 'TokenExpiredError') {
      return terminalUnauthorized(res, 'token expired')
    }
    if (err && err.name === 'JsonWebTokenError') {
      return terminalUnauthorized(res, 'signature invalid')
    }
    return terminalUnauthorized(res, 'token rejected')
  }
}

module.exports = { authenticate }
