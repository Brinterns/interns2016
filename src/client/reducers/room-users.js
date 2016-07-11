import * as types from '../actions/types';

export default (state = [], action) => {
    switch (action.type) {
        case types.UPDATE_ROOM_USERS: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};
