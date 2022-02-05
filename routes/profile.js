const express = require('express')
const router = express.Router()
const authenticateTalent = require('../middleware/authentication')
const authenticateEmployer = require('../middleware/authentication_Employer')
const {getProfile, updateProfile, deleteProfile, hireTalent } = require('../controller/profile')


router.route('/talent/profile/:id').get(getProfile).patch(authenticateTalent,updateProfile).delete(authenticateTalent,deleteProfile)
router.route('/employer/talent/profile/hire/:id').post(authenticateEmployer, hireTalent)

module.exports = router
