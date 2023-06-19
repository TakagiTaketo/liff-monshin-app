let line_uid = '';
let line_uname = '';
let latest_weight = '';
let latest_waist = '';
let latest_bloodPressure_max = '';
let latest_bloodPressure_min = '';
const liffId = "1660856020-9r4xpNbr";//
let dialog = document.querySelector('dialog');
let dialog_send = $('#dialog_send');
let dialog_close = $('#dialog_close');


window.addEventListener("DOMContentLoaded", () => {
    // LIFF 初期化
    liff.init({
        liffId: liffId
    })
        .then(() => {
            checkLogin();
            const idtoken = liff.getIDToken();
            const jsonData = JSON.stringify({
                id_token: idtoken
            });
            // LINEプロフィール取得
            fetch('/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData,
                creadentials: 'same-origin'
            })
                .then(res => {
                    res.json()
                        .then(json => {
                            console.log('json:' + json);
                            line_uname = json.line_uname;
                            line_uid = json.line_uid;

                            // 最後の問診データを取得する
                            const jsonData = JSON.stringify({
                                line_uid: line_uid
                            });
                            fetch('/selectMonshin', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: jsonData,
                                creadentials: 'same-origin'
                            })
                                .then(res => {
                                    res.json()
                                        .then(json => {
                                            let monshin_umu = json.monshin_umu;
                                            latest_weight = json.latest_weight;
                                            latest_waist = json.latest_waist;
                                            latest_bloodPressure_max = json.latest_bloodPressure_max;
                                            latest_bloodPressure_min = json.latest_bloodPressure_min;
                                            console.log('latest_weight:' + monshin_umu);
                                            console.log('latest_weight:' + latest_weight);
                                            console.log('latest_waist:' + latest_waist);
                                            console.log('latest_bloodPressure_max:' + latest_bloodPressure_max);
                                            console.log('latest_bloodPressure_min:' + latest_bloodPressure_min);

                                            let changing_checks = document.getElementsByName('changing_check');
                                            if (monshin_umu) {
                                                // 入力がなかった時、入力なしとする
                                                if (latest_weight == '') {
                                                    latest_weight = '入力なし';
                                                } else if (latest_waist == '') {
                                                    latest_waist = '入力なし';
                                                } else if (latest_bloodPressure_max == '') {
                                                    latest_bloodPressure_max = '入力なし';
                                                } else if (latest_bloodPressure_min == '') {
                                                    latest_bloodPressure_min = '入力なし';
                                                }

                                                for (let i = 0; i < changing_checks.length; i++) {
                                                    changing_checks[i].style.display = "block";
                                                }
                                                document.getElementById('latest_weight').innerText = latest_weight;
                                                document.getElementById('latest_waist').innerText = latest_waist;
                                                document.getElementById('latest_bloodPressure_max').innerText = latest_bloodPressure_max;
                                                document.getElementById('latest_bloodPressure_min').innerText = latest_bloodPressure_min;
                                            } else {
                                                for (let i = 0; i < changing_checks.length; i++) {
                                                    changing_checks[i].style.display = "none";
                                                }
                                            }
                                        })
                                })
                        })
                })
                .catch((err) => {
                    alert(err);
                })
        })
        .catch((err) => {
            alert(err);
        });
});
// ログインチェック
function checkLogin() {
    // ログインチェック
    if (liff.isLoggedIn()) {
        //ログイン済
    } else {
        // 未ログイン
        let result = window.confirm("LINE Loginを行います。");
        if (result) {
            liff.login();
        }
    }
}

window.addEventListener('load', function () {
    // 生年月日プルダウンの生成
    setpull_birthday_year();
    setpull_birthday_month();
    setpull_birthday_day();
})
// メッセージ送信
function sendText(text) {
    liff.sendMessages([
        {
            'type': 'text',
            'text': text
        }
    ]).then(function () {
        liff.closeWindow();
    }).catch(function (error) {
        window.alert('Failed to send message ' + error);
    });
}

