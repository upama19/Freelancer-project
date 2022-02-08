const router = require("express").Router();
const authTalent = require("../middleware/authTalent");
const upload = require("../middleware/multer");
const { postPortfolioForm } = require('../controller/portfolio')
    // const { storePortfolioForm } = require('../controller/portfolio')

// const { saveProfilePicture, deleteProfilePicture, getProfilePicture } = require('../controller/portfolio')

// Need to add an authentication middleware --> later
// router.post('/talent/my_portfolio/profilePicture', upload.single('profilePicture'), saveProfilePicture)
// router.delete('talent/my_portfolio/profilePicture', deleteProfilePicture)

// To get the profile picture (to see it in the browser), so for now, doesn't require authentication
// router.get('talent/my_portfolio/profilePicture', getProfilePicture)

const picturesUpload = upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "picturesOfWork", maxCount: 12 },
]);

router.post("/talent/my_portfolio", authTalent, picturesUpload, postPortfolioForm,
    (error, req, res, next) => {
        res.status(400).send(error);
    });

module.exports = router;