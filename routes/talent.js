const router = require('express').Router()
const Talent = require('../models/talent')
const authEmployer = require('../middleware/authEmployer')
const Portfolio = require('../models/portfolio')

// GET /talents?skill=Analyst&price=4000
// GET /talents?limit=10&skip=10
// GET /talents?sortBy=createdAt:asc
// This is basically the GET method for showing the employers with his hired talents
router.get('/talents', authEmployer, async(req, res) => {
    const match = {}
    const sort = {}

    if (req.query.skill) {
        match.skill = req.query.skill
    }

    if (req.query.price) {
        match.price = req.query.price
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await Employer.populate({
            path: 'talents',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(Employer.talents)
    } catch (error) {
        console.log(error)
    }
})

// GET /talentsAll?category=IT&servicesOffered=Graphics Designer&numericFilters=price>5000,rating>4.5&sort
router.get('/talentsAll', async(req, res) => {
    const queryObject = {}
    const { category, servicesOffered, numericFilters } = req.query

    if (category) {
        queryObject.category = { $regex: category, $options: 'i' }
    }

    if (servicesOffered) {
        queryObject.servicesOffered = { $regex: servicesOffered, $options: 'i' }
    }

    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        }

        const regExp = /\b(<|>|>=|=|<|<=)\b/g

        let filters = numericFilters.replace(regExp, (match) => `-${operatorMap[match]}-`) // price<5000 -> price-$gt-5000

        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')

            if (options.includes(field)) {
                queryObject[field] = {
                    [operator]: Number(value)
                }
            }
        })
    }

    let result = await Portfolio.find(queryObject)
    res.send(result)
        // sorting


})

module.exports = router