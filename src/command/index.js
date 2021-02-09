//Create a JSON which has all of our commands stored on it and export it
const commands          = {};

commands.pss            = {};

commands.roles          = {};
commands.roles.add      = require('./roles/add.command');
commands.roles.remove   = require('./roles/remove.command');

commands.info           = {};
commands.info.rules     = require('./info/rules.command');

commands.pss.find       = require('./pss/find.command')

module.exports          = commands;