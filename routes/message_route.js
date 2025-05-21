const express = require('express');
const router = express.Router();
const {sendMessage, getMessages} = require('../controller/message_controller')

router.post('/send-message', sendMessage);
router.get('/get-message', getMessages);

module.exports = router;