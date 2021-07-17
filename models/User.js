const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    idNum: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: null,
        enum: ['admin', 'coordinator', 'instructor', 'external', 'student', 'assistant', 'chair', null]
    },
    course: {
        type: String,
        enum: ['CMPE406', 'BLGM406', 'CMSE406', 'CMSE405', 'CMPE405', 'BLGM405', null],
        default: null,
        required: true
    },
    verificationcode: {
        type: String,
        expireAfterSeconds: 1000000
    },
    isverified: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String,
        expireAfterSeconds: 1000000
    }
}, { timestamps: true });

module.exports = User = mongoose.model('user', UserSchema);