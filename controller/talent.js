const Portfolio = require('../models/portfolio')

const getAllTalents = async(req, res) => {
    const queryObject = {}
    const { category, servicesOffered, numericFilters, sort } = req.query

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

        const options = ['price', 'averageRating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')

            if (options.includes(field)) {
                queryObject[field] = {
                    [operator]: Number(value)
                }
            }
        })
    }

    // let result = await Portfolio.find(queryObject)
    // console.log(result.length)
    // res.send(result)
    // sorting
    let sortList;
    if (sort) {
        sortList = sort.split(',').join(' ')
    } else {
        sortList = 'createdAt'
    }

    //pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const talents = await Portfolio.find(queryObject).sort(sortList).skip(skip).limit(limit)

    res.status(200).json({ talents, noOfTalents: talents.length })
}

module.exports = {
    getAllTalents
}