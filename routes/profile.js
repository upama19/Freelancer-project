const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer");
const authenticateTalent = require('../middleware/authTalent')
const authenticateEmployer = require('../middleware/authEmployer')
const {getProfile, updateProfile, deleteProfile, hireTalent } = require('../controller/profile')
const picturesUpload = upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "picturesOfWork", maxCount: 12 },
]);

router.route('/talent/profile/:id').get(authenticateTalent, getProfile).patch(authenticateTalent,picturesUpload ,updateProfile).delete(authenticateTalent,deleteProfile)
router.route('/employer/talent/profile/hire/:id').post(authenticateEmployer, hireTalent)

module.exports = router
