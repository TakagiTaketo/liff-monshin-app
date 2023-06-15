window.onload = function () {
    // セッションから各取得
    // 氏名
    if (sessionStorage.getItem('username') != null) {
        $('#username').html(sessionStorage.getItem('username'));
    }
    // 生年月日
    if (sessionStorage.getItem('birthday_year') != null
        && sessionStorage.getItem('birthday_month') != null
        && sessionStorage.getItem('birthday_day') != null) {
        $('#birthday').html(sessionStorage.getItem('birthday_year') + '年' + sessionStorage.getItem('birthday_month') + '月' + sessionStorage.getItem('birthday_day') + '日');
    }
    // 身長
    if (sessionStorage.getItem('height') != null) {
        $('#height').html(sessionStorage.getItem('height') + 'cm');
    }
    // 体重
    if (sessionStorage.getItem('weight') != null) {
        $('#weight').html(sessionStorage.getItem('weight') + 'kg');
    }
    // 体重（変化有無）
    if (sessionStorage.getItem('weight_check') == '※変化なし') {
        $('#weight_check').html('※変化なし');
    } else {
        $('#weight_check').html('');
    }
    // 腹囲
    if (sessionStorage.getItem('waist') != null) {
        $('#waist').html(sessionStorage.getItem('waist') + 'cm');
    }
    // 腹囲（変化有無）
    if (sessionStorage.getItem('waist_check') == '※変化なし') {
        $('#waist_check').html('※変化なし');
    } else {
        $('#waist_check').html('');
    }
    // 血圧
    if (sessionStorage.getItem('bloodPressure') != null) {
        $('#bloodPressure').html(sessionStorage.getItem('bloodPressure') + 'mmHg');
    }
    // 血圧（変化有無）
    if (sessionStorage.getItem('bloodPressure_check') == '※変化なし') {
        $('#bloodPressure_check').html('※変化なし')
    } else {
        $('#bloodPressure_check').html('');
    }
    // 取組状況（食事）
    if (sessionStorage.getItem('meal') != null) {
        if (sessionStorage.getItem('meal') == 'true') {
            $('#meal').html('食事');
        } else {
            $('#meal').html('');
        }
    }
    // 取組状況（運動）
    if (sessionStorage.getItem('exercise') != null) {
        if (sessionStorage.getItem('exercise') == 'true') {
            $('#exercise').html('運動');
        } else {
            $('#exercise').html('');
        }
    }
    // その他自由記入欄
    if (sessionStorage.getItem('sonota_initiativeText') != null) {
        $('#sonota_initiativeText').html(sessionStorage.getItem('sonota_initiativeText'));
    }
    // 健診後
    if (sessionStorage.getItem('kenshin_after') != null) {
        if (sessionStorage.getItem('kenshin_after') == 'はい') {
            $('#kenshin_after').html('はい');
        } else if (sessionStorage.getItem('kenshin_after') == 'いいえ') {
            $('#kenshin_after').html('いいえ');
        }
    }
    // お薬の服用状況
    if (sessionStorage.getItem('medicine') != null) {
        if (sessionStorage.getItem('medicine') == 'はい') {
            $('#medicine').html('はい');
        } else if (sessionStorage.getItem('medicine') == 'いいえ') {
            $('#medicine').html('いいえ');
        } else if (sessionStorage.getItem('medicine') == 'わからない') {
            $('#medicine').html('わからない');
        }
    }
    // Q2-1_1
    if (sessionStorage.getItem('Q2-1_1') != null) {
        if (sessionStorage.getItem('Q2-1_1') == 'はい') {
            $('#Q2-1_1').html('はい');
        } else if (sessionStorage.getItem('Q2-1_1') == 'いいえ') {
            $('#Q2-1_1').html('いいえ');
        }
    }
    // Q2-1_2
    if (sessionStorage.getItem('Q2-1_2') != null) {
        if (sessionStorage.getItem('Q2-1_2') == 'はい') {
            $('#Q2-1_2').html('はい');
        } else if (sessionStorage.getItem('Q2-1_2') == 'いいえ') {
            $('#Q2-1_2').html('いいえ');
        }
    }
    // Q2-1_3
    if (sessionStorage.getItem('Q2-1_3') != null) {
        if (sessionStorage.getItem('Q2-1_3') == 'はい') {
            $('#Q2-1_3').html('はい');
        } else if (sessionStorage.getItem('Q2-1_3') == 'いいえ') {
            $('#Q2-1_3').html('いいえ');
        }
    }
    // Q2-2
    if (sessionStorage.getItem('Q2-2') != null) {
        if (sessionStorage.getItem('Q2-2') == 'はい') {
            $('#Q2-2').html('はい');
        } else if (sessionStorage.getItem('Q2-2') == 'いいえ') {
            $('#Q2-2').html('いいえ');
        }
    }
    // Q2-3
    if (sessionStorage.getItem('Q2-3') != null) {
        if (sessionStorage.getItem('Q2-3') == 'はい') {
            $('#Q2-3').html('はい');
        } else if (sessionStorage.getItem('Q2-3') == 'いいえ') {
            $('#Q2-3').html('いいえ');
        }
    }
    // Q2-4
    if (sessionStorage.getItem('Q2-4') != null) {
        if (sessionStorage.getItem('Q2-4') == 'はい') {
            $('#Q2-4').html('はい');
        } else if (sessionStorage.getItem('Q2-4') == 'いいえ') {
            $('#Q2-4').html('いいえ');
        }
    }
    // Q2-5
    if (sessionStorage.getItem('Q2-5') != null) {
        if (sessionStorage.getItem('Q2-5') == 'はい') {
            $('#Q2-5').html('はい');
        } else if (sessionStorage.getItem('Q2-5') == 'いいえ') {
            $('#Q2-5').html('いいえ');
        }
    }
    // その他
    if (sessionStorage.getItem('sonota') != null) {
        $('#sonota').html(sessionStorage.getItem('sonota'));
    }

}