const router = require("express").Router();
const authTalent = require("../middleware/authTalent");
const upload = require("../middleware/multer");
const fs = require("fs");
const Portfolio = require('../models/portfolio');
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

router.post(
    "/talent/my_portfolio",
    authTalent,
    picturesUpload,
    async(req, res) => {
        const img = req.files['profilePicture']
        let profilePicture = undefined;
        // if image was uploaded
        if (img) {
            profilePicture = fs.readFileSync(img[0].path).toString('base64')
        }

        const picturesArray = req.files['picturesOfWork']
        let picturesOfWork = []
        if (picturesArray) {
            picturesOfWork = picturesArray.map(pictureFile => {
                let picture = fs.readFileSync(pictureFile.path)
                    // return picture.toString('base64')
                return {
                    workPicture: picture.toString('base64')
                }
            })
        }

        const skills = req.body.listOfSkills;
        const listOfSkills = [];
        if (skills) {
            skills.forEach((skill) => {
                listOfSkills.push({
                    skill,
                });
            });
        }

        const projects = req.body.projectsDone;
        const projectsDone = [];
        if (projects) {
            projects.forEach((project) => {
                projectsDone.push({
                    project,
                });
            });
        }

        try {
            const portfolio = await Portfolio.create({
                fullName: req.body.fullName,
                profilePicture,
                description: req.body.description,
                listOfSkills,
                projectsDone,
                price: req.body.price,
                picturesOfWork,
                createdBy: req.user._id
            })
            res.status(201).send(portfolio)
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ error: 'Your portfolio already exists' })
            }

            res.status(400).send(error.message)
        }

        //res.send("You are a freelancer and you can access this resource");
    },
    (error, req, res, next) => {
        res.status(400).send(error);
    }
);

module.exports = router;