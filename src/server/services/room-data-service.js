var shuffle = require('../numbers-round/shuffle');
var _  = require('underscore');
var conundrumList = require('../conundrum-round/conundrum-list');

function initialRoomData(user) {
    return {
        creator: {
            id: user.id,
            name: user.name
        },
        userIdList: [],
        rounds: [],
        started: false,
        answering: false,
        submitting: false,
        scores: [],
        lettersRound: {
            letters: [],
            consonantNum: 0,
            vowelNum: 0,
            disableConsonant: false,
            disableVowel: false
        },
        numbersRound: {
            numbers: [],
            largeNumberList: largeNumberList(),
            smallNumberList: smallNumberList(),
            large: 0,
            small: 0,
            disableLarge: false,
            disableSmall: false
        },
        conundrumRound: {
            solution: null,
            anagram:  null
        },
        possibleAnswers: {},
        finalAnswerList: {},
        conundrums: []
    }
}

function newRoundData(oldData) {
    return Object.assign({}, oldData, {
        answering: false,
        submitting: false,
        roundEnded: false,
        lettersRound: {
            letters: [],
            consonantNum: 0,
            vowelNum: 0,
            disableConsonant: false,
            disableVowel: false
        },
        numbersRound: {
            numbers: [],
            largeNumberList: largeNumberList(),
            smallNumberList: smallNumberList(),
            large: 0,
            small: 0,
            disableLarge: false,
            disableSmall: false
        },
        conundrumRound: {
            solution: null,
            anagram:  null
        },
        possibleAnswers: {},
        finalAnswerList: {}
    });
}

function setRounds(oldData, options) {
    var conundrums = Array.from(conundrumList);
    var roundList = [];
    for(var i=0; i<options.rounds.letter; i++) {
        roundList.push('L');
    }

    for(var i=0; i<options.rounds.number; i++) {
        roundList.push('N');
    }

    for(var i=0; i<options.rounds.conundrum - 1; i++) {
        var index = Math.floor(Math.random() * (conundrums.length - 0));
        oldData.conundrums.push(conundrums.splice(index, 1)[0]);
        roundList.push('C');
    }

    shuffle(roundList);

    var index = Math.floor(Math.random() * (conundrums.length - 0));
    oldData.conundrums.push(conundrums.splice(index, 1)[0]);
    roundList.push('C');

    return roundList;
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

module.exports = {
    initialRoomData,
    newRoundData,
    setRounds
}
