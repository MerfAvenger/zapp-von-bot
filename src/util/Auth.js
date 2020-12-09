const config = require('../../config/config.js')

const auth = function( msg ) {
    const author = msg.author.tag;

    if(isBlacklistedUser( author )) {
        return false;
    }

    if(hasWhitelistedRole( msg ) || isWhitelistedUser( author )) {
        return true;
    }
}

const isBlacklistedUser = function( author ) {
    let authResult;

    config.blacklist.users.forEach( ( user ) => {
        if( author === user ){
            authResult = true;
        }
    });

    return authResult
}

const isWhitelistedUser = function( author ) {
    let authResult = false;

    config.whitelist.users.forEach( ( user ) => {
        if( author === user){
            authResult = true;
        }
    });

    return authResult
}

const hasWhitelistedRole = function( msg ) {
    let authResult = false;

    config.whitelist.roles.forEach((role) => {
        if(msg.guild.roles.find("name", role)){
            authResult = true;
        }
    });

    return authResult;
}

module.exports = auth;