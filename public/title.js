window.onload = function () {
    // セッションから各取得
    // 氏名
    if (sessionStorage.getItem('username') != null) {
        $('#username').val(sessionStorage.getItem('username'));
    }
    // 生年月日（年）
    if (sessionStorage.getItem('birthday_year') != null) {
        $('#birthday_year').val(sessionStorage.getItem('birthday_year'));
    }
    // 生年月日（月）
    if (sessionStorage.getItem('birthday_month') != null) {
        $('#birthday_month').val(sessionStorage.getItem('birthday_month'));
    }
    // 生年月日（日）
    if (sessionStorage.getItem('birthday_day') != null) {
        $('#birthday_day').val(sessionStorage.getItem('birthday_day'));
    }
    // 身長
    if (sessionStorage.getItem('height') != null) {
        $('#height').val(sessionStorage.getItem('height'));
    }
    // 体重
    if (sessionStorage.getItem('weight') != null) {
        $('#weight').val(sessionStorage.getItem('weight'));
    }
    // 体重（変化有無）
    if (sessionStorage.getItem('weight_check') == '※変化なし') {
        $('#weight_check').attr('checked', true);
    } else {
        $('#weight_check').attr('checked', false);
    }
    // 腹囲
    if (sessionStorage.getItem('waist') != null) {
        $('#waist').val(sessionStorage.getItem('waist'));
    }
    // 腹囲（変化有無）
    if (sessionStorage.getItem('waist_check') == '※変化なし') {
        $('#waist_check').attr('checked', true);
    } else {
        $('#waist_check').attr('checked', false);
    }
    // 血圧
    if (sessionStorage.getItem('bloodPressure') != null) {
        $('#bloodPressure').val(sessionStorage.getItem('bloodPressure'));
    }
    // 血圧（変化有無）
    if (sessionStorage.getItem('bloodPressure_check') == '※変化なし') {
        $('#bloodPressure_check').attr('checked', true);
    } else {
        $('#bloodPressure_check').attr('checked', false);
    }
    // 取組状況（食事）
    if (sessionStorage.getItem('meal') != null) {
        if (sessionStorage.getItem('meal') == 'true') {
            $('#meal').attr('checked', true);
        } else {
            $('#meal').attr('checked', false);
        }
    }
    // 取組状況（運動）
    if (sessionStorage.getItem('exercise') != null) {
        if (sessionStorage.getItem('exercise') == 'true') {
            $('#exercise').attr('checked', true);
        } else {
            $('#exercise').attr('checked', false);
        }
    }
    // その他自由記入欄
    if (sessionStorage.getItem('sonota_initiativeText') != null) {
        $('#sonota_initiativeText').val(sessionStorage.getItem('sonota_initiativeText'));
    }
    // 健診後
    if (sessionStorage.getItem('kenshin_after') != null) {
        if (sessionStorage.getItem('kenshin_after') == 'はい') {
            $('#kenshin_after_yes').attr('checked', true);
            $('#medicine_yes').attr('disabled', false);
            $('#medicine_no').attr('disabled', false);
            $('#medicine_wakaranai').attr('disabled', false);
        } else if (sessionStorage.getItem('kenshin_after') == 'いいえ') {
            $('#kenshin_after_no').attr('checked', true);
        }
    }
    // お薬の服用状況
    if (sessionStorage.getItem('medicine') != null) {
        if (sessionStorage.getItem('medicine') == 'はい') {
            $('#medicine_yes').attr('checked', true);
        } else if (sessionStorage.getItem('medicine') == 'いいえ') {
            $('#medicine_no').attr('checked', true);
        } else if (sessionStorage.getItem('medicine') == 'わからない') {
            $('#medicine_wakaranai').attr('checked', true);
        }
    }
}
