const express = require('express')
const { generate, getAll, getOne, toggleSaved } = require('../controllers/routeController')
const { authenticate } = require('../middleware/auth')
const router = express.Router()
router.post('/generate', authenticate, generate)
router.get('/', authenticate, getAll)
router.get('/:id', authenticate, getOne)
router.patch('/:id/saved', authenticate, toggleSaved)
module.exports = router