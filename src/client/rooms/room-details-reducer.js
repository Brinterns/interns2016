import * as types from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case types.GET_ROOM_DETAILS: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};
