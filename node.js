const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    flash = require('connect-flash')
const fs = require('fs');
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const host = '127.0.0.1'
const port = 3000

function checkAuth() {
    return app.use((req, res, next) => {
        if (req.user) next()
        else res.redirect('/login')
    })
}

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
    // app.use(session({ secret: 'my-test-key' }))
app.use(flash())


app.get('/login', (req, res) => {
    //res.send('Login page. Please, authorize.')
    res.render('login', { mas: [1, 2, 3], id: 2 });
})


app.listen(port, host, function() {
    console.log(`Server listens http://${host}:${port}`)
})









// let fs = require('fs');

// var express = require('express');
// const passport = require('passport')
// const session = require('express-session')
// const RedisStore = require('connect-redis')(session)
// let app = express();


// app.use(passport.initialize());
// app.set('view engine', 'ejs');
// app.use('/public', express.static('public'));
// app.use(passport.session())
// app.get('/', function(req, res) {
//     //    res.send('ff');
//     // res.sendFile(__dirname + '/index.html');
//     res.render('index', { mas: [1, 2, 3], id: 2 })
// });


// app.listen(3000);



// let http = require('http');
// let server = http.createServer(function(req, res) {
//     // res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
//     // let readShort = fs.createReadStream(__dirname + '/index.html', 'utf8');
//     // readShort.pipe(res)
//     //res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); //
//     if (req.url === '/index' || req.url === "/") {
//         res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
//         let readShort = fs.createReadStream(__dirname + '/index.html', 'utf8').pipe(res);
//     } else {
//         res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
//         let readShort = fs.createReadStream(__dirname + '/404.html', 'utf8').pipe(res);
//     }


// });

// server.listen(3000, '127.0.0.1');
// console.log("we event port 3000");