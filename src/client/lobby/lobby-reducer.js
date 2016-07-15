import { UPDATE_LOBBY_LIST, UPDATE_ROOM_LIST } from './lobby-actions';

const initialState = {
	rooms: [],
	users: []
};

const lobby = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_ROOM_LIST:
        	return Object.assign({}, state, {
        		rooms: action.payload
        	});
     	case UPDATE_LOBBY_LIST: {
            return Object.assign({}, state, {
        		users: action.payload
        	});
        }
        default:{
            return state;
        }
    }
};

export default lobby;