const mongoose = require('mongoose');

const MeetingSchema = mongoose.Schema({

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',
        required: true,
    },
    message: {
        type: String,
        default: "Please don't forget to attend the meeting",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = Meeting = mongoose.model('meeting', MeetingSchema);