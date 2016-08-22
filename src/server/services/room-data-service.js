var numbersRound = require('../numbers-round/numbers-round');

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
            largeNumberList: numbersRound.largeNumberList(),
            smallNumberList: numbersRound.smallNumberList(),
            large: 0,
            small: 0,
            disableLarge: false,
            disableSmall: false
        },
        possibleAnswers: {},
        finalAnswerList: {}
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
            largeNumberList: numbersRound.largeNumberList(),
            smallNumberList: numbersRound.smallNumberList(),
            large: 0,
            small: 0,
            disableLarge: false,
            disableSmall: false
        },
        possibleAnswers: {},
        finalAnswerList: {}
    });
}

function setRounds(oldData, options) {
    var roundList = [];
    for(var i=0; i<options.rounds.letter; i++) {
        roundList.push('L');
    }

    for(var i=0; i<options.rounds.number; i++) {
        roundList.push('N');
    }


    return roundList;
}

module.exports = {
    initialRoomData,
    newRoundData,
    setRounds
}
