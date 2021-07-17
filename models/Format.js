const mongoose = require('mongoose');

const FormatSchema = mongoose.Schema({

    fields: {
        infoLable: [{
            type: String
        }],
        report: [{
            label: {
                type: String,
                required: true
            },
            weight: {
                type: Number,
                required: true
            },
            rubric: {
                type: String,
                required: true
            }
        }],
        cooperation: [{
            label: {
                type: String,
                required: true
            },
            weight: {
                type: Number,
                required: true
            },
            rubric: {
                type: String,
                required: true
            }
        }],
        quality: [{
            label: {
                type: String,
                required: true
            },
            weight: {
                type: Number,
                required: true
            },
            rubric: {
                type: String,
                required: true
            }
        }],
        present: [{
            label: {
                type: String,
                required: true
            },
            weight: {
                type: Number,
                required: true
            },
            rubric: {
                type: String,
                required: true
            }
        }],
        summary: [{
            label: {
                type: String,
                required: true
            },
            weight: {
                type: Number,
                required: true
            },
            rubric: {
                type: String,
                required: true
            }
        }]
    }
}, { timestamps: true });

module.exports = Format = mongoose.model('format', FormatSchema);