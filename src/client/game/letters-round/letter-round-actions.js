export const GET_CONSONANT = 'GET_CONSONANT';
export const GET_VOWEL = 'GET_VOWEL';
export const DISABLE_CONSONANT = 'DISABLE_CONSONANT';
export const DISABLE_VOWEL = 'DISABLE_VOWEL';
export const START_ANSWERING = 'START_ANSWERING';
export const STOP_ANSWERING = 'STOP_ANSWERING';
export const START_SUBMISSION = 'START_SUBMISSION';
export const STOP_SUBMISSION = 'STOP_SUBMISSION';
export const SUBMITTED_ANSWERS = 'SUBMITTED_ANSWERS';
export const ANSWER_TIMER_TICK = 'ANSWER_TIMER_TICK';
export const SUBMISSION_TIMER_TICK = 'SUBMISSION_TIMER_TICK';
export const RESET_ANSWER_TIMER = 'RESET_ANSWER_TIMER';
export const RESET_SUBMISSION_TIMER = 'RESET_SUBMISSION_TIMER';
export const RESET_LETTERS = 'RESET_LETTERS';
export const SET_BEST_ANSWER = 'SET_BEST_ANSWER';

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

export function startSubmission(time) {
	return {
		type: START_SUBMISSION,
		payload: time
	}
}

export function stopSubmission() {
	return {
		type: STOP_SUBMISSION
	}
}

export function submittedAnswers(finalAnswers) {
	return {
		type: SUBMITTED_ANSWERS,
		payload: finalAnswers
	}
}
export function answerTimerTick() {
	return {
		type: ANSWER_TIMER_TICK
	}
}

export function submissionTimerTick() {
	return {
		type: SUBMISSION_TIMER_TICK
	}
}

export function resetAnswerTimer() {
	return {
		type: RESET_ANSWER_TIMER
	}
}

export function resetSubmissionTimer() {
	return {
		type: RESET_SUBMISSION_TIMER
	}
}

export function resetLetters(list) {
	return {
		type: RESET_LETTERS,
		payload: list
	}
}

export function setBestAnswer(bestAnswerObj) {
	return {
		type: SET_BEST_ANSWER,
		payload: bestAnswerObj
	}
}