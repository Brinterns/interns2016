import {
    UPDATE_LOBBY_LIST,
    UPDATE_ROOM_LIST,
    UPDATE_LETTER_SLIDER,
    UPDATE_NUMBER_SLIDER,
    UPDATE_CONUNDRUM_SLIDER,
    ROUND_TYPES,
    RESET_SLIDERS
} from './lobby-actions';

import { updateState } from '../utils/util';

const initialState = {
	rooms: [],
	users: [],
    roundTypes: {},
    letterSlider: 5,
    numberSlider: 5,
    conundrumSlider: 5
};

const lobby = (state = initialState, action) => {
    switch(action.type) {
        case RESET_SLIDERS:
            return updateState(state, {
                letterSlider: 5,
                numberSlider: 5,
                conundrumSlider: 5
            })
        case UPDATE_ROOM_LIST:
        	return updateState(state, {
        		rooms: action.payload
        	});
     	case UPDATE_LOBBY_LIST: {
            return updateState(state, {
        		users: action.payload
        	});
        }
        case UPDATE_LETTER_SLIDER: {
            return updateState(state, {
                letterSlider: action.payload
            });
        }
        case UPDATE_NUMBER_SLIDER: {
            return updateState(state, {
                numberSlider: action.payload
            });
        }
        case UPDATE_CONUNDRUM_SLIDER: {
            return updateState(state, {
                conundrumSlider: action.payload
            });
        }
        case ROUND_TYPES: {
            let newState = {
                roundTypes: action.payload
            };
            newState.letterSlider = ! action.payload.letters ? 0 : state.letterSlider;
            newState.numberSlider = ! action.payload.numbers ? 0 : state.numberSlider;
            newState.conundrumSlider = ! action.payload.conundrum ? 0 : state.conundrumSlider;
            return updateState(state, newState);
        }
        default:{
            return state;
        }
    }
};

export default lobby;
