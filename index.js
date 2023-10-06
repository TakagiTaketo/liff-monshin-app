import fetch from 'node-fetch';
import express from 'express';
const PORT = process.env.PORT || 5001
//import ClientPg from 'pg';
//const { Client } = ClientPg;
import pkg from 'pg';
const { Pool } = pkg;

// Postgresへの接続
/*
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
*/
// Postgresへの接続プールの作成
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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
  .post('/selectUser', (req, res) => selectUserInfo(req, res))
  .post('/insertUser', (req, res) => insertUserInfo(req, res))
  .post('/updateUser', (req, res) => updateUserInfo(req, res))
  .post('/selectMonshin', (req, res) => selectMonshin(req, res))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

// 初診かどうか判定する
const selectUserInfo = async(req, res) => {
  const data = req.body;
  const idToken = data.idToken;
  let firstConsulFlg = false;
  let birthday = '';
  let name = '';

  try{
    const userinfo = await verifyIdTokenAndGetUserInfo(idToken);
    const select_query = {
      text: `SELECT * FROM users WHERE line_uid=$1 AND delete_flg=0;`,
      values: [userinfo.line_uid]
    }

    await pool.query(select_query)
      .then(data => {
        if (data.rows.length > 0) {
          console.log('通院者');
          firstConsulFlg = false;
          name = data.rows[0].name;
          birthday = data.rows[0].birthday;
        } else {
          console.log('初診');
          firstConsulFlg = true;
        }
        console.log('selectUserInfoのname:' + name);
        console.log('selectUserInfoのbirthday:' + birthday);
        console.log('selectUserInfoのfirstConsulFlg:' + firstConsulFlg);
        res.status(200).send({ 
          firstConsulFlg: firstConsulFlg,
          name: name,
          birthday: birthday
        });
      })
      .catch(e => console.error(e.message));
      
    }catch(e){
      console.error(e.message);
    }
}

