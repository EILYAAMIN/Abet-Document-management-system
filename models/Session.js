const mongoose = require('mongoose');

const SessionSchema = mongoose.Schema({

    coordinator: {
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
    chair: {
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
    external: {
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
    members: [{
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
    }],
    groups: [{
        number: {
            type: mongoose.Schema.Types.String,
            ref: 'group',
        },
        leader: {
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
            email: {
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
            email: {
                type: mongoose.Schema.Types.String,
                ref: 'user',
            },
            idNum: {
                type: mongoose.Schema.Types.String,
                ref: 'user',
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
            email: {
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
            }
        }],
        topic: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'topic',
            },
            name: {
                type: String,
                ref: 'topic'
            },
            type: {
                type: String,
                enum: ['SW', 'HW']
            }
        },
        semester: {
            type: mongoose.Schema.Types.String,
            ref: 'user',
            enum: ['Fall', 'Spring']
        },
        year: {
            type: mongoose.Schema.Types.String,
            ref: 'user'
        }
    }],
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
    filePath: {
        type: String
    }
}, { timestamps: true });

module.exports = Session = mongoose.model('session', SessionSchema);