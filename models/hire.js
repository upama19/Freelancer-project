const mongoose = require("mongoose")

const hireSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxlength: 30,
        trim: true
    },

    mobileNumber: {
        type: String,
        required: true,
        minLength: 10,
        maxlength: 10,
        trim: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    hireDuration: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        trim: true
    }
})