// 1ページ目の次の質問へ進むボタン押下時処理
$(function () {
    $('#form1').submit(function () {
        setPage1Session();
        goPage2();
        return false;
    });
});
// 2ページ目の確認ボタン押下時処理
$(function () {
    $('#form2').submit(function () {
        setPage2Session();
        goConfirm();
        return false;
    });
});
// 送信ボタン押下時処理
function sendResult() {
    // Page1
    // 氏名
    const username = sessionStorage.getItem('username');
    // 生年月日
    const birthday = sessionStorage.getItem('birthday_year') + '年' + sessionStorage.getItem('birthday_month') + '月' + sessionStorage.getItem('birthday_day') + '日';
    // 身長
    const height = sessionStorage.getItem('height');
    // 体重
    const weight = sessionStorage.getItem('weight');
    // 体重（変化有無）
    const weight_check = sessionStorage.getItem('weight_check');
    // 腹囲
    const waist = sessionStorage.getItem('waist');
    // 腹囲（変化有無）
    const waist_check = sessionStorage.getItem('waist_check');
    // 血圧(最高)
    const bloodPressure_max = sessionStorage.getItem('bloodPressure_max');
    // 血圧(最低)
    const bloodPressure_min = sessionStorage.getItem('bloodPressure_min');
    // 血圧（変化有無）
    const bloodPressure_check = sessionStorage.getItem('bloodPressure_check');

    // 取組状況
    // 食事
    let meal = '';
    if (sessionStorage.getItem('meal') == 'true') {
        meal = '食事';
    }
    // 運動
    let exercise = '';
    if (sessionStorage.getItem('exercise') == 'true') {
        exercise = '運動';
    }
    // その他自由記入欄
    const sonota_initiativeText = sessionStorage.getItem('sonota_initiativeText')

    // Q1-8.健診後に医療機関を受診しましたか？
    const q1_8Text = 'Q.健診後に医療機関を受診しましたか？';
    const kenshin_after = sessionStorage.getItem('kenshin_after');

    // Q2-9.血糖値、血圧、中性脂肪、コレステロールについてのお薬を飲み始めましたか？
    const q1_9Text = 'Q.血糖値、血圧、中性脂肪、コレステロールについてのお薬を飲み始めましたか？';
    let medicine = sessionStorage.getItem('medicine');
    if (kenshin_after == 'いいえ') {
        medicine = 'いいえ';
    }

    // Page2
    const q2_1Text = 'Q.現在、aからcの薬の使用の有無';
    const q2_1_1Text = 'a.血圧を下げる薬';
    const q2_1_2Text = 'b.インスリン注射又は血統を下げる薬';
    const q2_1_3Text = 'c.コレステロールを下げる薬';
    const q2_2Text = 'Q.医師から、脳卒中(脳出血、脳梗塞等)にかかっているといわれたり、治療を受けたことがありますか？';
    const q2_3Text = 'Q.医師から、心臓病（狭心症、心筋梗塞等）にかかっているといわれたり、治療を受けたことがありますか。';
    const q2_4Text = 'Q.医師から、慢性の腎不全にかかっているといわれたり、治療（人工透析）を受けたことがありますか。';
    const q2_5Text = 'Q.医師から、貧血といわれたことがある。';
    const q2_1_1 = sessionStorage.getItem('Q2-1_1');
    const q2_1_2 = sessionStorage.getItem('Q2-1_2');
    const q2_1_3 = sessionStorage.getItem('Q2-1_3');
    const q2_2 = sessionStorage.getItem('Q2-2');
    const q2_3 = sessionStorage.getItem('Q2-3');
    const q2_4 = sessionStorage.getItem('Q2-4');
    const q2_5 = sessionStorage.getItem('Q2-5');
    const sonota = sessionStorage.getItem('sonota');
    // メッセージ作成
    const msg = `問診記入\n氏名：${username}\n生年月日：${birthday}\n身長：${height}cm\n体重：${weight}kg${weight_check}\n腹囲：${waist}cm${waist_check}\n最高血圧(収縮期血圧)：${bloodPressure_max}mmHg\n最低血圧(拡張期血圧)：${bloodPressure_min}mmHg\n${bloodPressure_check}\n取組状況：${meal}\n${exercise}\n${sonota_initiativeText}\n\n${q1_8Text}\n${kenshin_after}\n\n${q1_9Text}\n${medicine}\n\n${q2_1Text}\n${q2_1_1Text}\n${q2_1_1}\n\n${q2_1_2Text}\n${q2_1_2}\n\n${q2_1_3Text}\n${q2_1_3}\n\n${q2_2Text}\n${q2_2}\n\n${q2_3Text}\n${q2_3}\n\n${q2_4Text}\n${q2_4}\n\n${q2_5Text}\n${q2_5}\n\nQ.その他質問事項等：${sonota}`;
    const medicine_msg = `問診記入\nお薬服用中\n氏名：${username}\n生年月日：${birthday}\n身長：${height}cm\n体重：${weight}kg${weight_check}\n腹囲：${waist}cm${waist_check}\n最高血圧(収縮期血圧)：${bloodPressure_max}mmHg\n最低血圧(拡張期血圧)：${bloodPressure_min}mmHg\n${bloodPressure_check}\n取組状況：${meal}\n${exercise}\n${sonota_initiativeText}\n\n${q1_8Text}\n${kenshin_after}\n\n${q1_9Text}\n${medicine}\n\n${q2_1Text}\n${q2_1_1Text}\n${q2_1_1}\n\n${q2_1_2Text}\n${q2_1_2}\n\n${q2_1_3Text}\n${q2_1_3}\n\n${q2_2Text}\n${q2_2}\n\n${q2_3Text}\n${q2_3}\n\n${q2_4Text}\n${q2_4}\n\n${q2_5Text}\n${q2_5}\n\nQ.その他質問事項等：${sonota}`;

    const jsonData_selectuser = JSON.stringify({
        line_uid: line_uid,
        name: username,
        birthday: sessionStorage.getItem('birthday_year') + '-' + sessionStorage.getItem('birthday_month').toString().padStart(2, "0") + '-' + sessionStorage.getItem('birthday_day').toString().padStart(2, "0")
    });
    // データベースに存在するかチェックする
    fetch('/selectUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData_selectuser,
        credentials: 'same-origin'
    })
        .then(res => {
            res.json()
                .then(json => {
                    // jsonData作成
                    const jsonData = JSON.stringify({
                        line_uid: line_uid,
                        line_uname: line_uname,
                        name: username,
                        birthday: sessionStorage.getItem('birthday_year') + '-' + sessionStorage.getItem('birthday_month').toString().padStart(2, "0") + '-' + sessionStorage.getItem('birthday_day').toString().padStart(2, "0"),
                        height: height,
                        weight: weight,
                        waist: waist,
                        blood_pressure_max: bloodPressure_max,
                        blood_pressure_min: bloodPressure_min
                    });
                    console.log('json.firstConsulFlg:' + json.firstConsulFlg);
                    // データベースにいない場合、新規追加する。
                    if (json.firstConsulFlg) {
                        fetch('/insertUser', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: jsonData,
                            credentials: 'same-origin'
                        })
                            .then(() => {
                                // メッセージ送信
                                if (medicine == 'はい') {
                                    sendText(medicine_msg);
                                } else {
                                    sendText(msg);
                                }
                                return false;
                            })
                            .catch((err) => {
                                alert(err);
                            })
                    } else if (!json.firstConsulFlg
                        && (json.name != username || json.birthday != sessionStorage.getItem('birthday_year') + '-' + sessionStorage.getItem('birthday_month').toString().padStart(2, "0") + '-' + sessionStorage.getItem('birthday_day').toString().padStart(2, "0"))) {
                        // データベースに存在するが、入力された氏名、生年月日が一致しない場合
                        $('#dialog_username').text(json.name);
                        $('#dialog_birthday').text(json.birthday);
                        $('#dialog_username_new').text(username);
                        $('#dialog_birthday_new').text(sessionStorage.getItem('birthday_year') + '-' + sessionStorage.getItem('birthday_month').toString().padStart(2, "0") + '-' + sessionStorage.getItem('birthday_day').toString().padStart(2, "0"));
                        dialog.showModal();
                        return false;
                        //alert("氏名、生年月日が初回時に入力されたものと異なります。\nご確認ください。\n初回登録時\n氏名:" + json.name + "\n生年月日:" + json.birthday + "\n今回の入力\n氏名:" + username + "\n生年月日:" + sessionStorage.getItem('birthday_year') + '-' + sessionStorage.getItem('birthday_month').toString().padStart(2, "0") + '-' + sessionStorage.getItem('birthday_day').toString().padStart(2, "0")
                        //    + "変更する場合は");

                    } else if (!json.firstConsulFlg
                        && (json.name != username || json.birthday != sessionStorage.getItem('birthday_year') + '-' + sessionStorage.getItem('birthday_month').toString().padStart(2, "0") + '-' + sessionStorage.getItem('birthday_day').toString().padStart(2, "0"))) {
                        // 新しい氏名・生年月日で更新する場合
                        // データベースに存在する場合、更新する。
                        fetch('/updateUser', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: jsonData,
                            credentials: 'same-origin'
                        })
                            .then(() => {
                                // メッセージ送信
                                if (medicine == 'はい') {
                                    sendText(medicine_msg);
                                } else {
                                    sendText(msg);
                                }
                                return false;
                            })
                            .catch((err) => {
                                alert(err);
                            })

                    } else if (!json.firstConsulFlg
                        && json.name == username && json.birthday == sessionStorage.getItem('birthday_year') + '-' + sessionStorage.getItem('birthday_month').toString().padStart(2, "0") + '-' + sessionStorage.getItem('birthday_day').toString().padStart(2, "0")) {
                        // データベースに存在する場合、更新する。
                        fetch('/updateUser', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: jsonData,
                            credentials: 'same-origin'
                        })
                            .then(() => {
                                // メッセージ送信
                                if (medicine == 'はい') {
                                    sendText(medicine_msg);
                                } else {
                                    sendText(msg);
                                }
                                return false;
                            })
                            .catch((err) => {
                                alert(err);
                            })

                    }
                })
                .catch((err) => {
                    alert(err);
                });
        })
        .catch((err) => {
            alert(err);
        });
}

