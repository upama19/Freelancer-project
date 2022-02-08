const mongoose = require('mongoose')

const RatingSchema = new mongoose.Schema({
    rating:{
        type:Number,
        default: 0,
        maxlength:5,
    },
    ratedBy:{
        type: mongoose.Types.ObjectId,
        ref: 'Employer',
    },
    ratedTo:{
        type: mongoose.Types.ObjectId,
        ref: 'Portfolio'
    },

})

module.exports = mongoose.model('Rating', RatingSchema)


