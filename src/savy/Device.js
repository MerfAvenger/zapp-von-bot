const savyDeviceKeyPrefix = '26ae';

const getDeviceKey = function () {
    return this.deviceKey && !this.deviceKey.isEmpty() ? this.deviceKey : generateDeviceKey();
}

const generateDeviceKey = function () {
    const selectableCharacters = "0123456789abcdef";

    return savyDeviceKeyPrefix + generateStringFromCharacters(selectableCharacters, 8)
}

const generateStringFromCharacters = function(characters, length) {
    let returnString = "";
    
    for ( let i = 0; i <= length; i++) {
        const randomCharacter = characters.charAt(Math.random(characters.length))
        returnString += randomCharacter;
    }

    return returnString;
}

module.exports = {
    getDeviceKey,
    generateDeviceKey
};