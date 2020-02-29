const TOKEN = require('../secret/TOKEN.json');
const Discord = require('discord.js');
const client = new Discord.Client();

console.log('Loading bot');

client.on('ready', () => {
    console.log(`Loggined in with client id: ${client.user.tag}`)
});

client.on('warning', (e) => {
    console.error('WARNING: ', e.msg)
})

client.on('error', (e) => {
    console.error('ERROR: ', e.msg)
})

client.on('message', (msg) => {
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
});

client.login(TOKEN.token);