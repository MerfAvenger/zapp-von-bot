const users = require('./secret/WHITELISTED_USERS.js');

const config = {
    "whitelist": {
        "channels": [
            "#leadership-bot-commands"
        ],
        "roles": [
            "admin"
        ],
        "users": users
    },
    "permOrder": [
        "users",
        "roles",
        "channels"
    ]
}

module.exports = config;