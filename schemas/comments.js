const mongoose = require('mongoose');
const commentsSchema = mongoose.Schema({
    commentId: {
        type: Number,
        required: true,
        unique: true,
        default: 0,
    },
    location: {
        type: Number,
        required: true,
    },
    mention: {
        type: String,
        required: true,
        unique: false,
    },
    user: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date(),
    },
});
module.exports = mongoose.model('Comments', commentsSchema);
