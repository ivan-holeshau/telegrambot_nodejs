// index.js
var express = require("express");
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
var jwt = require("jwt-simple");
var auth = require("./auth.js")();
var users = require("./users.js");
var cfg = require("./config.js");
var app = express();
const mysql = require("mysql2");
const Sequelize = require("sequelize");
const Command = require("./bd/model/command");
const Sends = require("./bd/model/sendSaveModel");
const Bot = require("./bot");
const Users = require("./bd/model/usersBotModel");
const { response } = require("express");
const util = require("./bd/util");
const { default: to } = require("await-to-js");

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(auth.initialize());
app.use('/assets', express.static('assets'));

app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json())


app.use(cookieParser())


app.get("/", auth.authenticate(), function(req, res) {
    res.render('index', { mas: [1, 2, 3], id: 2 });
});



app.get("/login", function(req, res) {

    res.render('login', { mas: [1, 2, 3], id: 2 });
    // res.render('login', { mas: [1, 2, 3], id: 2 });

});

app.get("/index", auth.authenticate(), function(req, res) {

    // console.log(auth.authenticate);
    res.render('index', { mas: [1, 2, 3], id: 2 });
}, function(req, res) {
    res.send('error');
});

app.get("/send", auth.authenticate(), function(req, res) {

    // console.log(auth.authenticate);
    res.render('send', { mas: [1, 2, 3], id: 2 });
}, function(req, res) {
    res.send('error');
});


app.get("/usersActive", auth.authenticate(), function(req, res) {


    res.render('usersActive', { mas: [1, 2, 3], id: 2 });
}, function(req, res) {
    res.send('error');
});



app.post("/token", function(req, res) {

    console.log('token')
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        var user = users.find(function(u) {
            return u.email === email && u.password === password;
        });
        //console.log(`user id = ${user.id}`)
        if (user) {
            var payload = {
                id: user.id,
                email: user.email
            };
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.json({
                token: token
            });

        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});


function add(req, res) {
    //console.log(util.countCommands(req.body.command) + 'size')
    Command.findAll({ where: { id: req.body.command }, raw: true })
        .then(users => {
            //  console.log(users.length);
            if (users.length > 0) {
                res.json({
                    id: 'error'
                });
            } else {

                Command.create({
                    id: req.body.command,
                    text: req.body.text
                }).then(response => {
                    res.json({
                        id: req.body.command
                    });
                }).catch(err => {

                    res.json({
                        id: 'error'
                    });
                });

            }

        }).catch(err => console.log(err));

}


function addSend(req, res) {

    console.log(req.body)
    Sends.create({
        text: req.body.text,
        date: req.body.date
    }).then(response => {
        console.log('response = ' + response.id)
        res.json({
            id: response.id
        });
    }).catch(err => {
        console.log(err);
        res.json({
            id: 'error'
        });
    });



    sendMessageBot(req.body.text);

}

async function sendMessageBot(text) {
    await sendMessages(text);
}


function del(req, res, id) {
    console.log(id + 'del')
    Command.destroy({
        where: {
            id: id
        }
    }).then((response) => {
        res.json({
            id: id
        });
    });
};


function update(req, res, command, text) {
    console.log(command + " *" + text + "11")
    Command.update({ id: command, text: text }, {
        where: {
            id: command
        }
    }).then((response) => {
        res.json({
            id: text
        });
    }).catch((err) =>
        res.json({
            id: 'error'
        }));
};

async function sendMessages(text) {
    Users.findAll({ raw: true })
        .then(user => {
            user.forEach(element => {
                try {
                    Bot.bot.sendMessage(element.id, text);
                } catch {}

            })
        })
}

async function sendMessagesUsers(arr, text) {
    arr.forEach(item => {
        Bot.bot.sendMessage(item, text);
    })
}




app.post("/commands", function(req, res) {

    let id = req.body.command;
    const object = eval(req.body);
    console.log(object.command + " texxt")
    if (req.body.type == 'addCommand') {
        add(req, res);
    };
    if (req.body.type == 'addSend') {
        addSend(req, res);
    };
    if (req.body.type == 'deleteCommand') {
        del(req, res, object.command)
    }
    if (req.body.type == 'updateCommand') {
        update(req, res, object.command, object.text);
    }

    if (req.body.type == 'getAll') {
        Command.findAll({ raw: true })
            .then(users => {
                //console.log(users);
                let rezult = JSON.stringify(users);
                //console.log(rezult);
                res.json({
                    all: rezult
                });
            });
    }

    if (req.body.type == 'sendUsers') {
        console.log(req.body)
        sendMessagesUsers(req.body.users, req.body.text)
        res.json({
            status: 'ok'
        });
    }

    if (req.body.type == 'getUsers') {

        Users.findAll({
                order: [
                    ['active', 'DESC']
                ]
            }, { raw: true })
            .then(users => {
                //console.log(users);

                let rezult = JSON.stringify(users);
                //console.log(rezult);
                res.json({
                    all: rezult
                });
            });

    }

    if (req.body.type == 'getAllSend') {
        Sends.findAll({ raw: true })
            .then(sends => {

                let rezult = JSON.stringify(sends);
                //console.log(rezult);
                res.json({
                    all: rezult
                });
            });
    }
    console.log(req.body.command + '/' + req.body.text)
        // if (req.body.email && req.body.password) {}
});


app.listen(80, function() {
    console.log("My API is running...");
});
app.use(function(req, res, next) {
    res.status(404).render('error-404');
});


module.exports = app;