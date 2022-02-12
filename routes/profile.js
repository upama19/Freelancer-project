const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const authenticateTalent = require('../middleware/authTalent');
const authenticateEmployer = require('../middleware/authEmployer');
const {
  getAuthProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  hireTalent,
  handleHireTalent,
} = require('../controller/profile');
const picturesUpload = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'picturesOfWork', maxCount: 12 },
]);

router.route('/profile/me').get(authenticateTalent, getAuthProfile);
router
  .route('/talent/profile/:id')
  .get(getProfile)
  .patch(authenticateTalent, updateProfile)
  .delete(authenticateTalent, deleteProfile);
router
  .route('/employer/talent/profile/hire/:id')
  .get(authenticateEmployer, hireTalent);
router
  .route('/employer/talent/profile/hire')
  .post(authenticateEmployer, handleHireTalent);

module.exports = router;
