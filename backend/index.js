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
// Fail-closed on NODE_ENV: dev origins are only allow-listed when NODE_ENV is
// explicitly 'development'. Any other value (including unset, 'production',
// 'test', 'staging', typos) collapses the allow-list to PRODUCTION_ORIGIN only
// so a forgotten NODE_ENV in prod can never leak localhost through CORS.
// This project pins Vite to port 5000 (gradroute-frontend/vite.config.js);
// 5173 is kept for contributors running `vite --port 5173`.
const ALLOW_DEV_ORIGINS = process.env.NODE_ENV === 'development'
const DEV_ORIGINS = [
  'http://localhost:5000',
  'http://localhost:5173'
]
const ALLOWED_ORIGINS = new Set(
  ALLOW_DEV_ORIGINS ? [...DEV_ORIGINS, PRODUCTION_ORIGIN] : [PRODUCTION_ORIGIN]
)

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

// ---------- Static frontend ----------
// SPA fallback. The regex excludes `/api/*` AND `/health` so the intent
// doesn't rely on Express route-ordering being preserved in future edits.
// Static assets (css/js/img under distDir) are served by express.static
// above; anything else that's not an API call or the health probe falls
// back to index.html so client-side routing can handle it.
const distDir = path.join(__dirname, '..', 'gradroute-frontend', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^\/(?!api\/|health$).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

// ---------- CORS error handler ----------
// Convert CORS_ORIGIN_DENIED errors into a proper 403 JSON response instead
// of falling through to Express's default 500 handler. The browser itself
// will block the response body at the CORS layer, so a human in a browser
// never sees it — but the JSON body is still useful for: (1) server-side
// access logs, (2) curl / Postman / CI probes that don't enforce CORS, and
// (3) same-origin tooling that hits the API directly. 403 is the correct
// status either way.
app.use((err, req, res, next) => {
  if (err && err.code === 'CORS_ORIGIN_DENIED') {
    if (res.headersSent) return next(err)
    return res.status(err.status || 403).json({
      error: 'CORS_ORIGIN_DENIED',
      detail: '> TERMINAL: origin not on allow-list.'
    })
  }
  return next(err)
})

// ---------- Catch-all error handler ----------
// Final sink for any error not handled above, registered AFTER every route
// (including the static-frontend fallback) so sendFile / stream errors also
// land here. Logs server-side and responds with a sanitized terminal-style
// JSON payload so Express's default HTML stack-trace renderer is never
// exposed to clients (including in dev). If headers were already sent
// mid-stream, delegate to Express's default finalizer to close the socket.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[unhandled error]', err)
  if (res.headersSent) return next(err)
  const status = err && Number.isInteger(err.status) ? err.status : 500
  res.status(status).json({
    error: 'INTERNAL_ERROR',
    detail: '> TERMINAL: uplink fault. Request terminated.'
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`))
