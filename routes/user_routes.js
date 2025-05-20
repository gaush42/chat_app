const express = require('express')
const router = express.Router()
const {RegisterUser} = require('../controller/user_controller')


router.post("/signup", RegisterUser)

module.exports = router