const Portfolio = require('../models/portfolio')
const fs = require('fs')
const postPortfolioForm = async(req, res) => {
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
            createdBy: req.user._id,
            category: req.body.category,
            servicesOffered: req.body.servicesOffered
        })
        res.status(201).send(portfolio)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Your portfolio already exists' })
        }

        res.status(400).json({error: error.message})
    }

    //res.send("You are a freelancer and you can access this resource");
}

module.exports = {
    postPortfolioForm
}