const Discord = require('discord.js');

module.exports = function(client, message, params) {
    message.reply('No.');
    console.log('Exectuted with params: ' + params.toString());
}