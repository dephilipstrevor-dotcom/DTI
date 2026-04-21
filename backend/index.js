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
    return cb(new Error(`CORS: origin not allowed: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '1mb' }))

// ---------- Rate limiting ----------
// Chat is the expensive, LLM-bound surface. Cap it hard.
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
const distDir = path.join(__dirname, '..', 'gradroute-frontend', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`))
