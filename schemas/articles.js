const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment');  // 글번호 (articleId) 자동 증가
// autoIncrement.initialize(mongoose.connection);

const articlesSchema = mongoose.Schema(
{
    articleId: {
        type: Number,
        required: true,
        unique: true,
        default : 0
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
        default: new Date()
        
    },         
    content: {
        type: String,
        required: true,
    },    
});

// articlesSchema.plugin(autoIncrement.plugin, {
//     model: 'Articles',
//     field: 'articleId',
//     startAt: 1, 
//     increment: 1 
// });

module.exports = mongoose.model("Articles", articlesSchema);


