module.exports = {
	initialRoomData,
	newRoundData
}

function initialRoomData(user) {
	return {
		creator: {
			id: user.id,
			name: user.name
		},
	    userIdList: [],
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
	Object.assign(oldData,{
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
	return oldData;
}
