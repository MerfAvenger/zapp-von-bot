//Read user input and assemble an object to hold each section of the user's request
const parse = function ( userMessage ) {
    const trimmedMessage = userMessage.trim();
    const messageSegments = trimmedMessage.split( ' ' );

    const category = messageSegments[0];
    const command = messageSegments[1];
    const params = parseParameters( messageSegments );

    return {
        category,
        command,
        params
    }
}

//Seperate parameters with minor processing to assemble quoted sections into a single parameter
const parseParameters = function ( messageSegments ) {
    const parameters = [];
    const numSegments = messageSegments.length;

    for ( let i = 2; i < numSegments; i++ ) {
        const currentSegment = messageSegments[i];
        const nextSegment = messageSegments[i + 1];
        
        let finalSegment = "";

        if ( currentSegment[0] === '"' || currentSegment[0] === '\'' ) {
            if ( nextSegment && nextSegment[nextSegment.length - 1] ===  '"' || nextSegment[nextSegment.length - 1] === '\'') {
                i += 1;
                finalSegment = concatonateQuotedSegments ( currentSegment, nextSegment );
            } else {
                throw new Error('I couldn\'t find an end to the quoted parameter...');
            }
        } else {
            finalSegment = messageSegments[i];
        }

        parameters.push( finalSegment );
    }

    return parameters;
}

const concatonateQuotedSegments = function ( firstSegment, secondSegment ) {
    return firstSegment.slice( 1, firstSegment.length ) + ' ' + secondSegment.slice( 0, secondSegment.length - 1 );    
}

module.exports = parse;