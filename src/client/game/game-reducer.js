import * as actionTypes from './game-actions';

import updateState from '../utils/util';

const initialState = {
	started: false,
    leader: {
        id: null, 
        name: null
    },
    letterList: [],
    disableConsonant: false,
    disableVowel: false,
    answering: true
};

const game = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.START_GAME: 
        	return updateState(state, {
        		started: true
        	});
        case actionTypes.LEAVE_GAME:
            return updateState(state, {
                started: false,
                letterList: [],
                disableConsonant: false,
                disableVowel: false,
                answering: false
            });
        case actionTypes.SET_LEADER:
            return updateState(state, {
                leader: {
                    id: action.payload.id,
                    name: action.payload.name
                },
                disableConsonant: action.payload.disableConsonant,
                disableVowel: action.payload.disableVowel
            });
        case actionTypes.GET_CONSONANT:
            return updateState(state, {
                letterList: [...state.letterList, action.payload]
            });
        case actionTypes.GET_VOWEL: 
            return updateState(state, {
                letterList: [...state.letterList, action.payload]
            });
        case actionTypes.DISABLE_CONSONANT:
            return updateState(state, {
                disableConsonant: action.payload
            });
        case actionTypes.DISABLE_VOWEL: 
            return updateState(state, {
                disableVowel: action.payload
            });
        case actionTypes.START_ANSWERING:
            return updateState(state, {
                answering: true
            });
        case actionTypes.STOP_ANSWERING:
            return updateState(state, {
                answering: false
            });    
        default:
            return state;
    }
};

export default game;
