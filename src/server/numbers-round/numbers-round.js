module.exports =  {
    getRandomNumber,
    generateRandomNumber
}

function getRandomNumber(arg, user) {
    var room = user.getRoom();
    var randomNumber = generateRandomNumber(1, 1000);
    room.messageMembers('setRandomNumber', randomNumber);
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
