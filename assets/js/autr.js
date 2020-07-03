// import * as Cookie from "js-cookie";
// const Cookie = require('js-cookie');

async function aut() {
    let login = document.getElementById('exampleInputEmail1').value;
    let passwd = document.getElementById('exampleInputPassword1').value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "email": login, "password": passwd });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };



    const { token } = await fetch("/token", requestOptions)
        .then(response => response.json());

    //sessionStorage.setItem('Authorization', token.token);
    // Cookie.set('token', token);
    document.cookie = `token=${token}`;
    //document.URL('/index');
    location.replace("/index");
    //    /\ console.log(token.token);



}

function out() {
    document.cookie = `token=000`;
    location.replace("/login");
}