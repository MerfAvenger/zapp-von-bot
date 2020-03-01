const fs = require('fs');

//Command structure/parameter config
const commandConfig = require("../../config/commands.json");

const run = function(commandArray, client, message) {
    isValid(commandArray);

    const params = [];

    for(let i = 2; i < commandArray.length; i++) {
        params.push(commandArray[i]);
    }

    const commandFn = load(commandArray[0], commandArray[1]);

    if(commandConfig[commandArray[0]].options[commandArray[1]].discord) {
        console.log(message);
        callCommandWith(commandFn, params, client, message);
    } else {
        callCommandWith(commandFn, params);
    }
}

const isValid = function(commandArray) {
    if(!isValidCommand(commandArray[0])) {
        throw Error('Bot received invalid command: ' + commandArray[0].toString());
    }

    if(!isValidOption(commandArray[0], commandArray[1])) {
        throw Error('Bot received invalid parameter: ' + commandArray[1].toString());
    }
}

const callCommandWith = function(commandFn, params, client = null, message = null) {
    if(client) {
        commandFn(client, message, params);
    } else {
        commandFn(params);
    }
}

const isValidCommand = function(command) {
    for(let key in commandConfig) {
        if(key === command) {
            return true;
        }
    }
}

const isValidOption = function(command, option) {
    for(let key in commandConfig[command].options) {
        if(key === option) {
            return true;
        }
    }
}

const load = function(command, option) {
    let rtnFn = function() {};

    let commandFilePath = './command/' + command + "/" + option + ".command.js";
    console.log(process.cwd());

    console.log(commandFilePath);

    const commandText = fs.readFileSync(commandFilePath, 'utf8');
    rtnFn = eval(commandText);

    return rtnFn;
}

module.exports = run;