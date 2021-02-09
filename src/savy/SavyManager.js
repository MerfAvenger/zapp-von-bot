const PSSEndpointHelper    = require('./PSSEndpointHelper');
const Device                = require('./Device');
const Request               = require('../util/Request');

const SavyManager = function () {
    this.deviceKey = null;
};

SavyManager.prototype.constructor = SavyManager;

SavyManager.prototype.init = function ( ) {
    this.deviceKey = Device.generateDeviceKey();
}

//You will need to bind the callback to your command scope in order to grab the data from the request
SavyManager.prototype.getUserFromUsername = function ( username, callback ) {
    const url = PSSEndpointHelper.getPlayerURL( username );

    Request.get(url, callback);
}

module.exports = SavyManager;