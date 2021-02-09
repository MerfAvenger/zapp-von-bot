const Discord = require('discord.js');
const client = new Discord.Client();

//Internal libraries
const auth = require('./util/Auth.js');

const CommandManager = require('./command/CommandManager');
const commands = require('./command');

const commandManager = new CommandManager(client, commands);

//Config & secrets
const TOKEN = require('../secret/TOKEN.json');

console.log('Loading bot');

client.on('ready', () => {
    console.log(`Loggined in with client id: ${client.user.tag}`);
});

client.on('warning', (e) => {
    console.warn('WARNING: ' + e.msg);
})

client.on('error', (e) => {
    console.error('ERROR: ' + e.msg);
})

client.on('message', (msg) => {

    // const authResult = auth(msg);

    // if(!authResult) {
    //     console.log({authResult});
    //     return;
    // }

    //Detect bot command activation
    if(msg.content[0] ==='>'){
        try {
            commandManager.executeCommand( msg );
        } catch ( e ) {
            let errorMessage = "I failed to execute command...\n\t" + e;
            msg.reply( errorMessage );
        }
    } 
});

client.login(TOKEN.token);