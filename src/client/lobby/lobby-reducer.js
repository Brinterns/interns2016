import { UPDATE_LOBBY_LIST, UPDATE_ROOM_LIST } from './lobby-actions';
import updateState from '../utils/util';

const initialState = {
	rooms: [],
	users: []
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
        default:{
            return state;
        }
    }
};

export default lobby;