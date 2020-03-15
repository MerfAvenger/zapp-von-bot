const parse = function (command) {
    let commandAcc = [];
    let charAcc = '';
    let counter = 0;

    Array.from(command).forEach((char) => {
        if (char === ' ' && charAcc.length > 0) {
            
            if(commandAcc.length < 1) {
                commandAcc.push(charAcc.toLowerCase());
            } else {
                commandAcc.push(charAcc);
            }

            charAcc = '';
        } else if (counter === (command.length - 1)) {
            charAcc += char;

            //If this is the first two sections of the command we dont care about case
            //For parameters we care about casing as they are names and roles
            if(commandAcc.length < 1) {
                commandAcc.push(charAcc.toLowerCase());
            } else {
                commandAcc.push(charAcc);
            }

            charAcc = '';
        } else {
            charAcc += char;
        }

        counter++;
    })

    return commandAcc;
}

module.exports = parse;