const router = require('express').Router()
const { getAllTalents } = require('../controller/talent')
    // const authEmployer = require('../middleware/authEmployer')


// GET /talents?skill=Analyst&price=4000
// GET /talents?limit=10&skip=10
// GET /talents?sortBy=createdAt:asc
// This is basically the GET method for showing the employers with his hired talents
// router.get('/talents', authEmployer, async(req, res) => {
//     const match = {}
//     const sort = {}

//     if (req.query.skill) {
//         match.skill = req.query.skill
//     }

//     if (req.query.price) {
//         match.price = req.query.price
//     }

//     if (req.query.sortBy) {
//         const parts = req.query.sortBy.split(':')
//         sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
//     }

//     try {
//         await Employer.populate({
//             path: 'talents',
//             match,
//             options: {
//                 limit: parseInt(req.query.limit),
//                 skip: parseInt(req.query.skip),
//                 sort
//             }
//         }).execPopulate()

//         res.send(Employer.talents)
//     } catch (error) {
//         console.log(error)
//     }
// })

// GET /talentsAll?category=IT&servicesOffered=Graphics Designer&numericFilters=price>5000,rating>4.5&sort
router.get('/talentsAll', getAllTalents)

module.exports = router