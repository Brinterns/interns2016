var shuffle = require('./shuffle');

module.exports =  {
    getRandomNumber,
    generateRandomNumber,
    smallNumberList,
    largeNumberList
}

function getRandomNumber(arg, user) {
    var room = user.getRoom();
    var randomNumber = generateRandomNumber(1, 1000);
    room.messageMembers('setRandomNumber', randomNumber);
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function largeNumberList() {
    var largeNumberList = [25, 50, 75, 100];
    largeNumberList = shuffle(largeNumberList);
    return largeNumberList;
}

function smallNumberList() {
    var smallNumberList = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];
    smallNumberList = shuffle(smallNumberList);
    return smallNumberList;
}
