export const START_GAME = 'START_GAME';
export const LEAVE_GAME = 'LEAVE_GAME';
export const SET_LEADER = 'SET_LEADER';
export const GET_CONSONANT = 'GET_CONSONANT';
export const GET_VOWEL = 'GET_VOWEL';
export const DISABLE_CONSONANT = 'DISABLE_CONSONANT';
export const DISABLE_VOWEL = 'DISABLE_VOWEL';


export function startGame() {
    return {
        type: START_GAME
    }
}

export function leaveGame() {
	return {
		type: LEAVE_GAME
	}
}

export function setLeader(userObj) {
    return {
        type: SET_LEADER,
        payload: userObj
    }
}

export function getConsonant(letter) {
	return {
		type: GET_CONSONANT,
		payload: letter
	}
}

export function getVowel(letter) {
	return {
		type: GET_VOWEL,
		payload: letter
	}
}

export function disableConsonant(bool) {
	return {
		type: DISABLE_CONSONANT,
		payload: bool
	}
}

export function disableVowel(bool) {
	return {
		type: DISABLE_VOWEL,
		payload: bool
	}
}
