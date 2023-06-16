import fetch from 'node-fetch';
import express from 'express';
const PORT = process.env.PORT || 5001
import ClientPg from 'pg';
const { Client } = ClientPg;

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
  .post('/selectMonshin', (req, res) => selectMonshin(req, res))
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
          const line_uname = json.name;
          const line_uid = json.sub;
          res.status(200).send({ line_uname, line_uid });
        })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
}

// 初診かどうか判定する
const selectUserInfo = (req, res) => {
  const data = req.body;
  console.log('selectUserInfo.line_uid' + data.line_uid);
  let firstConsulFlg = false;
  let birthday = '';
  let name = '';
  const select_query = {
    text: `SELECT * FROM users WHERE line_uid='${data.line_uid}' AND delete_flg=0;`
  }

  connection.query(select_query)
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
      res.status(200).send({ firstConsulFlg, name, birthday });
    })
    .catch(e => console.log(e))
    .finally(() => {
      req.connection.end;
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
  console.log('created_at:' + created_at);
  console.log('data.line_uid:' + data.line_uid);
  console.log('data.line_uname:' + data.line_uname);
  console.log('data.name:' + data.name);
  console.log('data.birthday:' + data.birthday);
  console.log('data.height:' + data.height);
  console.log('data.weight:' + data.weight);
  console.log('data.waist:' + data.waist);
  console.log('data.blood_pressure_max:' + data.blood_pressure_max);
  console.log('data.blood_pressure_min:' + data.blood_pressure_min);
  const insert_query = {
    text: `INSERT INTO users(line_uid, line_uname, name, birthday, height, weight, waist, blood_pressure_max, blood_pressure_min, created_at, delete_flg) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
    values: [data.line_uid, data.line_uname, data.name, data.birthday, data.height, data.weight, data.waist, data.blood_pressure_max, data.blood_pressure_min, created_at, 0]
  };

  connection.query(insert_query)
    .then(() => {
      console.log('userを追加しました。');
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
  console.log('updated_at:' + updated_at);
  console.log('data.line_uid:' + data.line_uid);
  console.log('data.height:' + data.height);
  console.log('data.weight:' + data.weight);
  console.log('data.waist:' + data.waist);
  console.log('data.blood_pressure_max:' + data.blood_pressure_max);
  console.log('data.blood_pressure_min:' + data.blood_pressure_min);

  const update_query = {
    text: `UPDATE users SET height='${data.height}', weight='${data.weight}', waist='${data.waist}', blood_pressure_max='${data.blood_pressure_max}', blood_pressure_min='${data.blood_pressure_min}', updated_at='${updated_at}' WHERE line_uid='${data.line_uid}' AND delete_flg=0;`
  };
  connection.query(update_query)
    .then(() => {
      console.log('userを更新しました。');
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

// 最後の問診情報を取得する
const selectMonshin = (req, res) => {
  const data = req.body;
  let monshin_umu = false; // false:レコードなし true:レコードあり
  let latest_weight = '';
  let latest_waist = '';
  let latest_bloodPressure_max = '';
  let latest_bloodPressure_min = '';
  const select_query = {
    text: `SELECT weight, waist, blood_pressure_max, blood_pressure_min FROM users WHERE line_uid='${data.line_uid}' AND delete_flg=0`
  };
  connection.query(select_query)
    .then((data) => {
      if (data.rows.length > 0) {
        monshin_umu = true;
        latest_weight = data.rows[0].weight;
        latest_waist = data.rows[0].waist;
        latest_bloodPressure_max = data.rows[0].blood_pressure_max;
        latest_bloodPressure_min = data.rows[0].blood_pressure_min;
      }
      res.status(200).send({ monshin_umu, latest_weight, latest_waist, latest_bloodPressure_max, latest_bloodPressure_min });
    })
    .catch(e => {
      console.log(e);
    })
    .finally(() => {
      req.connection.end;
    })
}