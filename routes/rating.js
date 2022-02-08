const router = require('express').Router()


const { postRating} = require('../controller/rating')
const authenticateEmployer = require('../middleware/authEmployer')

//ratings

router.post('/employer/rating/:id',authenticateEmployer,  postRating)


module.exports = router