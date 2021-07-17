const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema({

    number: {
        type: String,
        required: true
    },
    leader: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        name: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        surname: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        idNum: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        course: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        email: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        }
    },
    advisor: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        name: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        surname: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        idNum: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        email: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        approved: {
            type: Boolean,
            default: false
        }
    },
    members: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        name: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        surname: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        idNum: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        email: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        course: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        approved: {
            type: Boolean,
            default: false
        }
    }],
    topic: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'topic',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['SW', 'HW']
        }
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

module.exports = Group = mongoose.model('group', GroupSchema);