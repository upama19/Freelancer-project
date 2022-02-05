const Portfolio = require('../models/portfolio')
const {StatusCodes} = require('http-status-codes')
const res = require('express/lib/response')


//Profile page displays the data from portfolio module through get request

const getProfile = async (req,res) =>{

    const { user: { userId}, params: { id: profileId}
} =req

    const profile = await Portfolio.findOne({
        _id: profileId,
        createdBy: userId,
    }) 

    if(!profile){
        throw new Error (`No talent with ID ${profileId} found`)

    }

    res.status(StatusCodes.OK).json({profile})

}

//talent has access to update their profile directlt from their profile
const updateProfile = async (req,res) =>{

    const {
        body:{fullName, description, listOfSkills, price},
        user: {userId},
        params:{ id: profileId},
        files:{profilePicture,picturesOfWork },
    } = req 
    let profile = await Portfolio.findOne({
        _id: profileId,
        createdBy: userId,
    })
    if(!profile){
        throw new Error (`No talent with ID ${profileId} found`)

    }

    if (fullName === ''){
        fullName = profile.fullName
    }
    if (description === ''){
        description = profile.description
    }

    if (listOfSkills === ''){
        listOfSkills = profile.listOfSkills
    }

    if(price === ''){
        price = profile.price
    }

    profile = await Portfolio.findByIdAndUpdate({_id: jobId, createdBy:userId}, req.body, req.files, {new:true, runValidators:true } )

    res.status(StatusCodes.OK).json({profile})

}

//talent can delete their profile if thet want to

const deleteProfile = async (req,res) =>{
    

    const { user: { userId}, params: { id: profileId},
} = req

const profile = await Portfolio.findByIdAndRemove({
    _id: profileId,
    createdBy: userId
})
if(!profile){
    throw new Error (`No talent with ID ${profileId} found`)

}


res.status(StatusCodes.OK).send()
}

//when employer clicks hire it navigates to different page by posting some response 

const hireTalent = async (req,res) =>{
    res.send('You are authorized...')
}




module.exports = {
    getProfile,
    updateProfile,
    deleteProfile,
    hireTalent,

}

