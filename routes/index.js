var express = require('express');
var router = express.Router();
const _ = require('lodash');
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
    {id:1, card_img: "img001.png", card_name:"sei☆"},
    {id:2, card_img: "img002.png", card_name:"栗井ムネ男"},
    {id:3, card_img: "img003.png", card_name:"ぱぬるー"},
    {id:4, card_img: "img004.png", card_name:"Omoooochi"},
    {id:5, card_img: "img005.png", card_name:"dolly"},
    {id:6, card_img: "img006.png", card_name:"sui81"},
    {id:7, card_img: "img007.png", card_name:"燻肉"},
    {id:8, card_img: "img008.png", card_name:"ゆいな"},
    {id:9, card_img: "img009.png", card_name:"鯉登丸"},
    {id:10, card_img: "img010.png", card_name:"月見ハルカ"},
    {id:11, card_img: "img011.png", card_name:"羅刹王D"},
    {id:12, card_img: "img012.png", card_name:"うじ団子"},
    {id:13, card_img: "img013.png", card_name:"シュウ"},
    {id:14, card_img: "img014.png", card_name:"柚玉藻"},
    {id:15, card_img: "img015.png", card_name:"紫音"},
    {id:16, card_img: "img016.png", card_name:"にちーん"},
    {id:17, card_img: "img017.png", card_name:"ふる～と"},
    {id:18, card_img: "img018.png", card_name:"whiterose"},
    {id:19, card_img: "img019.png", card_name:"ALEX"},
    {id:20, card_img: "img020.png", card_name:"えくれの"},
    {id:21, card_img: "img021.png", card_name:"おぱい"},
    {id:22, card_img: "img022.png", card_name:"sei&燻肉"},
    {id:23, card_img: "img023.png", card_name:"俺より強い(以下略"},
    {id:24, card_img: "img024.png", card_name:"ねるふぁ"},
    {id:25, card_img: "img025.png", card_name:"KAL"},
    {id:26, card_img: "img026.png", card_name:"ラッキーちゃんす☆"},
    {id:27, card_img: "img027.png", card_name:"朱桜&朱沙"},
    {id:28, card_img: "img028.png", card_name:"ホークアイ"},
    {id:29, card_img: "img039.png", card_name:"SaintTail"},
    {id:30, card_img: "img030.png", card_name:"ぶる～じゅ"},
    {id:31, card_img: "img031.png", card_name:"銀ちゃん"}
	]
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('gacha');
  // if(typeof req.session.user !== 'undefined') {
  //   res.render('gacha');
  // }else{
  //   res.render('index');
  // }
});

// ユーザー登録
router.post('/regist', async function(req, res) {

  let connection;
  const user_data = {
    user_name: req.body.user_name,
    password: req.body.password
  }

  if(user_data.user_name.length > 20){
    res.json({
      status: "error",
      message: "ユーザー名は20文字までです。"
    });
  } 
  if(user_data.password.length > 8){
    res.json({
      status: "error",
      message: "パスワードは8文字までです。"
    });
  } 
  
  try{
    connection = await mysql.createConnection(mysqlConnObj);
    const [row] = await connection.query('insert into users set ?', user_data);

    req.session.user = {
      user_id: row.insertId,
      user_name: user_data.user_name
    }

    res.json({status: "success"});

  }catch (err){
    res.json({
      status: "error",
      message: "エラーが発生しました。もう一度やり直してください。"
    });
  }finally{
    connection.end();
    return;
  }

});

// ユーザーログイン
router.post('/login',　async function(req, res, next) {

  let connection;
  const user_data = {
    user_name: req.body.user_name,
    password: req.body.password
  }

  if(user_data.user_name.length > 20){
    res.json({
      status: "error",
      message: "ユーザー名は20文字までです。"
    });
  } 
  if(user_data.password.length > 8){
    res.json({
      status: "error",
      message: "パスワードは8文字までです。"
    });
  }
  
  try{
    connection = await mysql.createConnection(mysqlConnObj);
    const [result] = await connection.query(`SELECT * from users where user_name = '${user_data.user_name}' and password = '${user_data.password}'`);

    if(typeof result[0] === 'undefined'){
      res.json({
        status: "error",
        message: "ユーザーは存在しません。新規登録してください。"
      });
    }


    req.session.user = {
      user_id: result[0].id,
      user_name: result[0].user_name
    }

    res.json({status: "success"});

  }catch (err){
    res.json({
      status: "error",
      message: "エラーが発生しました。もう一度やり直してください。"
    });
  }finally{
    connection.end();
    return;
  }

});

// ユーザーログアウト
router.get('/logout',　async function(req, res, next) {
  req.session.user = undefined;
  res.redirect('/');
});


// ガチャを実施
router.post('/loadcard', async function(req, res, next) {
  // if(typeof req.session.user === 'undefined') res.render('index', { error : 'ログインしてください。'});
  req.session.user = {
    user_id: 1
  }

  let loadcard;
  let group;
  // 抽選処理を行う。
  let randnum = _.random(1, 1000);
  // 0.5%
  const group1 = [658, 311, 551, 668, 273];
  // 1%
  const group2 = [720, 739, 44, 861, 318, 22, 406, 631, 886, 105];

  if(group1.includes(randnum)){
    group = 1;
    loadcard = cord_resouce.group1[0];
  }else if(group2.includes(randnum)){
    group = 2;
    loadcard = cord_resouce.group2[0];
  }else{
    randnum = _.random(0, 30);
    group = 3;
    loadcard = cord_resouce.group3[randnum];
  }

  const insertData = {
    user_id: req.session.user.user_id,
    group_id: group,
    card_id: loadcard.id
  }

  let connection;
  try{
    connection = await mysql.createConnection(mysqlConnObj);
    await connection.query('insert into users_cards_relation set ?', insertData);

    res.json({
      status: "success",
      resData: loadcard
    });

  }catch (err){
    res.json({
      status: "error",
      message: "エラーが発生しました。もう一度やり直してください。"
    });
  }finally{
    connection.end();
    return;
  }
});

// カードの一覧を開く
router.get('/showcardlist', async function(req, res, next) {
  if(typeof req.session.user === 'undefined') res.render('index', { error : 'ログインしてください。'});

  try{
    connection = await mysql.createConnection(mysqlConnObj);
    const [result] = await connection.query(`SELECT * from users_cards_relation where user_id = ${req.session.user.user_id}`);

    console.log(result);
    const cardList = [];
    result.forEach(e => {
      const cardGroup = cord_resouce[`group${e.group_id}`];
      const cardData = cardGroup.filter(card => card.id === e.card_id)
      cardList.push(cardData[0])
    });

    res.json({
      status: "success",
      cardList: cardList
    });

  }catch (err){
    res.json({
      status: "error",
      message: "エラーが発生しました。もう一度やり直してください。"
    });
  }finally{
    connection.end();
    return;
  }
});


module.exports = router;