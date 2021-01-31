const Url       = require('../../util/Url');
const Request   = require('../../util/Request')
const Endpoints = require('../../util/Endpoints.json')

module.exports = function(client, message, targetUser) {
    const fullUrl = Url.getUrlWithSearchString(
        Endpoints.API_BASE_URL, 
        Endpoints.USER_ENDPOINT, 
        targetUser
    );

    console.log(fullUrl);

    Request.get(fullUrl, findCallback);
}

const findCallback = function ( pssUserData ) {
    console.log(pssUserData);
}