const {
    StatusCodes
} = require('http-status-codes')

const Rating = require('../models/ratings')
const Portfolio = require('../models/portfolio')
const postRating = async (req, res) => {

    const {
        user: {
            _id: userId
        },
        params: {
            id: profileId
        },
        body: {
            rating
        },
    } = req

    let profile = await Rating.findOne({
        ratedTo: profileId,
        ratedBy: userId,
    })

    if (!profile) {
        profile = await Rating.create({
            rating: req.body.rating,
            ratedTo: profileId,
            ratedBy: userId,
        })
    }

    if (profile) {
        profile = await Rating.updateOne({
            ratedTo: profileId,
            ratedBy: userId,
        }, {
            rating: req.body.rating
        })
    }
    //calculate avearge
    let talentRatings = await Rating.find({
        ratedTo: profileId
    })
    let count = await Rating.countDocuments({
        ratedTo: profileId
    })
    // console.log(count);
    // console.log(talentRatings);

    let ratingSum = 0;
    let ratingAverage = 0;
    if (talentRatings) {
        // console.log(talentRatings)

        talentRatings.forEach((rating) => {
            // console.log(rating)
            // console.log(rating.rating)
            ratingSum += rating.rating;
        })
        // console.log(ratingSum)
        // console.log(count)

        ratingAverage = ratingSum / count;
        // console.log(ratingAverage)

        const portfolio = await Portfolio.updateOne({
            _id: profileId,
        }, {
            averageRating: ratingAverage,
        })
    }

    res.status(StatusCodes.OK).json({ message:`You have rated ${req.body.rating} stars`})
}


module.exports = {
    postRating,

}