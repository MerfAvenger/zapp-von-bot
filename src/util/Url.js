const getUrl = function ( baseUrl, path ) {
    return `${baseUrl}${path}`;
}

const getUrlWithSearchString = function ( baseUrl, path, searchString ) {
    return `${baseUrl}${path}${searchString}`;
}

const getPathWithSearchString = function ( path, searchString ) {
    return `${path}${searchString}`;
}

module.exports = {
    getUrl,
    getUrlWithSearchString,
    getPathWithSearchString
}