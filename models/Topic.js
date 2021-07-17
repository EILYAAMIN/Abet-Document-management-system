const mongoose = require('mongoose');

const TopicSchema = mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        unique: true
    },
    advisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['SW', 'HW']
    },
    approved: {
        type: Boolean,
        default: false
    },
    semester: {
        type: String,
        default: () => (0 < new Date().getMonth() < 6) ? 'Spring' : 'Fall',
        required: true,
        enum: ['Fall', 'Spring']
    },
    year: {
        type: Number,
        default: () => new Date().getFullYear(),
        required: true
    }
}, { timestamps: true });

module.exports = Topic = mongoose.model('topic', TopicSchema);