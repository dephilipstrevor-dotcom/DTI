const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const intakeRoutes = require('./routes/intakeRoutes')
const routeRoutes = require('./routes/routeRoutes')
const chatRoutes = require('./routes/chatRoutes')

const app = express()

// Trust the first proxy hop (Replit / autoscale / Fly) so rate-limit keys
// on the real client IP rather than the upstream proxy address.
app.set('trust proxy', 1)

// ---------- Security headers ----------
// helmet applies a baseline of hardened HTTP headers (X-Frame-Options,
// X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security, etc.).
// contentSecurityPolicy is disabled because the built frontend is served from
// the same origin and ships its own inline bootstrap; re-enable with a tuned
// policy once the frontend CSP is authored.
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

// ---------- CORS ----------
// Strict allow-list. Extend PRODUCTION_ORIGIN via env for real deploys.
const PRODUCTION_ORIGIN = process.env.PRODUCTION_ORIGIN || 'https://gradroute.example.com'
// This project pins Vite to port 5000 (gradroute-frontend/vite.config.js).
// 5173 is also allow-listed because it is the Vite default and convenient for
// contributors running the frontend with `vite --port 5173`.
const ALLOWED_ORIGINS = new Set([
  'http://localhost:5000',
  'http://localhost:5173',
  PRODUCTION_ORIGIN
])

app.use(cors({
  origin: (origin, cb) => {
    // Allow same-origin / server-to-server requests (no Origin header).
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.has(origin)) return cb(null, true)
    const err = new Error(`CORS: origin not allowed: ${origin}`)
    err.status = 403
    err.code = 'CORS_ORIGIN_DENIED'
    return cb(err)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '1mb' }))

// ---------- Rate limiting ----------
// Chat is the expensive, LLM-bound surface. Cap it hard.
// NOTE: chatLimiter is applied BEFORE authenticate on /api/chat by design:
// the LLM call is the costly surface, so we want to reject floods at the edge
// (including unauthenticated floods) before spending CPU on JWT verification.
// The 10 req/60s window per IP is generous for legitimate use; abuse via a
// shared NAT is bounded by that same ceiling.
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    detail: '> TERMINAL: throttle engaged. Max 10 chat ops / 60s. Cool down and retry.'
  }
})

// ---------- Routes ----------
app.use('/api/intake', intakeRoutes)
app.use('/api/routes', routeRoutes)
app.use('/api/chat', chatLimiter, chatRoutes)

app.get('/health', (req, res) => res.send('OK'))

// ---------- CORS error handler ----------
// Convert CORS_ORIGIN_DENIED errors into a proper 403 JSON response instead
// of falling through to Express's default 500 handler. The browser blocks the
// response at the CORS layer regardless, but 403 is the correct status for
// tools and logs that do read the body.
app.use((err, req, res, next) => {
  if (err && err.code === 'CORS_ORIGIN_DENIED') {
    return res.status(err.status || 403).json({
      error: 'CORS_ORIGIN_DENIED',
      detail: '> TERMINAL: origin not on allow-list.'
    })
  }
  return next(err)
})

// ---------- Static frontend ----------
const distDir = path.join(__dirname, '..', 'gradroute-frontend', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`))
