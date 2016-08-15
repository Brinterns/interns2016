module.exports = {
	initialRoomData,
	newRoundData,
    setRounds
}

function initialRoomData(user) {
    return {
        creator: {
            id: user.id,
            name: user.name
        },
        userIdList: [],
        rounds: {
            letter: 5
        },
        started: false,
        answering: false,
        submitting: false,
        scores: [],
        letterList: {
            letters: [],
            consonantNum: 0,
            vowelNum: 0,
            disableConsonant: false,
            disableVowel: false
        },
        possibleAnswers: {},
        finalAnswerList: {}
    }
}

function newRoundData(oldData) {
    return Object.assign({}, oldData, {
        rounds: {
            letter: oldData.rounds.letter - 1
        },
        answering: false,
        submitting: false,
        roundEnded: false,
        letterList: {
            letters: [],
            consonantNum: 0,
            vowelNum: 0,
            disableConsonant: false,
            disableVowel: false
        },
        possibleAnswers: {},
        finalAnswerList: {}
    });
}

function setRounds(oldData, options) {
    return ({letter: options.rounds.letter});
}
