const whitelistedUsers = require('../secret/WHITELIST.js');
const blacklistedUsers = require('../secret/BLACKLIST.js');

const config = {
    "whitelist": {
        "roles": [
            "admin"
        ],
        "users": whitelistedUsers
    },
    "blacklist": {
        "users": blacklistedUsers
    },
    "permOrder": [
        "users",
        "roles",
    ],
    "filters": {
        "channels": [
            "#leadership-bot-commands"
        ],
    }
}

module.exports = config;