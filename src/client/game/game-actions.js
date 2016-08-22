export const START_GAME = 'START_GAME';
export const LEAVE_GAME = 'LEAVE_GAME';
export const SET_LEADER = 'SET_LEADER';
export const DISABLE_START = 'DISABLE_START';
export const ROUND_ENDED = 'ROUND_ENDED';
export const ROUND_STARTED = 'ROUND_STARTED';
export const RESET_ROUND = 'RESET_ROUND';
export const RESET_FINISHED = 'RESET_FINISHED';
export const GAME_PARAMETERS = 'GAME_PARAMETERS';
export const GAME_FINISHED = 'GAME_FINISHED';
export const NEXT_ROUND_TYPE = 'NEXT_ROUND_TYPE';


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

export function disableStart(bool) {
	return {
		type: DISABLE_START,
		payload: bool
	}
}

export function roundEnded() {
	return {
		type: ROUND_ENDED
	}
}

export function roundStarted() {
	return {
		type: ROUND_STARTED
	}
}

export function resetRound() {
	return {
		type: RESET_ROUND
	}
}

export function resetFinished() {
	return {
		type: RESET_FINISHED
	}
}

export function gameParameters(params) {
    return {
        type: GAME_PARAMETERS,
        payload: params
    }
}

export function gameFinished() {
	return {
		type: GAME_FINISHED
	}
}

export function nextRoundType(type) {
	return {
		type: NEXT_ROUND_TYPE,
		payload: type
	}
}