// 下部の1ページ目ボタン押下時
function clickPage1Button() {
    setPage2Session();
    goPage1();
}
// 下部の2ページ目ボタン押下時
function clickPage2Button() {
    setPage1Session();
    goPage2();
}
// ページ1の入力値をセッションに格納する
function setPage1Session() {
    // 氏名
    sessionStorage.setItem('username', $('#username').val());
    // 生年月日（年）
    sessionStorage.setItem('birthday_year', $('#birthday_year').val());
    // 生年月日（月）
    sessionStorage.setItem('birthday_month', $('#birthday_month').val());
    // 生年月日（日）
    sessionStorage.setItem('birthday_day', $('#birthday_day').val());
    // 身長
    sessionStorage.setItem('height', $('#height').val());
    // 体重
    sessionStorage.setItem('weight', $('#weight').val());
    // 体重（変化有無）
    if ($('#weight_check').prop('checked')) {
        sessionStorage.setItem('weight_check', '※変化なし');
    } else {
        sessionStorage.setItem('weight_check', '');
    }
    // 腹囲
    sessionStorage.setItem('waist', $('#waist').val());
    // 腹囲（変化有無）
    if ($('#waist_check').prop('checked')) {
        sessionStorage.setItem('waist_check', '※変化なし');
    } else {
        sessionStorage.setItem('waist_check', '');
    }
    // 最高血圧
    sessionStorage.setItem('bloodPressure_max', $('#bloodPressure_max').val());
    // 最低血圧
    sessionStorage.setItem('bloodPressure_min', $('#bloodPressure_min').val());
    // 血圧（変化有無）
    if ($('#bloodPressure_check').prop('checked')) {
        sessionStorage.setItem('bloodPressure_check', '※変化なし');
    } else {
        sessionStorage.setItem('bloodPressure_check', '');
    }
    // 取組状況（食事）
    let meal = '';
    if ($('#meal').prop('checked')) {
        meal = 'true';
    } else {
        meal = 'false';
    }
    sessionStorage.setItem('meal', meal);
    // 取組状況（運動）
    let exercise = '';
    if ($('#exercise').prop('checked')) {
        exercise = 'true';
    } else {
        exercise = 'false';
    }
    sessionStorage.setItem('exercise', exercise);
    // 取組状況（その他自由記入欄）
    sessionStorage.setItem('sonota_initiativeText', $('#sonota_initiativeText').val());
    // 健診後
    let kenshin_after = '';
    $('input[name="kenshin_after"]:checked').each(function () {
        kenshin_after = $(this).val();
    })
    sessionStorage.setItem('kenshin_after', kenshin_after);
    // お薬
    let medicine = '';
    $('input[name="medicine"]:checked').each(function () {
        medicine = $(this).val();
    })
    if (kenshin_after == 'はい') {
        sessionStorage.setItem('medicine', medicine);
    } else if (kenshin_after == 'いいえ') {
        sessionStorage.setItem('medicine', '');
    }
}

