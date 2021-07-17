const mongoose = require('mongoose');

const SubmissionSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        enum: ['PROGRESS1', 'PROGRESS2', 'PROGRESS3', 'PROGRESS4', 'PROGRESS5', 'PROGRESS6', 'PROGRESS7', 'PROGRESS8', 'PPM', 'FINAL']
    },
    deadline: {
        type: Date,
        required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topic',
        required: true
    },
    reports: [{
        groups: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'group',
            },
            number: {
                type: mongoose.Schema.Types.String,
                ref: 'group',
            },
        },

        path: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now(),
        }
    }]
}, { timestamps: true });

module.exports = Submission = mongoose.model('submission', SubmissionSchema);