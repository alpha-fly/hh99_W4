const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../schemas/users");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();


const postUsersSchema = Joi.object({
  id: Joi.string().min(4).max(16).required(),
  nickname: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,16}$')).required(),
  password: Joi.string().min(4).max(16).required(),
  confirmPassword: Joi.string().min(4).max(16).required() // Joi.ref('password')
});

// 회원가입
router.post("/new_user", async (req, res) => {
  
  try {
    const {
      nickname,
      id,
      password,
      confirmPassword,
    } = await postUsersSchema.validateAsync(req.body);

    if (password.includes(nickname) || password.includes(id)) {
      res.status(400).send({
          errorMessage: "패스워드에 아이디나 닉네임을 포함하지 말아 주세요.",
        });
        return;
    }
    
    if (password !== confirmPassword) {
      res.status(400).send({
         errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
       });
      return;
    }

    const dup_id = await User.find({
      $or: [{ id }],
    });
    if (dup_id.length) {
      res.status(400).send({
        errorMessage: "중복된 아이디입니다.",
      });
      return;
    }

    const dup_nickname = await User.find({
      $or: [{ nickname }],
    });
    if (dup_nickname.length) {
      res.status(400).send({
        errorMessage: "중복된 닉네임입니다.",
      });
      return;
    }

    const user = new User({ id, nickname, password });
    await user.save();

    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});


//로그인
const postAuthSchema = Joi.object({
  id: Joi.string().min(4).max(16).required(),
  password: Joi.string().required(),
});

router.post("/auth", async (req, res) => {
  
  try {
    const { id, password } = await postAuthSchema.validateAsync(req.body);

    const user = await User.findOne({ id, password }).exec();
    console.log(user)

    if (!user) {
      res.status(400).send({
        errorMessage: "아이디 또는 패스워드를 확인해주세요.",
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, "jaysecretkeyissocomplex");
    res.send({
      token,
    });
  } catch (err) {
      console.log(err);
    res.status(400).send({
      errorMessage: "아이디 또는 패스워드를 확인해주세요.",
    });
  }
});

// 유저정보조회 (토큰 조회. 로그인 여부 확인)
router.get("/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user,
  });
});

module.exports = router;