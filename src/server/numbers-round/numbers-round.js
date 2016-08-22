var shuffle = require('./shuffle');

function getRandomNumber(room) {
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

function getLarge(arg, user) {
    var room = user.getRoom();
    if(!room.data.numbersRound.disableLarge) {
        var num = room.data.numbersRound.largeNumberList.shift();
        room.messageMembers('updateLarge', num);
        room.data.numbersRound.numbers.push(num);
        room.data.numbersRound.large++;
        checkNumbersLeft(room.data.numbersRound, room);
    }
}

function getSmall(arg, user) {
    var room = user.getRoom();
    if(!room.data.numbersRound.disableSmall) {
        var num = room.data.numbersRound.smallNumberList.shift();
        room.messageMembers('updateSmall', num);
        room.data.numbersRound.numbers.push(num);
        room.data.numbersRound.small++;
        checkNumbersLeft(room.data.numbersRound, room);
    }
}

function checkNumbersLeft(numbersRound, room) {
    if(numbersRound.large >= 4){
        numbersRound.disableLarge = true;
        room.messageMembers('disableLarge');
    }
    if(numbersRound.large + numbersRound.small === 6) {
        numbersRound.disableLarge = true;
        numbersRound.disableSmall = true;
        room.messageMembers('disableSmall');
        room.messageMembers('disableLarge');
        getRandomNumber(room);
    }
}

module.exports =  {
    generateRandomNumber,
    getRandomNumber,
    smallNumberList,
    largeNumberList,
    getLarge,
    getSmall
}
