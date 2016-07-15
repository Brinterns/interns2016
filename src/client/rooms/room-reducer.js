import { UPDATE_ROOM_USERS, GET_ROOM_DATA } from './room-actions';

const initialState = {
	users: [],
	data: {},
	username: '',
	roomname: ''
};

const room = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ROOM_USERS:
        	return Object.assign({}, state, {
        		users: action.payload
        	});
        case GET_ROOM_DATA:
            return Object.assign({}, state, {
            	data: action.payload
            });
        default:
            return state;
    }
};

export default room;
