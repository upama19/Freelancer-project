const router = require('express').Router()

const {registerEmployer, registerTalent, login} = require('../controller/authUser')


router.post('/register/employer',registerEmployer)
router.post('/register/talent',registerTalent)

router.post('/login',login)


module.exports = router
