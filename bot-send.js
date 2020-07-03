const Users = require("./bd/model/usersBotModel");
const Command = require("./bd/model/command");
const Sends = require("./bd/model/sendSaveModel");
var TelegramBot = require('node-telegram-bot-api');
const commands = require("./bd/model/command");
const e = require("express");
const users = require("./bd/model/usersBotModel");

var token = '1162114065:AAHbUKTu1RoduTXejfSjB_YcRFfj7oy2e2w';
var bot = new TelegramBot(token, { polling: true });

async function getCommands() {
    let commandList = await Command.findAll({ raw: true })
    return commandList;

}

async function sendButtonLink(message) {
    console.log(await finedText('$$site') + " " + await finedText('$$mobile'))
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
    console.log(callbackQuery.data)
    if (callbackQuery.data == 'mobile') {
        let text = await finedText('$$mobile');
        bot.sendMessage(callbackQuery.message.chat.id, text);
    }
    if (callbackQuery.data == 'site') {
        let text = await finedText('$$site');
        bot.sendMessage(callbackQuery.message.chat.id, text);
    }
});



async function finedText(text) {
    let list_commands = await getCommands();
    let text_answer;
    list_commands.forEach(element => {
        if (element.id == 'nCMcfg')
            text_answer = element.text;
    });

    list_commands.forEach(element => {
        if (element.id == text) {
            text_answer = element.text;
        }
    });
    return text_answer;
}


var answerCallbacks = {};


async function addUser(user) {
    console.log(user.id + " " + user.name + " " + user.phone)
    try {
        await Users.create({
            id: user.id,
            name: user.name,
            phone: user.phone,
            date: new Date().toISOString().slice(0, 19).replace('T', ' ')
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
    console.log(phone)

}


async function tt(message, name) {
    bot.sendMessage(message.chat.id, await finedText('phone')).then(() => {
        answerCallbacks[message.chat.id] = async(answer) => {
            let phone = answer.text;
            if (phone > 5) {
                tt(message, name)
            } else {
                await addUser({ id: message.chat.id, name: name, phone: phone });
                // bot.sendMessage(message.chat.id, name + phone + " saved!");
                sendButtonLink(message);
            }
        }
    });
}

bot.onText(/start/, async function(message, match) {
    console.log('2')
    answerCallbacks[message.chat.id] = bot.sendMessage(message.chat.id, await finedText('/start')).then(() => {
        answerCallbacks[message.chat.id] = (answer) => {
            var name = answer.text;
            tt(message, name)
        }
    });
});


bot.on('message', async function(message) {
    console.log('23')
    var callback = answerCallbacks[message.chat.id];
    console.log(`message=` + message.chat.id)
    console.log(callback)
    console.log(answerCallbacks)
    if (callback) {
        delete answerCallbacks[message.chat.id];
        return callback(message);

    } else
    if (message.text != '/start')
        bot.sendMessage(message.chat.id, await finedText(message.text));

});


async function sendMessages() {

    Users.findAll({ raw: true })
        .then(user => {
            console.log(user.forEach(element => {
                bot.sendMessage(element.id, text);

            }))

        })


}