import * as types from '../actions/types';

const initialState = {
	rooms: [],
	users: []
};

const lobby = (state = initialState, action) => {
    switch(action.type) {
        case types.UPDATE_ROOM_LIST:
        	return Object.assign({}, state, {
        		rooms: action.payload
        	});
     	case types.UPDATE_LOBBY_LIST: {
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