// 2ページ目の入力値をセッションに格納する
function setPage2Session() {
    // Q2-1_1
    let q2_1_1 = '';
    $('input[name="Q2-1_1"]:checked').each(function () {
        q2_1_1 = $(this).val();
    })

    sessionStorage.setItem('Q2-1_1', q2_1_1);
    // Q2-1_2
    let q2_1_2 = '';
    $('input[name="Q2-1_2"]:checked').each(function () {
        q2_1_2 = $(this).val();
    })
    sessionStorage.setItem('Q2-1_2', q2_1_2);
    // Q2-1_3
    let q2_1_3 = '';
    $('input[name="Q2-1_3"]:checked').each(function () {
        q2_1_3 = $(this).val();
    })
    sessionStorage.setItem('Q2-1_3', q2_1_3);
    // Q2-2
    let q2_2 = '';
    $('input[name="Q2-2"]:checked').each(function () {
        q2_2 = $(this).val();
    })
    sessionStorage.setItem('Q2-2', q2_2);
    // Q2-3
    let q2_3 = '';
    $('input[name="Q2-3"]:checked').each(function () {
        q2_3 = $(this).val();
    })
    sessionStorage.setItem('Q2-3', q2_3);
    // Q2-4
    let q2_4 = '';
    $('input[name="Q2-4"]:checked').each(function () {
        q2_4 = $(this).val();
    })
    sessionStorage.setItem('Q2-4', q2_4);
    // Q2-5
    let q2_5 = '';
    $('input[name="Q2-5"]:checked').each(function () {
        q2_5 = $(this).val();
    })
    sessionStorage.setItem('Q2-5', q2_5);
    // その他質問事項
    sessionStorage.setItem('sonota', $('#sonota').val());
}
// 1ページ目に遷移する
function goPage1() {
    // 画面遷移
    location.href = '/index.html';
}
// 2ページ目に遷移する
function goPage2() {
    // 画面遷移
    location.href = '/index2.html';
}
// 確認画面に遷移する
function goConfirm() {
    // ページ1の必須入力項目が入力済みかどうか確認
    if (sessionStorage.getItem('username') != ''
        && sessionStorage.getItem('birthday_year') != ''
        && sessionStorage.getItem('birthday_month') != ''
        && sessionStorage.getItem('birthday_day') != ''
        && sessionStorage.getItem('height') != ''
        && sessionStorage.getItem('weight') != ''
        && sessionStorage.getItem('kenshin_after') != ''
    ) {
        location.href = '/confirm.html';
    } else {
        alert('ページ1の必須入力項目が未入力です。');
    }
}
// Q8で「はい」を選択した時、Q9を活性化する。いいえの時は非活性とする。
function displayQ9(value) {
    if (value == 'はい') {
        $('#medicine_yes').attr('disabled', false);
        $('#medicine_no').attr('disabled', false);
        $('#medicine_wakaranai').attr('disabled', false);
    } else if (value == 'いいえ') {
        $('#medicine_yes').attr('disabled', true);
        $('#medicine_no').attr('disabled', true);
        $('#medicine_wakaranai').attr('disabled', true);
    }
}


