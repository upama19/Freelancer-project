const router = require('express').Router()

const { registerEmployer, registerTalent, login } = require('../controller/authUser')

// Registration
router.post('/register/employer',registerEmployer)
router.post('/register/talent',registerTalent)

// Login
router.post('/login',login)

module.exports = router
