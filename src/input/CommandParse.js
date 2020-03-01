const parse = function (command) {
    let commandAcc = [];
    let charAcc = '';
    let counter = 0;

    Array.from(command).forEach((char) => {
        if (char === ' ' && charAcc.length > 0) {
            commandAcc.push(charAcc.toLowerCase());
            charAcc = '';
        } else if (counter === (command.length - 1)) {
            charAcc += char;
            commandAcc.push(charAcc.toLowerCase());
            charAcc = '';
        } else {
            charAcc += char;
        }

        counter++;
    })

    return commandAcc;
}

module.exports = parse;