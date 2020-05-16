var express = require('express');
var router = express.Router();
const mysql = require('mysql2/promise');
const mysqlConnObj = {
  host: 'localhost',
  user: 'root',
  password: 'gatagmgw2',
  port: 3306,
  database: 'smooch_gacha'
}

const cord_resouce = {
	group1: [
  	{id: 32, card_img: "img032.png", card_name:"Nina(しょうがないにゃぁ)"}
  ],
	group2: [
  	{id: 33, card_img: "img033.png", card_name:"Nina"}
  ],
  group3: [
    {id:1, card_img: "img001", card_name:"sei☆"},
    {id:2, card_img: "img002", card_name:"栗井ムネ男"},
    {id:3, card_img: "img003", card_name:"ぱぬるー"},
    {id:4, card_img: "img004", card_name:"Omoooochi"},
    {id:5, card_img: "img005", card_name:"dolly"},
    {id:6, card_img: "img006", card_name:"sui81"},
    {id:7, card_img: "img007", card_name:"燻肉"},
    {id:8, card_img: "img008", card_name:"ゆいな"},
    {id:9, card_img: "img009", card_name:"鯉登丸"},
    {id:10, card_img: "img010", card_name:"月見ハルカ"},
    {id:11, card_img: "img011", card_name:"羅刹王D"},
    {id:12, card_img: "img012", card_name:"うじ団子"},
    {id:13, card_img: "img013", card_name:"シュウ"},
    {id:14, card_img: "img014", card_name:"柚玉藻"},
    {id:15, card_img: "img015", card_name:"紫音"},
    {id:16, card_img: "img016", card_name:"にちーん"},
    {id:17, card_img: "img017", card_name:"ふる～と"},
    {id:18, card_img: "img018", card_name:"whiterose"},
    {id:19, card_img: "img019", card_name:"ALEX"},
    {id:20, card_img: "img020", card_name:"えくれの"},
    {id:21, card_img: "img021", card_name:"おぱい"},
    {id:22, card_img: "img022", card_name:"sei&燻肉"},
    {id:23, card_img: "img023", card_name:"俺より強い(以下略"},
    {id:24, card_img: "img024", card_name:"ねるふぁ"},
    {id:25, card_img: "img025", card_name:"KAL"},
    {id:26, card_img: "img026", card_name:"ラッキーちゃんす☆"},
    {id:27, card_img: "img027", card_name:"朱桜&朱沙"},
    {id:28, card_img: "img028", card_name:"ホークアイ"},
    {id:29, card_img: "img039", card_name:"SaintTail"},
    {id:30, card_img: "img030", card_name:"ぶる～じゅ"},
    {id:31, card_img: "img031", card_name:"銀ちゃん"}
	]
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user && req.session.user.user_name) {
    res.render('gacha', { title: 'Express' });
  }else{
    res.render('index', { title: 'Express', error : ''});
  }
});

// ユーザー登録
router.post('/regist', async function(req, res) {

  console.log(req.body);
  let connection;

  const user_data = {
    user_name: req.body.user_name,
    password: req.body.password
  }

  if(user_data.user_name > 20) res.render('index', { title: 'Express', error : 'ユーザー名は20文字までです。'});
  if(user_data.password > 8) res.render('index', { title: 'Express', error : 'パスワードは8文字までです。'});
  
  try{
    connection = await mysql.createConnection(mysqlConnObj);
    await connection.beginTransaction();
    const [row1] = await connection.query('insert into users set ?', user_data);
    console.log("結果", row1);
    await connection.commit();

    req.session.user = {
      user_name: user_data.user_name
    }

    res.render('gacha', { title: 'Express' });
  }catch (err){
    console.log(err);
    await connection.rollback();
    res.render('index', { title: 'Express', error : 'エラーが発生しました。ログインし直してください。'});
  }finally{
    connection.end();
    return;
  }

});

// ユーザーログイン
router.post('/login',　async function(req, res, next) {

  console.log(req.body);
  let connection;

  const user_data = {
    user_name: req.body.user_name,
    password: req.body.password
  }

  if(user_data.user_name > 20) res.render('index', { title: 'Express', error : 'ユーザー名は20文字までです。'});
  if(user_data.password > 8) res.render('index', { title: 'Express', error : 'パスワードは8文字までです。'});
  
  try{
    connection = await mysql.createConnection(mysqlConnObj);
    const [result] = await connection.query(`SELECT * from users where user_name = '${user_data.user_name}' and password = '${user_data.password}'`);
    console.log("結果", result[0]);

    req.session.user = {
      user_name: user_data.user_name
    }

    res.render('gacha', { title: 'Express' });
  }catch (err){
    console.log(err);
    res.render('index', { title: 'Express', error : 'エラーが発生しました。ログインし直してください。'});
  }finally{
    connection.end();
    return;
  }

});

// ユーザーログアウト
router.post('/logout',　async function(req, res, next) {
  req.session.user = {}
  res.render('index', { title: 'Express', error : ''});
});


// ガチャを実施
router.post('/loadcard', function(req, res, next) {
  if(!req.session.user.user_name) res.render('index', { title: 'Express', error : 'ログインしてください。'});

  res.json({});
});

// カードの一覧を開く
router.post('/showcardlist', function(req, res, next) {
  if(!req.session.user.user_name) res.render('index', { title: 'Express', error : 'ログインしてください。'});

  res.json({});
});



module.exports = router;
