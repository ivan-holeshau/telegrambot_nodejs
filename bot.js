const Sequelize = require("sequelize");
const Command = require("./bd/model/command");
const Sends = require("./bd/model/sendSaveModel");

const Users = require("./bd/model/usersBotModel");

var TelegramBot = require('node-telegram-bot-api');
const e = require("express");


// var token = '1156140968:AAFfDu7Fki5G4e2lzM6BlfslrJ8TuuIJvTM';
var token = '1162114065:AAHbUKTu1RoduTXejfSjB_YcRFfj7oy2e2w';
var bot = new TelegramBot(token, { polling: true });



async function getCommands() {
    let commandList = await Command.findAll({ raw: true })
    return commandList;

}

async function sendButtonLink(message) {
    // console.log(await finedText('$$site') + " " + await finedText('$$mobile'))
    var options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: await finedText('$mobile'), callback_data: `mobile` }],
                [{ text: await finedText('$site'), callback_data: `site` }],
            ]
        }
    };

    bot.sendMessage(message.chat.id, await finedText('$button'), options);
}

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
    // console.log(callbackQuery.data)
    if (callbackQuery.data == 'mobile') {
        let text = await finedText('$$mobile');
        bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });
        text = await finedText('$$site');
        bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });

    }
    if (callbackQuery.data == 'site') {
        let text = await finedText('$$site');
        bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });
    }
    if (callbackQuery.data == 'soc') {
        let text = await finedText('$soclink');
        bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });
    }
    if (callbackQuery.data == 'dont_know') {
        let text = await finedText('$$site');
        var options = {
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{ text: await finedText('$yestry'), callback_data: `mobile` }],
                    [{ text: await finedText('$notstudi'), callback_data: `site` }],
                ]
            }
        }
        bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });
        text = await finedText('$$mobile');
        bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });

        var options = {
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{ text: await finedText('$yes'), callback_data: `mobile` }],
                    [{ text: await finedText('$no'), callback_data: `all` }],
                ]
            }
        }

        bot.sendMessage(callbackQuery.message.chat.id, await finedText('$youhave'), options);
    }
    if (callbackQuery.data == 'all') {
        let text = await finedText('$all');
        bot.sendMessage(callbackQuery.message.chat.id, text, { disable_web_page_preview: true });
    }
    if (callbackQuery.data == 'know') {

        var options = {
            disable_web_page_preview: true,
            // reply_markup: {
            //     inline_keyboard: [
            //         [{ text: await finedText('$yes'), callback_data: `mobile` }],
            //         [{ text: await finedText('$no'), callback_data: `all` }],
            //     ]
            // }
        }

        // bot.sendMessage(callbackQuery.message.chat.id, await finedText('$youhave'), options);
        bot.sendMessage(callbackQuery.message.chat.id, await finedText('$soclink'), options);
        bot.sendMessage(callbackQuery.message.chat.id, await finedText('$all'), options);
    }
});


async function games(message) {

    //  console.log(await finedText('$$site') + " " + await finedText('$$mobile'))
    var options = {
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{ text: await finedText('$dontknow'), callback_data: `dont_know` }],
                    [{ text: await finedText('$know'), callback_data: `know` }],
                ]
            }
        }
        //console.log(await finedText('$dontknow') + 'commands')
    bot.sendMessage(message.chat.id, await finedText('$knowservice'), options);



}


async function finedText(text) {
    let list_commands = await getCommands();
    let text_answer;
    list_commands.forEach(element => {
        if (element.id == 'nCMcfg')
            text_answer = element.text;
    });

    list_commands.forEach(element => {
        //console.log('commands[]' + element.id)
        if (element.id == text) {
            text_answer = element.text;
        }
    });
    return text_answer;
}


var answerCallbacks = {};


async function addUser(user) {
    // console.log(user.id + " " + user.name + " " + user.phone)
    try {
        await Users.create({
            id: user.id,
            name: user.name,
            phone: user.phone,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            active: 0
        });
    } catch {
        Users.update({ name: user.name, phone: user.phone }, {
            where: {
                id: user.id
            }
        })
    }
}


function checkphone(answer) {

    var phone = answer.text;
    //console.log(phone);
}

let deleteSessions = () => {
    let deleteIndex = [];
    for (let i in answerCallbacks) {
        let date = new Date();
        // console.log(i + ' date ' + answerCallbacks[i].date);
        if ((date - answerCallbacks[i].date) > 120000) {
            deleteIndex.push(i);
        }
    }
    deleteIndex.forEach(index => {
        delete answerCallbacks[index];
    })
}


setInterval(deleteSessions, 60000)

async function tt(message, name) {
    bot.sendMessage(message.chat.id, await finedText('phone')).then(() => {

        let date = new Date().getTime();
        let func = async(answer) => {
            let phone = answer.text;
            //375447284729
            let reg = /^\d{12}$/;
            if ((!reg.test(phone))) {
                tt(message, name)
            } else {
                await addUser({ id: message.chat.id, name: name, phone: phone });
                games(message);
            }
        }
        answerCallbacks[message.chat.id] = { date: date, func: func }
    });
}



bot.onText(/\/start/, async function(message, match) {
    //console.log('2')
    bot.sendMessage(message.chat.id, await finedText('/start')).then(() => {
        let date = new Date().getTime();
        let func = (answer) => {
            var name = answer.text;
            tt(message, name);
        }


        answerCallbacks[message.chat.id] = { date: date, func: func }
        console.log(answerCallbacks[message.chat.id])


    });
});


bot.on('message', async function(message) {
    if (message.text == '/start') {
        delete answerCallbacks[message.chat.id];
    }
    var callback = answerCallbacks[message.chat.id];

    console.log(' calbak' + callback)

    if (callback) {
        delete answerCallbacks[message.chat.id];
        return callback.func(message);

    } else
    if (message.text != '/start') {
        let active = null;
        bot.sendMessage(message.chat.id, await finedText(message.text), { disable_web_page_preview: true });
        active = await Users.findAll({ where: { id: message.chat.id }, raw: true });
        active = active[0].active;
        //console.log(active)
        Users.update({ active: ++active }, {
            where: {
                id: message.chat.id
            }
        })
    }
});


module.exports.bot = bot;