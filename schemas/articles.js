const mongoose = require('mongoose');
const articlesSchema = mongoose.Schema({
    articleId: {
        type: Number,
        required: true,
        unique: true,
        default: 0,
    },
    title: {
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
    content: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model('Articles', articlesSchema);
