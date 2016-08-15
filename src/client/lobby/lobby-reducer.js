import { 
    UPDATE_LOBBY_LIST, 
    UPDATE_ROOM_LIST, 
    UPDATE_LETTER_SLIDER,
    UPDATE_NUMBER_SLIDER
} from './lobby-actions';

import updateState from '../utils/util';

const initialState = {
	rooms: [],
	users: [],
    letterSlider: 5,
    numberSlider: 5
};

const lobby = (state = initialState, action) => {
    switch(action.type) {
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
        default:{
            return state;
        }
    }
};

export default lobby;