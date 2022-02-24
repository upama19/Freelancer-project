const res = require("express/lib/response")
const {StatusCodes} = require('http-status-codes')
const Employer = require('../models/employer')


const getAuthEmployer = async (req, res) => {
    try {
        const profile = await Employer.findOne({
            _id: req.user._id,
        })
    
        res.json({
            user: req.user,
            profile: profile
        })
    } catch (error) {
        res.status(200).json({ message: "Success" });
    }
    
}



const employerHome = async (req,res)=>{

        res.status(StatusCodes.OK).json({success:"You've have reached to home page"})




}



const employerServices = async (req,res)=>{

    res.status(StatusCodes.OK).json({success:"You've have reached to services page"})



    
}


const employerProfile = async (req,res)=>{

    res.status(StatusCodes.OK).json({success:"You've have reached to profile page"})



    
}


module.exports = {
    employerHome,
    employerServices,
    employerProfile,
    getAuthEmployer,
}