const parse = function ( userMessage ) {
    const trimmedMessage = userMessage.trim();
    const messageSegments = trimmedMessage.split(' ');

    const category = messageSegments[0];
    const command = messageSegments[1];
    const params = [];

    const numSegments = messageSegments.length;

    for ( let i = 2; i < numSegments; i++ ) {
        params.push( messageSegments[i] );
    }

    return {
        category,
        command,
        params
    }
}

module.exports = parse;