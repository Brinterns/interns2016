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
            letter: 5,
            number: 5
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
    return Object.assign({}, oldData, {
        rounds: {
            letter: options.sliders.letterSlider
        }
    });
}
