const router = require('express').Router()

const {registerEmployer, registerTalent, loginEmployer, loginTalent} = require('../controller/authUser')


router.post('/register/employer',registerEmployer)
router.post('/register/talent',registerTalent)

router.post('/login/employer',loginEmployer)
router.post('/login/talent',loginTalent)


module.exports = router
