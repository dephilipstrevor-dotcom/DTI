const express = require('express')
const cors = require('cors')
require('dotenv').config()

const intakeRoutes = require('./routes/intakeRoutes')
const routeRoutes = require('./routes/routeRoutes')
// chat routes can be added later

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/intake', intakeRoutes)
app.use('/api/routes', routeRoutes)

app.get('/health', (req, res) => res.send('OK'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))