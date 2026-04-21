const express = require('express')
const { sendMessage } = require('../controllers/chatController')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.post('/message', authenticate, sendMessage)

module.exports = router