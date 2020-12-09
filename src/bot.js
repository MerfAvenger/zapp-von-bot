const Discord = require('discord.js');
const client = new Discord.Client();

//Internal libraries
const commandParse = require('./input/CommandParse.js');
const auth = require('./util/Auth.js')
const commands = require('../command/index.js');

//Config & secrets
const TOKEN = require('../secret/TOKEN.json');

console.log('Loading bot');

client.on('ready', () => {
    console.log(`Loggined in with client id: ${client.user.tag}`)
});

client.on('warning', (e) => {
    console.warn('WARNING: ' + e.msg);
})

client.on('error', (e) => {
    console.error('ERROR: ' + e.msg);
})

client.on('message', (msg) => {

    const authResult = auth(msg);

    if(!authResult) {
        console.log({authResult});
        return;
    }

    //Detect bot command activation
    if(msg.content[0] ==='>'){
        let userMsg = msg.content;
        userMsg = userMsg.slice(1, msg.content.length);

        const requestedCommand = commandParse(userMsg);
        const commandToExecute = commands[requestedCommand.category][requestedCommand.command];

        commandToExecute(requestedCommand.params);

        console.log({requestedCommand});  
        console.log({commandToExecute});      
    } 
});

client.login(TOKEN.token);