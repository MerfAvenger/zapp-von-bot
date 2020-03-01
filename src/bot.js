const Discord = require('discord.js');
const client = new Discord.Client();

//Internal libraries
const commandParse = require('./input/CommandParse.js');
const execute = require('./input/CommandExecutor.js')
const auth = require('./util/Auth.js')

//Config & secrets
const TOKEN = require('../secret/TOKEN.json');

console.log('Loading bot');

client.on('ready', () => {
    console.log(`Loggined in with client id: ${client.user.tag}`)
});

client.on('warning', (e) => {
    console.error('WARNING: ' + e.msg);
})

client.on('error', (e) => {
    console.error('ERROR: ' + e.msg);
})

client.on('message', (msg) => {

    const authResult = auth(msg);

    if(!authResult) {
        console.log(authResult);
        return;
    }

    //Detect bot command activation
    if(msg.content[0] ==='>'){
        let userMsg = msg.content;
        userMsg = userMsg.slice(1, msg.content.length);

        try {
            let commandParams = commandParse(userMsg);

            execute(commandParams);
        } catch(e) {
            msg.reply('Encountered error: ' + e + '\n\n Command parse = ' + commandParse.toString());
        }
    } else {
        //Specific commands
        switch(msg.content) {
            case 'ping':
                msg.reply('pong');
        }
    }

});

client.login(TOKEN.token);