const config = require('../../config.js')

const auth = function( msg ) {
    let authResult = false;

    if(hasWhitelistedRole(msg)) {
        authResult = true;
    }

    if(isWhitelistedUser(msg)) {
        authResult = true;
    }

    return authResult;
}

const isWhitelistedUser = function(msg) {
    let authResult = false;

    config.whitelist.users.forEach((user) => {

        if( msg.author.tag === user){
            authResult = true;
        }
    });

    return authResult
}

const hasWhitelistedRole = function(msg) {
    let authResult = false;

    config.whitelist.roles.forEach((role) => {
        if(msg.guild.roles.find("name", role)){
            authResult = true;
        }
    });

    return authResult;
}

module.exports = auth;