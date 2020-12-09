const commands          = {};

commands.pss            = {};

commands.roles          = {};
commands.roles.add      = require('./roles/add.command');
commands.roles.remove   = require('./roles/add.command');

commands.info           = {};
commands.info.rules     = require('./info/rules.command');

module.exports          = commands;