const express = require('express')
const router = express.Router()
const {RegisterUser, Login} = require('../controller/user_controller')


router.post("/signup", RegisterUser)
router.post("/login",Login)

module.exports = router