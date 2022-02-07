const Portfolio = require('../models/portfolio')
const { StatusCodes } = require('http-status-codes')
const res = require('express/lib/response')
const fs = require("fs");


//Profile page displays the data from portfolio module through get request
const getAuthProfile = (req, res) => {
    res.json(req.user)
}

const getProfile = async(req, res) => {
    const {
        user: { _id: userId },
    } = req

    const profile = await Portfolio.findOne({
        _id: userId,

    })

    if (!profile) {
        throw new Error(`No talent with ID ${profileId} found`)

    }

    res.status(StatusCodes.OK).json({ profile })

}

//talent has access to update their profile directlt from their profile
const updateProfile = async(req, res) => {

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
    let listOfSkills = [];
    if (skills) {
        skills.forEach((skill) => {
            listOfSkills.push({
                skill,
            });
        });
    }

    const projects = req.body.projectsDone;
    let projectsDone = [];
    if (projects) {
        projects.forEach((project) => {
            projectsDone.push({
                project,
            });
        });
    }




    const {
        body: { fullName, description, price, category, serviceOffered },
        user: { _id: userId },
        params: { id: profileId },
    } = req
    let profile = await Portfolio.findOne({
        _id: profileId,
        createdBy: userId,
    })

    if (!profile) {
        throw new Error(`No talent with ID ${profileId} found`)

    }

    if (fullName === '') {
        throw new Error('Name cannot be empty')
    }
    if (description === '') {
        throw new Error('Description cannot be empty')
    }

    if (price === '') {
        throw new Error('Price cannot be empty')
    }
    if (category === '') {
        throw new Error('Categopry cannot be empty')
    }
    if (serviceOffered === '') {
        throw new Error('ServviceOfered cannot be empty')
    }

    if (listOfSkills.length === 0) {
        listOfSkills = listOfSkills.concat(profile.listOfSkills)
    }
    if (projectsDone.length === 0) {
        projectsDone = projectsDone.concat(profile.projectsDone)
    }
    if (picturesOfWork.length === 0) {
        picturesOfWork = picturesOfWork.concat(profile.picturesOfWork)
    }

    // listOfSkills = profile.listOfSkills.concat(listOfSkills)
    // projectsDone = profile.projectsDone.concat(projectsDone)
    // picturesOfWork = profile.picturesOfWork.concat(picturesOfWork)

    req.body = {
        fullName: req.body.fullName,
        profilePicture,
        description: req.body.description,
        listOfSkills,
        projectsDone,
        price: req.body.price,
        picturesOfWork,
        servicesOffered:req.body.serviceOffered,
        category:req.body.category,
        createdBy: req.user._id
    }


    profile = await Portfolio.findByIdAndUpdate({ _id: profileId, createdBy: userId },
        req.body, { new: true, runValidators: true })

    res.status(StatusCodes.OK).send(profile)

}

//talent can delete their profile if thet want to

const deleteProfile = async(req, res) => {


    const {
        params: { id: profileId },
        user: { _id: userId }
    } = req
    const profile = await Portfolio.findByIdAndRemove({
        _id: profileId,
        createdBy: userId,

    })
    if (!profile) {
        throw new Error(`No talent with ID ${profileId} found`)

    }

    res.status(StatusCodes.OK).send()
}

//when employer clicks hire it navigates to different page by posting some response 

const hireTalent = async(req, res) => {
    res.send('You are authorized...')
}

module.exports = {
    getAuthProfile,
    getProfile,
    updateProfile,
    deleteProfile,
    hireTalent,
}