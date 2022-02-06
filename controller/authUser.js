const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs')

const Employer = require('../models/employer');
const Talent = require('../models/talent');

const registerEmployer = async (req,res)=>{
    const employer = await Employer.create({ 
        ...req.body,
        role: 'employer'
    })
    const token =  await employer.createJWT()

    res.status(StatusCodes.CREATED).json({employer, token})
}

const registerTalent = async (req,res) =>{
    const talent = await Talent.create({ 
        ...req.body,
        role: 'talent' 
    })
    const token =  await talent.createJWT()

    res.status(StatusCodes.CREATED).json({talent, token})
}

const loginEmployer = async (req,res) =>{
    const {email, password } = req.body

    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Please provide email and password.' })
    }

    
    const employer = await Employer.findOne({email})
    
    if(!employer) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid credentials' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, employer.password)

    if(!isPasswordCorrect) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid credentials' })
    }

    const token = employer.createJWT()
    res.status(StatusCodes.OK).json({employer, token})
}

const loginTalent = async (req,res) =>{
    const {email, password } = req.body

    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Please provide email and password.' })
    }

    
    const talent = await Talent.findOne({email}) 
    
    if(!talent) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid credentials' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, talent.password)

    if(!isPasswordCorrect) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid credentials' })
    }

    const token = talent.createJWT()
    res.status(StatusCodes.OK).json({talent, token})
}

module.exports = {
    registerEmployer,
    registerTalent,
    loginEmployer,
    loginTalent,
}