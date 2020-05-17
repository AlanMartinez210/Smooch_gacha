window.toggleBtn = true;


$(document).ready(function(){
    // ログイン
    $('#doLogin').on('click', function(){
        const username = $("#user_name").val();
        const password = $("#password").val();
        if(!username || !password) return $("#error").text("入力されていない項目があります。");
        
        fetch('/login', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                user_name: username,
                password: password
            })
        })
        .then(response  => response.json())
        .then(res  => {
            if(res.status === "error"){
                return $("#error").text(res.message);
            }
            location.href = "/";
        })
    });
    // 登録
    $('#doRegist').on('click', function(){
        const username = $("#user_name").val();
        const password = $("#password").val();
        if(!username || !password) return $("#error").text("入力されていない項目があります。");
        
        fetch('/regist', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                user_name: username,
                password: password
            })
        })
        .then(response  => response.json())
        .then(res  => {
            if(res.status === "error"){
                return $("#error").text(res.message);
            }
            location.href = "/";
        })
    });

    // ガチャ
    $('#doLoadCard').on('click', function(){
        
        if(window.toggleBtn){
            window.toggleBtn = false;
        }else{
            return;
        }
        $("#gacha_card").fadeOut("slow");
        

        if(checkCount() === 0){
            alert("まだ引けません！");
            window.toggleBtn = true;
            return;
        }else{

            // 引く
            $(".gacha_img_container").addClass("shake_box");
            fetch('/loadcard', {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                }
            })
            .then(response  => response.json())
            .then(res  => {
                if(res.status === "error"){
                    alert(res.message);
                    return;
                }

                // 引いたあとの処理
                // cookieの時間に+5分する
                if(typeof $.cookie("gatyacount") === 'undefined'){
                    // 現在時刻を代入
                    $.cookie("gatyacount", new Date().toString(), { expires: 1 });
                    $('#gacha_count').text(`あと ${checkCount()} 回`);
                }else{
                    let ct = new Date($.cookie("gatyacount"));
                    ct = ct.setMinutes(ct.getMinutes() + 5);
                    $.cookie("gatyacount", new Date(ct).toString(), { expires: 1 });
                    $('#gacha_count').text(`あと ${checkCount()} 回`);
                }
                
                setTimeout(function(){
                    $('.card_img').children('img').attr('src', `images/card/${res.resData.card_img}`);

                    $("#cardName").text(res.resData.card_name)
                    $("#gacha_card").fadeIn("slow");
                    $(".gacha_img_container").removeClass("shake_box");
                    window.toggleBtn = true;
                }, 2000);

            })
        };
    });
    
    // 回数表示と確認
    if ($('#gacha_count')[0]) {
        // cookieの存在確認
        $('#gacha_count').text(`あと ${checkCount()} 回`);
    }
});

function checkCount(){
    const ck = $.cookie("gatyacount");
    if(typeof ck === 'undefined'){
        // cookieがない
        return 1;
    }else{
        // cookieがある
        // 現在日時を取得
        const nowTime = new Date();
        const gTime = new Date($.cookie("gatyacount"));
        // 時刻が同じ場合比較処理を行う。
        if(nowTime.getHours() === gTime.getHours()){
            const elapsedTime = Math.abs(gTime - nowTime);
            const mins = elapsedTime / ( 1000 * 60 );
            const count = Math.floor(mins) / 5;
            return Math.floor(count);
        }else{
            return 1;
        }
    }
}