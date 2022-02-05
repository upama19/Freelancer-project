const router = require("express").Router();
const Talent = require("../models/talent");
const authTalent = require("../middleware/authTalent");
const upload = require("../middleware/multer");
const fs = require("fs");
const Portfolio = require('../models/portfolio')
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
  async (req, res) => {
    const img = req.files['profilePicture']
    let profilePicture = undefined;
    // if image was uploaded
    if (img) {
        profilePicture = img[0].toString('base64')
    }
    
    const picturesOfWork = req.files['picturesOfWork']
    let picturesArray = []
    if (picturesOfWork) {
        picturesArray = picturesOfWork.map(pictureFile => {
            let picture = fs.readFileSync(pictureFile.path)
            return picture.toString('base64')
        })
    }

    const skills = req.body.listOfSkills;
    const listOfSkills = [];
    console.log(skills)
    if (skills) {
      console.log(typeof skills)
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
            picturesArray,
            createdBy: req.user._id
        })
        res.status(201).send(portfolio)
    } catch (error) {
        console.log(error)
    }

    //res.send("You are a freelancer and you can access this resource");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
