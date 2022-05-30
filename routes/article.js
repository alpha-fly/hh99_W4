const express = require("express")
const Articles = require("../schemas/articles")
const Comments = require("../schemas/comments")
const Counters = require("../schemas/counters")
const User = require("../schemas/users");
const authMiddleware = require("../middlewares/auth-middleware");
const { db } = require("../schemas/articles");
const router = express.Router();

// 전체 게시글 목록 조회 API * 
router.get("/", async (req,res) => {             
  
  function compare (key) {
    return (a, b) => (Date.parse(a[key]) < Date.parse(b[key]) ? 1 : (Date.parse(a[key]) > Date.parse(b[key]) ? -1 : 0));
  }

  const articles_unsorted = await Articles.find();
  const articles = articles_unsorted.sort(compare("date"));
  
  res.json({
      articles
  });
});


// 게시글 작성 API (*로그인!)
router.post("/new_article", authMiddleware, async (req, res) => {    
  const { date, title, content } = req.body;  
  let user = res.locals.user.nickname; 

  if (title==="" || content=== "") {
    return res.status(400).json({ success : false, errormessage : "제목과 내용을 입력해주세요."});
  }

  let counter = await Counters.findOne({name:'Articles'}).exec();
  if(!counter) {
    counter = await Counters.create({name:'Articles', count:0});
  }
  counter.count++;
  counter.save();
  let articleId = counter.count;  
    
  const writtenArticle = await Articles.create(
    {
    articleId, 
    title,
    user,
    date, 
    content,
    }
  );     

  res.json({ message: "게시글을 작성했습니다." });
});


/// 게시글 조회 API 
router.get("/:articleId", async (req,res) => {                   
    const { articleId }= req.params;

    const [article] = await Articles.find({ articleId: Number(articleId) });
    res.json({
        article,
    });
}); 


//게시글 수정 화면 이동 API
router.get("/revise_check/:articleId", authMiddleware, async (req, res) => {
  const { articleId } = req.params;

  let user = res.locals.user.nickname; 
  const article = await Articles.find({articleId: Number(articleId)});  
  console.log (articleId, user, article[0]["user"])
  
  if (user !== article[0]["user"]) { 
    return res.status(401).json({ success : false, errormessage : "작성자만 수정할 수 있습니다."});
  }

  res.json({success: true});
});


// 게시글 수정 API OK (로그인!)
router.put("/:articleId", authMiddleware, async (req, res) => {
  const { articleId } = req.params;
  const { title, content} = req.body;  

    if (title==="" || content=== "") {
      return res.status(400).json({ success : false, errormessage : "제목과 내용을 입력해주세요."});
    }
    
    let user = res.locals.user.nickname; 
    const article = await Articles.find({articleId: Number(articleId)});  
      
    if (user === article[0]["user"]) {
      await Articles.updateOne({ articleId: Number(articleId)}, 
        { $set: { title, content }});
    } else {
      return res.status(401).json({ success : false, errormessage : "작성자만 수정할 수 있습니다."});
    }  
    res.json({success: true, message: "게시글을 수정하였습니다."});

});


// 게시글 삭제 API (로그인!)
router.delete("/:articleId", authMiddleware, async (req, res) => {
  const { articleId } = req.params;  

  let user = res.locals.user.nickname; 
  const article = await Articles.find({articleId: Number(articleId)});  
  
  if (user === article[0]["user"]) {
    await Articles.deleteOne({articleId: Number(articleId)});           
  } else {
    return res.status(401).json({ success : false, errormessage : "작성자만 삭제할 수 있습니다."});
  }
  
  res.json({success: true, message: "게시글을 삭제하였습니다."});
});

// 댓글 작성 API (*로그인!)
router.post("/comment/:articleId", authMiddleware, async (req, res) => {    
  const { articleId } = req.params;
  let location = articleId  
  const { date, mention } = req.body;  
  let user = res.locals.user.nickname; 
  
  if (mention==="") {
    return res.status(400).json({ success : false, errormessage : "댓글의 내용을 입력해주세요."});
  }
  
  let counter = await Counters.findOne({name:'Comments'}).exec();
  if(!counter) {
    counter = await Counters.create({name:'Comments', count:0});
  }
  counter.count++;
  counter.save();
  let commentId = counter.count;  

  const writtenComment = await Comments.create(
    {
    commentId, 
    location,
    mention,
    user, 
    date,
    }
  );     

 

  res.json({ message: "댓글을 작성했습니다." });
});

module.exports = router;

// 댓글 조회 API (no login!!) 
router.get("/comment/:articleId", async (req,res) => {                   
  const { articleId }= req.params;
  const all_comments = await Comments.find();  
  //여기부터
  const filtered_comments = await asyncFilter(all_comments , async item => {
    await doAsyncStuff()
    return item["location"] == Number(articleId)
  })

  function doAsyncStuff() {
    return Promise.resolve()
  }
  
  async function asyncFilter(arr, callback) {
    const fail = Symbol()
    return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i=>i!==fail)
  }
  //여기까지 잘 뜯어보기

  function compare (key) {
    return (a, b) => (Date.parse(a[key]) < Date.parse(b[key]) ? 1 : (Date.parse(a[key]) > Date.parse(b[key]) ? -1 : 0));
  }
  const comments = filtered_comments.sort(compare("date"));

  res.json({
    comments
  });
}); 


//댓글 삭제
router.delete("/comment/:commentId", authMiddleware, async (req, res) => {
  const { commentId } = req.params;  

  let user = res.locals.user.nickname; 
  const comment = await Comments.find({commentId: Number(commentId)});  
    
  if (user === comment[0]["user"]) {
    await Comments.deleteOne({commentId: Number(commentId)});           
  } else {
    return res.status(401).json({ success : false, errormessage : "작성자만 삭제할 수 있습니다."});
  }
  
  res.json({success: true, message: "댓글을 삭제하였습니다."});
});


//댓글 수정
router.put("/comment/:commentId", authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { mention } = req.body;

  if (mention==="") {
    return res.status(400).json({ success : false, errormessage : "댓글의 내용을 입력해주세요."});
  }
  
  let user = res.locals.user.nickname; 
  const comment = await Comments.find({commentId: Number(commentId)});  
    
  if (user === comment[0]["user"]) {
    await Comments.updateOne({ commentId: Number(commentId)}, 
      { $set: { mention }});
  } else {
    return res.status(401).json({ success : false, errormessage : "작성자만 수정할 수 있습니다."});
  }

  
  
  res.json({success: true, message: "댓글을 수정하였습니다."});
});