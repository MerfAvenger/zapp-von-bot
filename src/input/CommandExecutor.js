const commandConfig = require("../../config/commands.json");

const info = require("../../command/info.command.js");
const roles = require("../../command/roles.command.js");
const pss = require("../../command/pss.command.js");

const run = function(commandArray) {
    for(let key in commandConfig) {
        if(key === commandArray[0]) {
            
        }
    }
}

module.exports = run;