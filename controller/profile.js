const Portfolio = require('../models/portfolio')
const { StatusCodes } = require('http-status-codes')
const res = require('express/lib/response')
const fs = require("fs");
const nodemailer = require('nodemailer');
const Talent = require('../models/talent');

//Profile page displays the data from portfolio module through get request
const getAuthProfile = async (req, res) => {
    const profile = await Portfolio.findOne({
        createdBy: req.user._id,
    })

    res.json({ user: req.user, profile: profile })
}

const getProfile = async (req, res) => {
    const {
        params: { id: profileId },
    } = req

    const profile = await Portfolio.findOne({
        _id: profileId,
    })

    if (!profile) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: `No talent with ID ${profileId} found` })

    }

    res.status(StatusCodes.OK).json({ profile })

}

//talent has access to update their profile directlt from their profile
const updateProfile = async (req, res) => {

    const img = req.files['profilePicture']
    let profilePicture = undefined;
    // if image was uploaded
    if (img) {
        profilePicture = 'data:image/jpg;base64,' + fs.readFileSync(img[0].path).toString('base64')
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
        return res.status(StatusCodes.BAD_REQUEST).json({ error: `No talent with ID ${profileId} found` })

    }

    if (fullName === '') {
        
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Name cannot be empty'})
    }
    if (description === '') {

        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Description cannot be empty'})
    }

    if (price === '') {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Price cannot be empty' })
    }
    if (category === '') {

        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Category cannot be empty'})
    }
    if (serviceOffered === '') {

        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'ServviceOffered cannot be empty' })
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
        servicesOffered: req.body.serviceOffered,
        category: req.body.category,
        createdBy: req.user._id
    }


    profile = await Portfolio.findByIdAndUpdate({ _id: profileId, createdBy: userId },
        req.body, { new: true, runValidators: true })

    res.status(StatusCodes.OK).json({profile})

}

//talent can delete their profile if thet want to

const deleteProfile = async (req, res) => {


    const {
        params: { id: profileId },
        user: { _id: userId }
    } = req
    const profile = await Portfolio.findByIdAndRemove({
        _id: profileId,
        createdBy: userId,

    })
    if (!profile) {

        return res.status(StatusCodes.BAD_REQUEST).json({ error: `No talent with ID ${profileId} found` })

    }

    res.status(StatusCodes.OK).json({message:"Your profile has been successfully deleted."})
}

// when employer clicks hire it navigates to different page by posting some response 
const hireTalent = async(req, res) => {
    res.status(StatusCodes.OK).json({message:"You can provide your information now"})
}

// Send mail to talent once employer hires 
const handleHireTalent = async(req, res) => {
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "84bab139c6147d",
            pass: "bff5ebe28877cd"
        }
    });

    try {
        const talent = await Talent.findOne({ _id: req.params.id })

        const mailOptions = {
            from: req.body.name + ' ' + req.user.email,
            to: talent.email,
            subject: 'Hire Request',
            text: req.body.message,
            html: `Mobile Number: ${req.body.mobileNumber} <br/>
                    Address: ${req.body.address} <br/>
                    Hire Duration: ${req.body.hireDuration} <br/>
                    Message: ${req.body.message} <br/>`
        }

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({ error: error.message })
            }
        })

        res.status(200).json({ message: 'Mail delieverd' })
    } catch (error) {
        res.status(500).json({ error: 'Cannot find the talent' })
    }
}

module.exports = {
    getAuthProfile,
    getProfile,
    updateProfile,
    deleteProfile,
    hireTalent,
    handleHireTalent,
}