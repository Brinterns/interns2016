import * as types from '../actions/types';

export default (state = [], action) => {
    switch (action.type) {
        case types.UPDATE_ROOM_USERS: {
            console.log("ANOOOIOOS");
            console.log(action.payload);
            return action.payload;
        }
        default: {
            return state;
        }
    }
};
