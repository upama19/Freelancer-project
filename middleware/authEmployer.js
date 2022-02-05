const Employer = require('../models/employer')
const jwt = require('jsonwebtoken')

const authEmployer = async (req, res, next) => {
    // check header 
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){

        throw new Error('Authentication Invalid')
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        if (payload.role === 'talent') {
            return res.status(400).send('Talent cannot access this resource')
        }

        const user = await Talent.findById({ _id: payload.userId })
        req.user = user
        req.token = token

        next()

    } catch (error) {
        throw new Error(error)
    }
}

module.exports = authEmployer