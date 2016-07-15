import * as types from '../actions/types';

const initialState = {
	users: [],
	data: {}
};

const room = (state = initialState, action) => {
    switch (action.type) {
        case types.UPDATE_ROOM_USERS: 
        	return Object.assign({}, state, {
        		users: action.payload
        	});
        case types.GET_ROOM_DATA: 
            return Object.assign({}, state, {
            	data: action.payload
            });
        default:
            return state;
    }
};

export default room;