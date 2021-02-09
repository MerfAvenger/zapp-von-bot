const PSSEndpoints  = require('./PSSEndpoints.json');
const URL           = require('../util/Url');

const getPlayerURL = function ( player ) {
    return URL.getUrlWithSearchString(
        PSSEndpoints.API_BASE_URL,
        PSSEndpoints.USER_URI,
        player
    );
};

const getAllianceURL = function ( fleetName, deviceToken ) {
    const alliancePath = `${PSSEndpoints.ALLIANCE_SEARCH_URI}${deviceToken}${PSSEndpoints.ALLIANCE_PAGINATION_URI}`;

    return URL.getUrlWithSearchString( 
        PSSEndpoints.API_BASE_URL, 
        alliancePath,
        fleetName
    );
}

module.exports = {
    getPlayerURL,
    getAllianceURL
};