// ダイアログの閉じるボタン押下時
function click_dialog_close() {
    dialog.close();
}

// 「変化なし」チェックボックスにチェックした時、前回の入力値を挿入する。
function check_changing(checkbox) {
    if (!$('#' + checkbox).prop('checked')) {
        return false;
    }
    switch (checkbox) {
        case 'weight_check':
            $('#weight').val(latest_weight);
            break;
        case 'waist_check':
            $('#waist').val(latest_waist);
            break;
        case 'bloodPressure_check':
            $('#bloodPressure_max').val(latest_bloodPressure_max);
            $('#bloodPressure_min').val(latest_bloodPressure_min);
            break;
        default:
            console.log('未登録のチェックボックスです。');
    }
}

// 生年月日プルダウン生成(年)
function setpull_birthday_year() {
    const select_year = document.getElementById('birthday_year');

    // 年プルダウンを生成
    for (let i = 1900; i <= 2023; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        select_year.appendChild(option);
    }
}
// 生年月日プルダウン生成(月)
function setpull_birthday_month() {
    const select_month = document.getElementById('birthday_month');

    // 月プルダウンを生成
    for (let i = 1; i <= 12; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        select_month.appendChild(option);
    }

}

// 生年月日プルダウン生成（日）
function setpull_birthday_day() {
    const select_year = document.getElementById('birthday_year');
    const select_month = document.getElementById('birthday_month');
    const select_day = document.getElementById('birthday_day');
    // 日プルダウンを生成

    //日の選択肢を空にする
    let children = select_day.children;
    while (children.length) {
        children[0].remove();
    }
    // 日を生成(動的に変える)
    if (select_year.value !== '' && select_month.value !== '') {
        const last_day = new Date(select_year.value, select_month.value, 0).getDate();

        for (i = 1; i <= last_day; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = i;
            select_day.appendChild(option);
        }
    }
}

// 生年月日プルダウンの年、月が変更された時、日のプルダウンを再生成する。
function change_birthday_pull() {
    setpull_birthday_day();
}