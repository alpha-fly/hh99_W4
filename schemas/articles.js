const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');  // 글번호 (articleId) 자동 증가
autoIncrement.initialize(mongoose.connection);

const articlesSchema = mongoose.Schema({
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
        // 이 부분에 default로 Date() 쓰면 왜 게시글 쓸 때마다 다른 날짜로 안 들어가고, 
        // 서버 켰다 꺼야만 다른 날짜로 입력되는지 궁금. Date.now 쓰면 되긴 하는데 표준시로 들어감
        // 어플리케이션 실행시의 날짜를 가져온다라...
        // 여기서 안하고, api.js에서 new Date() 쓰면 됨.
    },         
    content: {
        type: String,
        required: true,
        
    },
});

articlesSchema.plugin(autoIncrement.plugin, {
    model: 'Articles',
    field: 'articleId',
    startAt: 1, 
    increment: 1 
});

module.exports = mongoose.model("Articles", articlesSchema);


