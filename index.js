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
const bot = require("./bot");
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

app.get("/index", function(req, res) {

    console.log(auth.authenticate);
    res.render('index', { mas: [1, 2, 3], id: 2 });
}, function(req, res) {
    res.send('error');
});

app.get("/send", function(req, res) {

    console.log(auth.authenticate);
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




/////////////////  bot



// var TelegramBot = require('node-telegram-bot-api');
// const e = require("express");


// // var token = '1156140968:AAFfDu7Fki5G4e2lzM6BlfslrJ8TuuIJvTM';
// var token = '1162114065:AAHbUKTu1RoduTXejfSjB_YcRFfj7oy2e2w';
// var bot = new TelegramBot(token, { polling: true });



// async function getCommands() {
//     let commandList = await Command.findAll({ raw: true })
//     return commandList;

// }

// async function sendButtonLink(message) {
//     console.log(await finedText('$$site') + " " + await finedText('$$mobile'))
//     var options = {
//         reply_markup: {
//             inline_keyboard: [
//                 [{ text: await finedText('$mobile'), callback_data: `mobile` }],
//                 [{ text: await finedText('$site'), callback_data: `site` }],
//             ]
//         }
//     };

//     bot.sendMessage(message.chat.id, await finedText('$button'), options);
// }

// bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
//     console.log(callbackQuery.data)
//     if (callbackQuery.data == 'mobile') {
//         let text = await finedText('$$mobile');
//         bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });
//         text = await finedText('$$site');
//         bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });

//     }
//     if (callbackQuery.data == 'site') {
//         let text = await finedText('$$site');
//         bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });
//     }
//     if (callbackQuery.data == 'soc') {
//         let text = await finedText('$soclink');
//         bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });
//     }
//     if (callbackQuery.data == 'dont_know') {
//         let text = await finedText('$$site');
//         var options = {
//             disable_web_page_preview: true,
//             reply_markup: {
//                 inline_keyboard: [
//                     [{ text: await finedText('$yestry'), callback_data: `mobile` }],
//                     [{ text: await finedText('$notstudi'), callback_data: `site` }],
//                 ]
//             }
//         }
//         bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: false });
//         text = await finedText('$$mobile');
//         bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: false });

//         var options = {
//             disable_web_page_preview: false,
//             reply_markup: {
//                 inline_keyboard: [
//                     [{ text: await finedText('$yes'), callback_data: `mobile` }],
//                     [{ text: await finedText('$no'), callback_data: `all` }],
//                 ]
//             }
//         }

//         bot.sendMessage(callbackQuery.message.chat.id, await finedText('$youhave'), options);
//     }
//     if (callbackQuery.data == 'all') {
//         let text = await finedText('$all');
//         bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });
//     }
//     if (callbackQuery.data == 'know') {

//         var options = {
//             disable_web_page_preview: false,
//             // reply_markup: {
//             //     inline_keyboard: [
//             //         [{ text: await finedText('$yes'), callback_data: `mobile` }],
//             //         [{ text: await finedText('$no'), callback_data: `all` }],
//             //     ]
//             // }
//         }

//         // bot.sendMessage(callbackQuery.message.chat.id, await finedText('$youhave'), options);
//         bot.sendMessage(callbackQuery.message.chat.id, await finedText('$soclink'), options);
//     }
// });


// async function games(message) {

//     //  console.log(await finedText('$$site') + " " + await finedText('$$mobile'))
//     var options = {
//         disable_web_page_preview: true,
//         reply_markup: {
//             inline_keyboard: [
//                 [{ text: await finedText('$dontknow'), callback_data: `dont_know` }],
//                 [{ text: await finedText('$know'), callback_data: `know` }],
//             ]
//         }
//     }
//     console.log(await finedText('$dontknow') + 'commands')
//     bot.sendMessage(message.chat.id, await finedText('$knowservice'), options);



// }


// async function finedText(text) {
//     let list_commands = await getCommands();
//     let text_answer;
//     list_commands.forEach(element => {
//         if (element.id == 'nCMcfg')
//             text_answer = element.text;
//     });

//     list_commands.forEach(element => {
//         console.log('commands[]' + element.id)
//         if (element.id == text) {
//             text_answer = element.text;
//         }
//     });
//     return text_answer;
// }


// var answerCallbacks = {};


// async function addUser(user) {
//     console.log(user.id + " " + user.name + " " + user.phone)
//     try {
//         await Users.create({
//             id: user.id,
//             name: user.name,
//             phone: user.phone,
//             date: new Date().toISOString().slice(0, 19).replace('T', ' ')
//         });
//     } catch {
//         Users.update({ name: user.name, phone: user.phone }, {
//             where: {
//                 id: user.id
//             }
//         })
//     }
// }


// function checkphone(answer) {

//     var phone = answer.text;
//     console.log(phone)

// }


// async function tt(message, name) {
//     bot.sendMessage(message.chat.id, await finedText('phone')).then(() => {
//         answerCallbacks[message.chat.id] = async(answer) => {
//             let phone = answer.text;
//             //375447284729
//             let reg = /^\d{12}$/;
//             if ((!reg.test(phone))) {
//                 tt(message, name)
//             } else {
//                 await addUser({ id: message.chat.id, name: name, phone: phone });
//                 // bot.sendMessage(message.chat.id, name + phone + " saved!");
//                 //sendButtonLink(message);
//                 games(message);
//             }
//         }
//     });
// }



// bot.onText(/start/, async function(message, match) {
//     console.log('2')
//     bot.sendMessage(message.chat.id, await finedText('/start')).then(() => {
//         answerCallbacks[message.chat.id] = (answer) => {
//             var name = answer.text;
//             tt(message, name);
//         }
//     });
// });


// bot.on('message', async function(message) {
//     console.log(`message = ${message.text}`)
//     var callback = answerCallbacks[message.chat.id];
//     console.log(`message=` + message.chat.id)
//     console.log(callback)
//     console.log(answerCallbacks)
//     if (callback) {
//         delete answerCallbacks[message.chat.id];
//         return callback(message);

//     } else
//     if (message.text != '/start') {
//         let active = null;
//         bot.sendMessage(message.chat.id, await finedText(message.text), { disable_web_page_preview: true });
//         active = await Users.findAll({ where: { id: message.chat.id }, raw: true });
//         active = active[0].active;
//         console.log(active)
//         Users.update({ active: ++active }, {
//             where: {
//                 id: message.chat.id
//             }
//         })




//     }

// });


// async function sendMessages(text) {

//     Users.findAll({ raw: true })
//         .then(user => {
//             console.log(user.forEach(element => {
//                 try {
//                     bot.sendMessage(element.id, text);
//                 } catch {}

//             }))

//         })
// }

// async function sendMessagesUsers(arr, text) {

//     arr.forEach(item => {
//         bot.sendMessage(item, text);
//     })






// }



module.exports = app;