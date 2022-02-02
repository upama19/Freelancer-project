const router = require('express').Router()

const { portfolioSetup } = require('../controller/talentVerify')

router.post('/login/talent/portfolio',portfolioSetup)



module.exports = router


