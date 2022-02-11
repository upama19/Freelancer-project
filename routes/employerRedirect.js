const router = require('express').Router()
const authenticateEmployer = require('../middleware/authEmployer')

const { employerHome, employerServices, employerProfile, getAuthEmployer} = require('../controller/employerRediect')

router.post('/home/:id',authenticateEmployer, employerHome)
router.post('/services/:id',authenticateEmployer, employerServices)
router.post('/profile/:id',authenticateEmployer, employerProfile)
router.get('/employer/me',authenticateEmployer, getAuthEmployer)

module.exports = router