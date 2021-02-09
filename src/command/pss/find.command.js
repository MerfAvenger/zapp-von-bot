const SavyManager = require('../../savy/SavyManager');

module.exports = function(client, message, targetUser) {
    const savyManager = new SavyManager();
    
    savyManager.getUserFromUsername(targetUser, findCallback);
}

const findCallback = function ( pssUserData ) {
    console.log(pssUserData);
}