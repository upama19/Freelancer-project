const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { func } = require('joi')

const employerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 5,
        maxlength: 25,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        trim: true,
        minLength: 6,
        maxlength: 30,
    },
    confirmPassword: {
        type: String,
        required: [true, `Password doesn't match`],
        trim: true,
        minLength: 6,
        maxlength: 30,
    },
    mobileNumber: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value.toString().length !== 10) {
                throw new Error('Mobile Number has to be 10 digits')
            }
        }
    },
    role: {
        type: String,
        required: true
    }
})

employerSchema.virtual('talents', {
    ref: 'Talent',
    localField: '_id',
    foreignField: 'hiredBy.employer'
})

employerSchema.methods.toJSON = function() {
    const employerObject = this.toObject()

    delete employerObject.password
    delete employerObject.confirmPassword

    return employerObject
}

employerSchema.pre('save', async function() {
    if (this.password !== this.confirmPassword) {
        throw new Error('Password does not match')
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    this.confirmPassword = this.password
})


employerSchema.methods.createJWT = function() {
    return jwt.sign({ userId: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    })
}



module.exports = mongoose.model('Employer', employerSchema);