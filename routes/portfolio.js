const router = require('express').Router()
const req = require('express/lib/request')
const authenticateTalent = require('../middleware/authentication')
const upload = require('../middleware/multer')
const fs = require('fs')
// const { storePortfolioForm } = require('../controller/portfolio')

// const { saveProfilePicture, deleteProfilePicture, getProfilePicture } = require('../controller/portfolio')

// Need to add an authentication middleware --> later
// router.post('/talent/my_portfolio/profilePicture', upload.single('profilePicture'), saveProfilePicture)
// router.delete('talent/my_portfolio/profilePicture', deleteProfilePicture)

// To get the profile picture (to see it in the browser), so for now, doesn't require authentication
// router.get('talent/my_portfolio/profilePicture', getProfilePicture)

const picturesUpload = upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'picturesOfWork', maxCount: 12 }
])

router.post('/talent/my_portfolio', authenticateTalent, picturesUpload, async (req, res) => {
    const img = req.files['profilePicture']

    // if image was uploaded
    if (img) {
        profilePicture = img[0].toString('base64')
    }

    const picturesOfWork = req.files['picturesOfWork']

    if (picturesOfWork) {
        const picturesArray = picturesOfWork.map(pictureFile => {
            let picture = fs.readFileSync(pictureFile.path)
            return picture.toString('base64')
        })
        console.log(picturesArray.length)
        return res.send(picturesArray)
    }

    res.send('You are a freelancer and you can access this resource')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

module.exports = router