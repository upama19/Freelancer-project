const Talent = require('../models/talent')
const jwt = require('jsonwebtoken')


const auth = async (req,res, next) => {

    // check header 
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){

        throw new Error('Authentication Invalid')

    }

    const token = authHeader.split(' ')[1]

    try {
        
        const payload = jwt.verift(token, process.env.JWT_SECRET)
        

    } catch (error) {
        
    }



}
