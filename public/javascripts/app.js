$(document).ready(function(){
    console.log($('input[name="doLogin"]'));
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
    $('#doLoadCard').on('click', function(){
        alert("ok");
    });
});