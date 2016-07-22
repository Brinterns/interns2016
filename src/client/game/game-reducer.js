
import { START_GAME, LEAVE_GAME, SET_LEADER, GET_CONSONANT,
         GET_VOWEL, DISABLE_CONSONANT, DISABLE_VOWEL } from './game-actions';

const initialState = {
	started: false,
	leader: undefined,
    letterList: [],
    disableConsonant: false,
    disableVowel: false
};

const game = (state = initialState, action) => {
    switch (action.type) {
        case START_GAME: {
        	return Object.assign({}, state, {
        		started: true
        	});
        case LEAVE_GAME:
            return Object.assign({}, state, {
                started: false
            });
        case SET_LEADER:
            return Object.assign({}, state, {
                leader: action.payload.name
            });
        case GET_CONSONANT: {
            let letterList = Array.from(state.letterList);
            letterList.push(action.payload);
            return Object.assign({}, state, {
                letterList: letterList
            });
        }
        case GET_VOWEL: {
            let letterList = Array.from(state.letterList);
            letterList.push(action.payload);
            return Object.assign({}, state, {
                letterList: letterList
            });
        }
        case DISABLE_CONSONANT: {
            return Object.assign({}, state, {
                disableConsonant: action.payload
            });
        }
        case DISABLE_VOWEL: {
            return Object.assign({}, state, {
                disableVowel: action.payload
            });
        }
        default:
            return state;
    }
};

export default game;
