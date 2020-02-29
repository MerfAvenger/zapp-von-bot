const parse = function (command) {
    let commandAcc = [];
    let charAcc = '';
    let counter = 0;

    console.log(Array.from(command))

    Array.from(command).forEach((char) => {
        console.log(counter + ' ' + (command.length - 1))

        if (char === ' ' && charAcc.length > 0) {
            console.log('Pushing segment');
            commandAcc.push(charAcc);
            charAcc = '';
        } else if (counter === (command.length - 1)) {
            console.log('Pushing final');
            charAcc += char;
            commandAcc.push(charAcc);
            charAcc = '';
        } else {
            console.log('Adding char');
            charAcc += char;
        }

        counter++;
    })

    console.log(commandAcc);
    return commandAcc;
}

module.exports = parse;