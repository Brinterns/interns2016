export const START_GAME = 'START_GAME';
export const LEAVE_GAME = 'LEAVE_GAME';
export const SET_LEADER = 'SET_LEADER';
export const GET_CONSONANT = 'GET_CONSONANT';
export const GET_VOWEL = 'GET_VOWEL';
export const DISABLE_CONSONANT = 'DISABLE_CONSONANT';
export const DISABLE_VOWEL = 'DISABLE_VOWEL';
export const START_ANSWERING = 'START_ANSWERING';
export const STOP_ANSWERING = 'STOP_ANSWERING';
export const TIMER_TICK = 'TIMER_TICK';
export const RESET_TIMER = 'RESET_TIMER';
export const DISABLE_START = 'DISABLE_START';
export const RESET_LETTERS = 'RESET_LETTERS';

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

export function startAnswering(time) {
	return {
		type: START_ANSWERING,
		payload: time
	}
}

export function stopAnswering() {
	return {
		type: STOP_ANSWERING
	}
}

export function timerTick() {
	return {
		type: TIMER_TICK
	}
}

export function resetTimer() {
	return {
		type: RESET_TIMER
	}
}

export function disableStart(bool) {
	return {
		type: DISABLE_START,
		payload: bool
	}
}

export function resetLetters(list) {
	console.log(list);
	return {
		type: RESET_LETTERS,
		payload: list
	}
}