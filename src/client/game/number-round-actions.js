export const SET_RANDOM_NUMBER = 'SET_RANDOM_NUMBER';
export const GET_LARGE = 'GET_LARGE';
export const GET_SMALL = 'GET_SMALL';
export const DISABLE_LARGE = 'DISABLE_LARGE';
export const DISABLE_SMALL = 'DISABLE_SMALL';
export const GET_EQUATION = 'GET_EQUATION';


export function setRandomNumber(number) {
	return {
		type: SET_RANDOM_NUMBER,
		payload: number
	}
}

export function getLarge(number) {
	return {
		type: GET_LARGE,
		payload: number
	}
}

export function getSmall(number) {
	return {
		type: GET_SMALL,
		payload: number
	}
}

export function disableLarge() {
    return {
        type: DISABLE_LARGE
    }
}

export function disableSmall() {
    return {
        type: DISABLE_SMALL
    }
}

export function getEquation() {
    return {
        type: GET_EQUATION
    }
}
