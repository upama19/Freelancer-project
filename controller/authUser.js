const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs')

const Employer = require('../models/employer');
const Talent = require('../models/talent');

const registerEmployer = async (req,res)=>{
    const employer = await Employer.create({ ...req.body })
    const token =  await employer.createJWT()

    res.status(StatusCodes.CREATED).json({employer, token})
}

const registerTalent = async (req,res) =>{
    const talent = await Talent.create({ ...req.body })
    const token =  await talent.createJWT()

    res.status(StatusCodes.CREATED).json({talent, token})
}

const login = async (req,res) =>{
    const {email, password } = req.body

    if(!email || !password){
        throw new Error ('Please provide email and password.')
    }

    // User consists of employer and talent, both
    const user = await Employer.findOne({email}) || await Talent.findOne({email})
    
    if(!user) {
        throw new Error('Invalid credentials')
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!isPasswordCorrect) {
        throw new Error('Invalid credentials')
    }

    const token = user.createJWT()

    res.status(StatusCodes.OK).json({user, token})
}


module.exports = {
    registerEmployer,
    registerTalent,
    login

}