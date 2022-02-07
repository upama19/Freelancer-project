const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const talentSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        trim: true,
        lowercase: true
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
    },
    // hiredBy: {
    //     type: mongoose.Schema.Types.ObjectId

    // }
})

talentSchema.virtual('portfolio', {
    ref: 'Portfolio',
    localField: '_id',
    foreignField: 'createdBy'
})

talentSchema.methods.toJSON = function () {
    const talentObject = this.toObject()

    delete talentObject.password
    delete talentObject.confirmPassword

    return talentObject
}

talentSchema.pre('save', async function () {
    if (this.password !== this.confirmPassword) {
        throw new Error('Password does not match')
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    this.confirmPassword = this.password
})


talentSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    })
}


module.exports = mongoose.model('Talent', talentSchema);