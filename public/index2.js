window.onload = function () {
    // セッションから各取得
    if (sessionStorage.getItem('Q2-1_1') != null) {
        if (sessionStorage.getItem('Q2-1_1') == 'はい') {
            $('#Q2-1_1Yes').attr('checked', true);
        } else if (sessionStorage.getItem('Q2-1_1') == 'いいえ') {
            $('#Q2-1_1No').attr('checked', true);
        }
    }
    if (sessionStorage.getItem('Q2-1_2') != null) {
        if (sessionStorage.getItem('Q2-1_2') == 'はい') {
            $('#Q2-1_2Yes').attr('checked', true);
        } else if (sessionStorage.getItem('Q2-1_2') == 'いいえ') {
            $('#Q2-1_2No').attr('checked', true);
        }
    }
    if (sessionStorage.getItem('Q2-1_3') != null) {
        if (sessionStorage.getItem('Q2-1_3') == 'はい') {
            $('#Q2-1_3Yes').attr('checked', true);
        } else if (sessionStorage.getItem('Q2-1_3') == 'いいえ') {
            $('#Q2-1_3No').attr('checked', true);
        }
    }
    if (sessionStorage.getItem('Q2-2') != null) {
        if (sessionStorage.getItem('Q2-2') == 'はい') {
            $('#Q2-2Yes').attr('checked', true);
        } else if (sessionStorage.getItem('Q2-2') == 'いいえ') {
            $('#Q2-2No').attr('checked', true);
        }
    }
    if (sessionStorage.getItem('Q2-3') != null) {
        if (sessionStorage.getItem('Q2-3') == 'はい') {
            $('#Q2-3Yes').attr('checked', true);
        } else if (sessionStorage.getItem('Q2-3') == 'いいえ') {
            $('#Q2-3No').attr('checked', true);
        }
    }
    if (sessionStorage.getItem('Q2-4') != null) {
        if (sessionStorage.getItem('Q2-4') == 'はい') {
            $('#Q2-4Yes').attr('checked', true);
        } else if (sessionStorage.getItem('Q2-4') == 'いいえ') {
            $('#Q2-4No').attr('checked', true);
        }
    }
    if (sessionStorage.getItem('Q2-5') != null) {
        if (sessionStorage.getItem('Q2-5') == 'はい') {
            $('#Q2-5Yes').attr('checked', true);
        } else if (sessionStorage.getItem('Q2-5') == 'いいえ') {
            $('#Q2-5No').attr('checked', true);
        }
    }
    if (sessionStorage.getItem('sonota') != null) {
        $('#sonota').val(sessionStorage.getItem('sonota'));
    }
}
