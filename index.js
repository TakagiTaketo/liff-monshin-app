import fetch from 'node-fetch';
import express from 'express';
const PORT = process.env.PORT || 5001
import ClientPg from 'pg';
const { Client } = ClientPg;
/*
const express = require('express');
//const { Client } = require('pg');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 5000
*/

// Postgresへの接続
const connection = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
connection.connect((err) => {
  if (err) {
    console.log('error connecting:' + err.stack);
    return;
  }
  console.log('connecting success');
});

const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

//express
express()
  .use(express.static('public'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .post('/api', (req, res) => getUserInfo(req, res))
  .post('/selectUser', (req, res) => selectUserInfo(req, res))
  .post('/insertUser', (req, res) => insertUserInfo(req, res))
  .post('/updateUser', (req, res) => updateUserInfo(req, res))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

const getUserInfo = (req, res) => {
  const data = req.body;
  const postData = `id_token=${data.id_token}&client_id=${process.env.LOGIN_CHANNEL_ID}`;
  console.log('client_id:' + process.env.LOGIN_CHANNEL_ID);
  fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: postData
  })
    .then(response => {
      response.json()
        .then(json => {
          console.log('response data:', json);
          if (json) {
            //Postgresからデータを取得する処理
            const lineId = json.sub; //sub:line_uid
            const select_query = {
              text: `SELECT * FROM users WHERE line_uid='${lineId}';`
            };

            connection.query(select_query)
              .then(data => {
                console.log('data.rows[0]:', data.rows[0]);
                const line_uname = data.rows[0].line_uname;
                const line_uid = data.rows[0].line_uid;
                res.status(200).send({ line_uname, line_uid });
              })
              .catch(e => console.log(e));
            console.log('response data:', json);
          }
        });
    })
    .catch(e => console.log(e));
}

// 初診かどうか判定する
const selectUserInfo = (req, res) => {
  const data = req.body;
  let firstConsulFlg = false;
  const select_query = {
    text: `SELECT * FROM users WHERE name='${data.name} AND birthday='${data.birthday}';`
  }
  connection.query(select_query, function (error, results) {
    req.connection.end;
    if (error) throw error;
    if (results.rows[0] != null) {
      firstConsulFlg = false;
      console.log('通院者');
    } else if (results.rows[0] == null) {
      firstConsulFlg = true;
      console.log('初診');
    }
    res.status(200).send({ firstConsulFlg });
  });

}

// ユーザー情報を追加する。
const insertUserInfo = (req, res) => {
  const data = req.body;
  // タイムスタンプ整形
  let created_at = '';
  let date = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
  console.log('date:' + date);
  created_at = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
    + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':'
    + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);

  const insert_query = {
    text: `INSERT INTO users(line_uid, line_uname, name, birthday, height, weight, waist, blood_pressure, created_at, delete_flg) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
    values: [data.line_uid, data.line_uname, data.name, data.birthday, data.height, data.weight, data.waist, data.blood_pressure, created_at, 0]
  };

  connection.query(insert_query)
    .then(() => {
      let message = 'userを追加しました';
      res.status(200).send({ message });
    })
    .catch(e => {
      console.log(e);
    })
    .finally(() => {
      req.connection.end;
    })
}

// ユーザー情報を更新する
const updateUserInfo = (req, res) => {
  const data = req.body;
  // タイムスタンプ整形
  let updated_at = '';
  let date = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
  console.log('date:' + date);
  updated_at = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
    + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':'
    + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);

  const update_query = {
    text: `UPDATE users SET height='${data.height}', weight='${data.weight}', waist='${data.waist}', blood_pressure='${data.blood_pressure}', updated_at='${updated_at}' WHERE name='${data.name}' AND birthday='${data.birthday} AND delete_flg=0';`
  };

  connection.query(update_query)
    .then(() => {
      let message = 'userを更新しました';
      res.status(200).send({ message });
    })
    .catch(e => {
      console.log(e);
    })
    .finally(() => {
      req.connection.end;
    })
}

/*
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/g/', (req, res) => res.json({ method: "こんにちは、getさん" }))
  .post('/p/', (req, res) => res.json({ method: "こんにちは、postさん" }))
  .post("/hook/", (req, res) => res.json({ test: "hook" }))
  //.post('/hook',line.middleware(config),(req,res)=> lineBot(req,res))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

//usersテーブル作成クエリ
const create_query = {
  text: 'CREATE TABLE IF NOT EXISTS users (id SERIAL NOT NULL, line_uid VARCHAR(50), name VARCHAR(20), age SMALLINT);'
};

//CREATEクエリ実行
connection.query(create_query)
  .then(() => console.log('usersテーブル作成成功！！'))
  .catch(e => console.log(e))

const client = new line.Client(config);
app
  .post('/hook', line.middleware(config), (req, res) => lineBot(req, res))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const lineBot = (req, res) => {
  res.status(200).end();
  const events = req.body.events;
  const promises = [];
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    switch (ev.type) {
      case 'follow':
        promises.push(greeting_follow(ev));
        break;
    }
  }
  Promise
    .all(promises)
    .then(console.log('all promises passed'))
    .catch(e => console.error(e.stack));
}

//フォローしたら挨拶を返す関数
const greeting_follow = async (ev) => {
  const profile = await client.getProfile(ev.source.userId);
  const insert_query = {
    text: `INSERT INTO users (line_uid,name,age) VALUES($1,$2,$3);`,
    values: [ev.source.userId, profile.displayName, 33]
  };
  connection.query(insert_query)
    .then(() => {
      return client.replyMessage(ev.replyToken, {
        "type": "text",
        "text": `${profile.displayName}さん、フォローありがとうございます\uDBC0\uDC04`
      });
    })
    .catch(e => console.log(e));
}
*/