const Talent = require('../models/talent')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    // check header 
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){

        throw new Error('Authentication Invalid')
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        if (payload.role === 'employer') {
            return res.status(400).send('Employer cannot access this resource')
        }

        const user = await Talent.findById({ _id: payload.userId })
        req.user = user

        next()

    } catch (error) {
        throw new Error(error)
    }
}

module.exports = auth

