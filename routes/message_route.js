const express = require('express');
const router = express.Router();
const {sendMessage} = require('../controller/message_controller')

router.post('/send-message', sendMessage);

module.exports = router;