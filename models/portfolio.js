// const { ref } = require('joi')
const mongoose = require('mongoose')

const PortfolioSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide your name'],
        maxlength: 100,
        minlength: [7, 'Name is too short'],
    },
    profilePicture: {
        type: String
    },
    description: {
        type: String,
        required: [true, 'Please provide your description'],
    },
    listOfSkills: [{
        skill: {
            type: String,
            required: true
        }
    }],
    projectsDone: [{
        project: {
            type: String,
        }
    }],
    price: {
        // charge for service
        type: Number,
        required: true
    },
    picturesOfWork: [{
        workPicture: {
            type: String,
        }
    }],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'talent',
        required: [true, 'Please provide user'],
        unique: true
    },

}, { timestamps: true })


module.exports = mongoose.model('Portfolio', PortfolioSchema)