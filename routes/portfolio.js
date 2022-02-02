const router = require('express').Router()
const multer = require('multer')

const { saveProfilePicture, deleteProfilePicture, getProfilePicture } = require('../controller/portfolio')

// Portfolio 

// 1. Profile Picture
const upload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file'))
        }

        cb(undefined, true)
    }
});

// Need to add an authentication middleware --> later
router.post('/talent/my_portfolio/profilePicture', upload.single('profilePicture'), saveProfilePicture)
router.delete('talent/my_portfolio/profilePicture', deleteProfilePicture)

// To get the profile picture (to see it in the browser), so for now, doesn't require authentication
router.get('talent/:id/profilePicture', getProfilePicture)


// 2. Pictures of Work

module.exports = router