const { ref } = require('joi')
const mongoose = require('mongoose')

const PortfolioSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:[true, 'Please provide your name'],
        maxlength:100,
        minlength:[7, 'Name is too short'],
    },

    profilePicture:{
        img:{
            data: Buffer,
            ContentType:String,
        }
    },

    description:{
        type:String,
        required:[true, 'Please provide your description'],
        
    },

    listofSkills:{
        type:Array,
        required:[true, 'Please provide your skills '],

    },

    projectDone :{
        type:Array,


    },

    price:{
        type: Number,

    },

    picturesWork: {
        img:{
            data: Buffer,
            ContentType:String,
        },
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'Portfolio',
        required: [true, 'Please provide usser']
    },

},{timestamps:true})


module.exports = mongoose.model('Portfolio', PortfolioSchema)

