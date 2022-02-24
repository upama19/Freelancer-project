const Portfolio = require('../models/portfolio')
const fs = require('fs')

const cloudinary = require('cloudinary').v2;


const postPortfolioForm = async (req, res) => {
    // const img = req.files['profilePicture']
    // let profilePicture = undefined;
    // // if image was uploaded

    console.log('hello');
    console.log(req.body);
    console.log(req.files);

    const img = await cloudinary.uploader.upload(
        req.files.profilePicture.tempFilePath, {
            use_filename: true,
            folder: 'file-upload',
        }
    );
    fs.unlinkSync(req.files.profilePicture.tempFilePath);
    // console.log(img);
    console.log(req)
    console.log(  req.body.listOfSkills[0])
    // console.log(profilePicture)

    // if (img) {
    //     profilePicture = 'data:image/jpg;base64,' + fs.readFileSync(img[0].path).toString('base64')
    // }
    // const picturesArray = req.files['picturesOfWork']
    // let picturesOfWork = []
    // if (picturesArray) {
    //     picturesOfWork = picturesArray.map(pictureFile => {
    //         let picture = fs.readFileSync(pictureFile.path)
    //         // return picture.toString('base64')
    //         return {
    //             workPicture: picture.toString('base64')
    //         }
    //     })
    // }

    const skills = req.body.listOfSkills;
    const listOfSkills = [];
    if (skills) {
        Object.keys(skills).forEach(function(skill) {
            listOfSkills.push({
                skill:skills[skill]
            });
        });
    }
    console.log(listOfSkills)

    const projects = req.body.projectsDone;
    const projectsDone = [];
    if (projects) {
        
        Object.keys(projects).forEach((project) => {
            projectsDone.push({
                project:projects[project]
            });
        });
    }

    try {
        const portfolio = await Portfolio.create({
            fullName: req.body.fullName,
            profilePicture: img.secure_url,
            description: req.body.description,
            listOfSkills,
            projectsDone,
            price: req.body.price,
            createdBy: req.user._id,
            category: req.body.category,
            servicesOffered: req.body.servicesOffered
        })
        res.status(201).send(portfolio)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                error: 'Your portfolio already exists'
            })
        }

        res.status(400).json({
            error: error.message
        })
    }

    //res.send("You are a freelancer and you can access this resource");
}

module.exports = {
    postPortfolioForm
}