// ユーザー情報を追加する。
const insertUserInfo = async(req, res) => {
  console.log('ユーザー情報を追加する。');
  const data = req.body;
  const idToken = data.idToken;
  // タイムスタンプ整形
  let created_at = '';
  let date = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
  console.log('date:' + date);
  created_at = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
    + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':'
    + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
  console.log('created_at:' + created_at);
  console.log('data.name:' + data.name);
  console.log('data.birthday:' + data.birthday);
  console.log('data.height:' + data.height);
  console.log('data.weight:' + data.weight);
  console.log('data.waist:' + data.waist);
  console.log('data.blood_pressure_max:' + data.blood_pressure_max);
  console.log('data.blood_pressure_min:' + data.blood_pressure_min);
  
  try{
    const userinfo = await verifyIdTokenAndGetUserInfo(idToken);
    console.log('userinfo.line_uid:' + userinfo.line_uid);
    console.log('userinfo.line_uname:' + userinfo.line_uname);
  
    const insert_query = {
      text: `INSERT INTO users(line_uid, line_uname, name, birthday, height, weight, waist, blood_pressure_max, blood_pressure_min, created_at, delete_flg) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
      values: [userinfo.line_uid, userinfo.line_uname, data.name, data.birthday, data.height, data.weight, data.waist, data.blood_pressure_max, data.blood_pressure_min, created_at, 0]
    };

    pool.query(insert_query)
      .then(() => {
        console.log('userを追加しました。');
        let message = 'userを追加しました';
        res.status(200).send({ meg: message });
      })
      .catch(e => {
        console.error(e.message);
        res.status(500).send({ error: 'ユーザー情報の登録に失敗しました。\nお手数をおかけして申し訳ございませんが、一度画面を閉じてから再度入力をお願いいたします。'});
      })
  }catch(e){
    console.error(e.message);
    res.status(500).send({ error: 'ユーザー情報の登録に失敗しました。\nお手数をおかけして申し訳ございませんが、一度画面を閉じてから再度入力をお願いいたします。'});
  }
}

// ユーザー情報を更新する
const updateUserInfo = async(req, res) => {
  console.log('ユーザー情報を更新する。');
  const data = req.body;
  const idToken = data.idToken;
  // タイムスタンプ整形
  let updated_at = '';
  let date = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
  console.log('date:' + date);
  updated_at = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
    + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':'
    + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
  console.log('updated_at:' + updated_at);
  console.log('data.line_uid:' + data.line_uid);
  console.log('data.height:' + data.height);
  console.log('data.weight:' + data.weight);
  console.log('data.waist:' + data.waist);
  console.log('data.blood_pressure_max:' + data.blood_pressure_max);
  console.log('data.blood_pressure_min:' + data.blood_pressure_min);

  try{
    const userinfo = await verifyIdTokenAndGetUserInfo(idToken);
    const update_query = {
      text: `UPDATE users SET height=$1, weight=$2, waist=$3, blood_pressure_max=$4, blood_pressure_min=$5, updated_at=$6 WHERE line_uid=$7 AND delete_flg=0;`,
      values: [data.height, data.weight, data.waist, data.blood_pressure_max, data.blood_pressure_min, updated_at, userinfo.line_uid]
    };
    await pool.query(update_query)
      .then(() => {
        console.log('userを更新しました。');
        let message = 'userを更新しました';
        res.status(200).send({ msg:message });
      })
      .catch(e => {
        console.error(e.message);
        res.status(500).send({ error: 'ユーザー情報の更新に失敗しました。\nお手数をおかけして申し訳ございませんが、一度画面を閉じてから再度入力をお願いいたします。'});
      })
  }catch(e){
    console.error(e.message);
    res.status(500).send({ error: 'ユーザー情報の更新に失敗しました。\nお手数をおかけして申し訳ございませんが、一度画面を閉じてから再度入力をお願いいたします。'});
  }
}

// 最後の問診情報を取得する
const selectMonshin = async (req, res) => {
  console.log("問診有無チェック");
  const data = req.body;
  const idToken = data.idToken;
  let monshin_umu = false; // false:レコードなし true:レコードあり
  let latest_weight = "";
  let latest_waist = "";
  let latest_bloodPressure_max = "";
  let latest_bloodPressure_min = "";

  try {
    const userinfo = await verifyIdTokenAndGetUserInfo(idToken);
    const select_query = {
      text: `SELECT weight, waist, blood_pressure_max, blood_pressure_min FROM users WHERE line_uid=$1 AND delete_flg=0`,
      values: [userinfo.line_uid]
    };
    await pool.query(select_query)
      .then((data) => {
        if (data.rows.length > 0) {
          monshin_umu = true;
          latest_weight = data.rows[0].weight;
          latest_waist = data.rows[0].waist;
          latest_bloodPressure_max = data.rows[0].blood_pressure_max;
          latest_bloodPressure_min = data.rows[0].blood_pressure_min;
        }
        console.log("monshin_umu:" + monshin_umu);
        console.log("latest_weight:" + latest_weight);
        console.log("latest_waist:" + latest_waist);
        console.log("latest_bloodPressure_max" + latest_bloodPressure_max);
        console.log("latest_bloodPressure_min" + latest_bloodPressure_min);
        res.status(200).send({
            monshin_umu: monshin_umu,
            latest_weight: latest_weight,
            latest_waist: latest_waist,
            latest_bloodPressure_max: latest_bloodPressure_max,
            latest_bloodPressure_min: latest_bloodPressure_min
        });
      })
      .catch((e) => {
        console.error(e.message);
        res.status(500).send({ error: '問診情報の取得に失敗しました。\n一度アプリを閉じて再度開いてください。' });
      });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ error: '問診情報の取得に失敗しました。\n一度アプリを閉じて再度開いてください。' });
  }
};

// IDTokenから個人情報を取得する
const verifyIdTokenAndGetUserInfo = async (idToken) => {
  try {
    const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id_token=${idToken}&client_id=${process.env.LOGIN_CHANNEL_ID}`,
    });

    const data = await response.json();
    return {
      line_uid: data.sub,
      line_uname: data.name,
    };
  } catch (e) {
    console.error(e.message);
    throw new Error("Failed to verify ID token or fetch user info");
  }
};
