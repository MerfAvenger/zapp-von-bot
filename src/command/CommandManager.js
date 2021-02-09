const commandParse = require('./CommandParse');

const CommandManager = function ( discordClient, commands ) {
    this.client      = discordClient;
    this.commands    = commands;
}

CommandManager.prototype.executeCommand = function ( message ) {
    userMessage = message.content.slice( 1, message.content.length );

    const requestedCommand = commandParse( userMessage );
    const commandToExecute = this.commands[requestedCommand.category][requestedCommand.command];

    commandToExecute( this.client, message, requestedCommand.params );

    console.log({requestedCommand});  
    console.log({commandToExecute});
}

module.exports = CommandManager;