const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const intakeRoutes = require('./routes/intakeRoutes')
const routeRoutes = require('./routes/routeRoutes')
const chatRoutes = require('./routes/chatRoutes')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/intake', intakeRoutes)
app.use('/api/routes', routeRoutes)
app.use('/api/chat', chatRoutes)

app.get('/health', (req, res) => res.send('OK'))

const distDir = path.join(__dirname, '..', 'gradroute-frontend', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`))