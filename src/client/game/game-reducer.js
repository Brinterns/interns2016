import * as actionTypes from './game-actions';

const initialState = {
	started: false,
    leader: {
        id: undefined, 
        name: undefined
    },
    letterList: [],
    disableConsonant: false,
    disableVowel: false,
    answering: false
};

const game = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.START_GAME: 
        	return Object.assign({}, state, {
        		started: true
        	});
        case actionTypes.LEAVE_GAME:
            return Object.assign({}, state, {
                started: false,
                letterList: [],
                disableConsonant: false,
                disableVowel: false,
                answering: false
            });
        case actionTypes.SET_LEADER:
            return Object.assign({}, state, {
                leader: {
                    id: action.payload.id,
                    name: action.payload.name
                },
                disableConsonant: action.payload.disableConsonant,
                disableVowel: action.payload.disableVowel
            });
        case actionTypes.GET_CONSONANT:
            return Object.assign({}, state, {
                letterList: [...state.letterList, action.payload]
            });
        case actionTypes.GET_VOWEL: 
            return Object.assign({}, state, {
                letterList: [...state.letterList, action.payload]
            });
        case actionTypes.DISABLE_CONSONANT:
            return Object.assign({}, state, {
                disableConsonant: action.payload
            });
        case actionTypes.DISABLE_VOWEL: 
            return Object.assign({}, state, {
                disableVowel: action.payload
            });
        case actionTypes.GET_CONSONANT: {
            let letterList = Array.from(state.letterList);
            letterList.push(action.payload);
            return Object.assign({}, state, {
                letterList: letterList
            });
        }
        case actionTypes.GET_VOWEL: {
            let letterList = Array.from(state.letterList);
            letterList.push(action.payload);
            return Object.assign({}, state, {
                letterList: letterList
            });
        }
        case actionTypes.DISABLE_CONSONANT:
            return Object.assign({}, state, {
                disableConsonant: action.payload
            });
        case actionTypes.DISABLE_VOWEL:
            return Object.assign({}, state, {
                disableVowel: action.payload
            });
        case actionTypes.START_ANSWERING:
            return Object.assign({}, state, {
                answering: true
            });
        case actionTypes.STOP_ANSWERING:
            return Object.assign({}, state, {
                answering: false
            });    
        default:
            return state;
    }
};

export default game;
