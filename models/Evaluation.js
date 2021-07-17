const mongoose = require('mongoose');

const EvaluationSchema = mongoose.Schema({

    evaluator: {
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
        email: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        idNum: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        }
    },
    session: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'session',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
    },
    student: {
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
        email: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        },
        idNum: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
        }
    },
    coursetag: {
        type: String,
        required: true
    },
    report: {
        type: Array,
        contentType: Number,
        required: true
    },
    cooperation: {
        type: Array,
        contentType: Number,
        required: true
    },
    quality: {
        type: Array,
        contentType: Number,
        required: true
    },
    present: {
        type: Array,
        contentType: Number,
        required: true
    },
    summary: {
        type: Array,
        contentType: Number,
        required: true
    },
    filePath: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = Evaluation = mongoose.model('evaluation', EvaluationSchema);