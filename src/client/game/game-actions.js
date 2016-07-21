export const START_GAME = 'START_GAME';
export const LEAVE_GAME = 'LEAVE_GAME';
export const SET_LEADER = 'SET_LEADER';
export const GET_CONSONANT = 'GET_CONSONANT';
export const GET_VOWEL = 'GET_VOWEL';


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

export function setLeader(user) {
    return {
        type: SET_LEADER,
        payload: user
    }
}

export function getConsonantDispatch(letter) {
	return {
		type: GET_CONSONANT,
		payload: letter
	}
}

export function getVowelDispatch(letter) {
	return {
		type: GET_VOWEL,
		payload: letter
	}
}
